# API Specification - Remote Check Backend

Quick reference for implementing Supabase Edge Functions.

---

## Base URL
```
Production: https://{project-id}.supabase.co/functions/v1
Local Dev:  http://localhost:54321/functions/v1
```

---

## Authentication

### Clinician Endpoints
**Header:** `Authorization: Bearer {supabase-jwt-token}`

### Patient Endpoints  
**Header:** `Authorization: Bearer {link-token}`

---

## Endpoints

### 1. Start Session (Clinician)

**POST** `/start-session`

Creates a new assessment session and generates a one-time patient link.

**Request:**
```json
{
  "caseId": "RC-2026-001",
  "ageBand": "60-64"
}
```

**Response:** `200 OK`
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "linkToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "sessionUrl": "https://app.remotecheck.com/#/session/7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "createdAt": "2026-04-21T10:30:00Z"
}
```

**Errors:**
- `401 Unauthorized` - Invalid clinician token
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Case ID already exists

---

### 2. Submit Task (Patient)

**POST** `/submit-task`

Saves task data for a specific assessment task.

**Headers:**
```
Authorization: Bearer {link-token}
Content-Type: application/json
```

**Request:**
```json
{
  "taskName": "naming",
  "taskData": {
    "answers": ["אריה", "קרנף", "גמל"],
    "timestamps": [1234567890, 1234567895, 1234567900]
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "taskId": "123e4567-e89b-12d3-a456-426614174000",
  "savedAt": "2026-04-21T10:35:00Z"
}
```

**Errors:**
- `401 Unauthorized` - Invalid or used link token
- `400 Bad Request` - Invalid task name or data
- `409 Conflict` - Task already submitted (use PUT to update)

---

### 3. Save Drawing (Internal)

**POST** `/save-drawing`

Internal endpoint called by `submit-task` for drawing tasks.

**Request:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "taskName": "cube",
  "strokesData": [
    {
      "points": [
        { "x": 100, "y": 150, "pressure": 0.8 },
        { "x": 105, "y": 155, "pressure": 0.9 }
      ],
      "startTime": 1234567890,
      "endTime": 1234567892,
      "color": "#000000",
      "width": 2
    }
  ],
  "canvasPNG": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." // optional
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "storagePath": "drawings/550e8400-e29b-41d4-a716-446655440000/cube.png",
  "reviewId": "789e0123-e89b-12d3-a456-426614174000"
}
```

**Logic:**
1. Store `strokesData` in `drawing_reviews` table
2. If `canvasPNG` provided, upload to Supabase Storage
3. Set `needs_review = true` in `scoring_reports`

---

### 4. Complete Session (Patient)

**POST** `/complete-session`

Marks session as complete and triggers auto-scoring.

**Headers:**
```
Authorization: Bearer {link-token}
```

**Request:**
```json
{
  "linkToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "completedAt": "2026-04-21T10:55:00Z",
  "scoring": {
    "totalScore": 27,
    "subscores": {
      "visuospatial": 4,
      "naming": 3,
      "attention": 6,
      "language": 3,
      "abstraction": 2,
      "delayedRecall": 4,
      "orientation": 5
    },
    "percentile": 75,
    "needsReview": true,
    "autoScoreErrors": []
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid link token
- `400 Bad Request` - Session already completed
- `422 Unprocessable Entity` - Missing required tasks

**Side Effects:**
1. Marks session `status = 'completed'`
2. Sets `completed_at = NOW()`
3. Marks `link_token` as `used = true`
4. Runs auto-scoring engine
5. Creates `scoring_reports` record

---

## 5. Get Session (Clinician)

**GET** `/session/:sessionId`

Retrieves complete session data for clinician review.

**Headers:**
```
Authorization: Bearer {clinician-jwt}
```

**Response:** `200 OK`
```json
{
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "caseId": "RC-2026-001",
    "ageBand": "60-64",
    "status": "completed",
    "createdAt": "2026-04-21T10:30:00Z",
    "startedAt": "2026-04-21T10:32:00Z",
    "completedAt": "2026-04-21T10:55:00Z"
  },
  "tasks": [
    {
      "taskName": "naming",
      "rawData": { /* ... */ },
      "submittedAt": "2026-04-21T10:35:00Z"
    }
  ],
  "scoring": {
    "totalScore": 27,
    "subscores": { /* ... */ },
    "percentile": 75,
    "needsReview": true,
    "computedAt": "2026-04-21T10:55:00Z"
  },
  "drawings": [
    {
      "taskName": "cube",
      "storagePath": "drawings/.../cube.png",
      "strokesData": [ /* ... */ ],
      "clinicianScore": null,
      "rubricItems": null,
      "clinicianNotes": null
    }
  ]
}
```

---

## 6. Update Drawing Score (Clinician)

**PATCH** `/drawing-review/:reviewId`

Updates clinician scoring for a drawing task.

**Headers:**
```
Authorization: Bearer {clinician-jwt}
Content-Type: application/json
```

**Request:**
```json
{
  "clinicianScore": 4,
  "rubricItems": {
    "contour": true,
    "internal_lines": true,
    "3d_effect": true,
    "parallel_lines": false
  },
  "clinicianNotes": "קווים נכונים אך אין אפקט תלת מימד ברור"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "reviewId": "789e0123-e89b-12d3-a456-426614174000",
  "updatedAt": "2026-04-21T11:00:00Z",
  "newTotalScore": 28
}
```

**Side Effects:**
1. Updates `drawing_reviews` record
2. Recalculates total score in `scoring_reports`
3. Sets `reviewed_at = NOW()` and `reviewed_by = clinician_id`

---

## 7. List Sessions (Clinician)

**GET** `/sessions`

Lists all sessions for the authenticated clinician.

**Query Parameters:**
- `status` (optional): `pending | in_progress | completed`
- `needsReview` (optional): `true | false`
- `limit` (optional): default 50, max 100
- `offset` (optional): default 0

**Example:**
```
GET /sessions?status=completed&needsReview=true&limit=20
```

**Response:** `200 OK`
```json
{
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "caseId": "RC-2026-001",
      "ageBand": "60-64",
      "status": "completed",
      "totalScore": 27,
      "needsReview": true,
      "createdAt": "2026-04-21T10:30:00Z",
      "completedAt": "2026-04-21T10:55:00Z"
    }
  ],
  "total": 142,
  "limit": 20,
  "offset": 0
}
```

---

## Data Models

### Stroke Object
```typescript
interface Stroke {
  points: Array<{
    x: number;
    y: number;
    pressure?: number;  // 0.0 - 1.0, optional
  }>;
  startTime: number;    // Unix timestamp (ms)
  endTime: number;      // Unix timestamp (ms)
  color: string;        // Hex color, e.g., "#000000"
  width: number;        // Stroke width in pixels
}
```

### Task Data Examples

**Naming Task:**
```json
{
  "taskName": "naming",
  "taskData": {
    "answers": ["אריה", "קרנף", "גמל"],
    "timestamps": [1234567890, 1234567895, 1234567900]
  }
}
```

**Memory Task:**
```json
{
  "taskName": "memory",
  "taskData": {
    "wordsShown": ["פנים", "משי", "כנסייה", "אדום", "דליה"],
    "firstRecall": ["פנים", "משי", "כנסייה"],
    "firstRecallTimestamp": 1234567900
  }
}
```

**Digit Span:**
```json
{
  "taskName": "digitSpan",
  "taskData": {
    "forward": {
      "attempts": [
        { "sequence": [2, 1, 8, 5, 4], "response": [2, 1, 8, 5, 4], "correct": true },
        { "sequence": [7, 4, 2], "response": [7, 4, 2], "correct": true }
      ]
    },
    "backward": {
      "attempts": [
        { "sequence": [7, 2, 4], "response": [4, 2, 7], "correct": true },
        { "sequence": [6, 3, 9], "response": [9, 3, 7], "correct": false }
      ]
    }
  }
}
```

**Serial 7s:**
```json
{
  "taskName": "serial7",
  "taskData": {
    "answers": [93, 86, 79, 72, 65],
    "timestamps": [1234567890, 1234567895, 1234567900, 1234567905, 1234567910]
  }
}
```

**Orientation:**
```json
{
  "taskName": "orientation",
  "taskData": {
    "date": "21",
    "month": "אפריל",
    "year": "2026",
    "day": "שלישי",
    "place": "בית חולים",
    "city": "תל אביב"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_LINK_TOKEN",
    "message": "The provided link token is invalid or has already been used",
    "details": {
      "linkToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "used": true
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_AUTH` | 401 | Invalid or expired JWT token |
| `INVALID_LINK_TOKEN` | 401 | Link token invalid or already used |
| `FORBIDDEN` | 403 | User lacks permission for this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_CASE_ID` | 409 | Case ID already exists |
| `SESSION_ALREADY_COMPLETED` | 400 | Cannot modify completed session |
| `MISSING_TASKS` | 422 | Required tasks not submitted |
| `INTERNAL_ERROR` | 500 | Server error (check logs) |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/start-session` | 100 req | per hour |
| `/submit-task` | 500 req | per hour |
| `/complete-session` | 50 req | per hour |
| All others | 1000 req | per hour |

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1619870400
```

---

## Webhook Events (Future)

Optional: Configure webhooks to notify external systems.

### `session.completed`
```json
{
  "event": "session.completed",
  "timestamp": "2026-04-21T10:55:00Z",
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "caseId": "RC-2026-001",
    "totalScore": 27,
    "needsReview": true
  }
}
```

### `drawing.reviewed`
```json
{
  "event": "drawing.reviewed",
  "timestamp": "2026-04-21T11:00:00Z",
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "taskName": "cube",
    "clinicianScore": 4,
    "reviewedBy": "clinician-uuid"
  }
}
```

---

## Implementation Notes

### CORS Configuration
```typescript
// In Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.remotecheck.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### Database Indexes
```sql
-- For performance
CREATE INDEX idx_sessions_clinician ON sessions(clinician_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_task_results_session ON task_results(session_id);
CREATE INDEX idx_scoring_needs_review ON scoring_reports(needs_review);
```

### Logging Format
```typescript
console.log(JSON.stringify({
  level: 'info',
  function: 'start-session',
  clinicianId: userId,
  caseId: caseId,
  duration: endTime - startTime,
  timestamp: new Date().toISOString()
}));
```

---

**Version:** 1.0  
**Last Updated:** April 21, 2026
