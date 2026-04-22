# Backend Implementation Handoff - Remote Check MoCA Platform

**Date:** April 21, 2026  
**Frontend Version:** Complete (14 MoCA tasks implemented)  
**Backend Status:** Infrastructure ready, implementation pending  
**Target:** AI Agent in Cursor IDE

---

## 1. Project Overview

**Remote Check** is a web-based neuropsychological assessment platform implementing the Hebrew Montreal Cognitive Assessment (MoCA) for 60+ population in Israel.

### Tech Stack
- **Frontend:** React 18.3.1 + TypeScript + Tailwind CSS v4 + react-router v7
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **Drawing:** HTML5 Canvas with stroke capture
- **Language:** Hebrew RTL interface with i18n support

### Key Design Principles
1. **Zero PII:** Only case IDs, age bands (not exact ages)
2. **Pseudonymization:** No patient names in database
3. **Privacy-first:** Israeli region deployment (il-central-1)
4. **One-time links:** Session tokens are single-use
5. **Manual review:** Drawings require clinician scoring (no AI auto-grading)

---

## 2. Current Frontend State

### 2.1 File Structure
```
src/
├── app/
│   ├── App.tsx                          # Main entry point
│   ├── routes.tsx                       # react-router configuration
│   ├── components/
│   │   ├── AssessmentLayout.tsx         # Patient flow wrapper
│   │   ├── LandingHub.tsx              # Entry screen
│   │   ├── TrailMakingTask.tsx         # Task 1: Connect numbers/letters
│   │   ├── CubeTask.tsx                # Task 2: Copy cube drawing
│   │   ├── ClockTask.tsx               # Task 3: Draw clock
│   │   ├── NamingTask.tsx              # Task 4: Name animals
│   │   ├── MemoryTask.tsx              # Task 5: Word recall
│   │   ├── DigitSpanTask.tsx           # Task 6: Number recall
│   │   ├── VigilanceTask.tsx           # Task 7: Tap on letter A
│   │   ├── SerialSevensTask.tsx        # Task 8: Subtract 7s
│   │   ├── LanguageTask.tsx            # Task 9: Sentence repetition
│   │   ├── AbstractionTask.tsx         # Task 10: Similarities
│   │   ├── DelayedRecallTask.tsx       # Task 11: Recall words
│   │   ├── OrientationTask.tsx         # Task 12: Date/time/place
│   │   ├── EndScreen.tsx               # Task completion
│   │   ├── BaseCanvas.tsx              # Drawing component
│   │   ├── PlaybackCanvas.tsx          # Stroke replay
│   │   ├── ClinicianDashboardList.tsx  # Patient list view
│   │   ├── ClinicianDashboardDetail.tsx # Patient detail + scoring
│   │   └── ListenButton.tsx            # TTS audio playback
│   └── store/
│       └── AssessmentContext.tsx       # State management
├── styles/
│   ├── index.css                       # Entry point
│   ├── fonts.css                       # Heebo font import
│   ├── theme.css                       # Design tokens
│   └── tailwind.css                    # Tailwind configuration
└── imports/
    ├── SPEC.md                         # Design specification
    ├── CONTEXT.md                      # Project context
    └── MEMORY.md                       # Session history

supabase/
└── functions/
    └── server/
        ├── index.tsx                   # Hono web server
        └── kv_store.tsx                # Key-value utilities

utils/
└── supabase/
    └── info.tsx                        # Supabase config exports
```

### 2.2 Data Model (Frontend)

Current state structure in `AssessmentContext.tsx`:

```typescript
interface AssessmentState {
  id: string | null;                    // Session ID (timestamp-based)
  lastPath: string;                     // Resume navigation
  isComplete: boolean;                  // Session finished
  tasks: {
    trailMaking?: {
      strokes: Stroke[];                // Drawing data
    };
    cube?: {
      strokes: Stroke[];
    };
    clock?: {
      strokes: Stroke[];
    };
    naming?: {
      answers: string[];                // Selected animal names
      timestamps: number[];
    };
    memory?: {
      wordsShown: string[];
      firstRecall: string[];
    };
    digitSpan?: {
      forward: { attempts: any[] };
      backward: { attempts: any[] };
    };
    vigilance?: {
      taps: { letter: string; timestamp: number; correct: boolean }[];
    };
    serial7?: {
      answers: number[];
      timestamps: number[];
    };
    language?: {
      sentence1: string;
      sentence2: string;
    };
    abstraction?: {
      train_bicycle: string;
      watch_ruler: string;
    };
    delayedRecall?: {
      words: string[];
    };
    orientation?: {
      date: string;
      month: string;
      year: string;
      day: string;
      place: string;
      city: string;
    };
  };
}

interface Stroke {
  points: { x: number; y: number; pressure?: number }[];
  startTime: number;
  endTime: number;
  color: string;
  width: number;
}
```

**Storage:** Currently in `localStorage` with key `moca_assessment_state`

---

## 3. Required Backend Implementation

### 3.1 Database Schema (Supabase PostgreSQL)

#### Table: `sessions`
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(50) NOT NULL,           -- e.g., "RC-2026-001"
  link_token UUID UNIQUE NOT NULL,        -- One-time session link
  used BOOLEAN DEFAULT FALSE,             -- Link consumed flag
  clinician_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  age_band VARCHAR(10),                   -- e.g., "60-64" (not exact age)
  status VARCHAR(20) DEFAULT 'pending'    -- pending | in_progress | completed
);

-- RLS Policy: Patients can only access via valid link_token
-- RLS Policy: Clinicians can view their own sessions
```

#### Table: `task_results`
```sql
CREATE TABLE task_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  task_name VARCHAR(50) NOT NULL,         -- e.g., "naming", "cube"
  raw_data JSONB NOT NULL,                -- Full task data from frontend
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(session_id, task_name)
);
```

#### Table: `scoring_reports`
```sql
CREATE TABLE scoring_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  total_score INTEGER,                    -- 0-30
  subscores JSONB,                        -- { visuospatial: 5, naming: 3, ... }
  percentile INTEGER,                     -- From Lifshitz 2012 norms
  needs_review BOOLEAN DEFAULT FALSE,
  auto_score_errors JSONB,                -- Failed auto-scoring attempts
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);
```

#### Table: `drawing_reviews`
```sql
CREATE TABLE drawing_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  task_name VARCHAR(20) NOT NULL,         -- "cube" | "clock" | "trailMaking"
  storage_path TEXT,                      -- Supabase Storage PNG path
  strokes_data JSONB NOT NULL,            -- Full stroke array
  clinician_score INTEGER,
  rubric_items JSONB,                     -- Checkbox states from spec 3.6.2
  clinician_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  
  UNIQUE(session_id, task_name)
);
```

### 3.2 Supabase Edge Functions

All functions in `supabase/functions/` directory, using Deno runtime.

#### Function: `start-session`
**Path:** `/functions/v1/start-session`  
**Method:** POST  
**Auth:** Requires clinician JWT

**Request:**
```json
{
  "caseId": "RC-2026-001",
  "ageBand": "60-64"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "linkToken": "uuid",
  "sessionUrl": "https://app.remotecheck.com/#/session/{linkToken}"
}
```

**Logic:**
1. Validate clinician auth
2. Create session record
3. Generate one-time `link_token`
4. Return shareable URL

---

#### Function: `submit-task`
**Path:** `/functions/v1/submit-task`  
**Method:** POST  
**Auth:** Requires valid `link_token` in header

**Request:**
```json
{
  "linkToken": "uuid",
  "taskName": "naming",
  "taskData": { /* AssessmentState.tasks[taskName] */ }
}
```

**Response:**
```json
{
  "success": true,
  "taskId": "uuid"
}
```

**Logic:**
1. Validate link_token (must be unused or in_progress)
2. Mark session as `in_progress` if first task
3. Insert/update `task_results` record
4. If drawing task (cube/clock/trailMaking), call `save-drawing`

---

#### Function: `save-drawing`
**Path:** `/functions/v1/save-drawing`  
**Method:** POST  
**Auth:** Internal only (called by `submit-task`)

**Request:**
```json
{
  "sessionId": "uuid",
  "taskName": "cube",
  "strokesData": [/* Stroke[] */],
  "canvasPNG": "base64..."               // Optional: rendered image
}
```

**Logic:**
1. Store strokes in `drawing_reviews.strokes_data`
2. If PNG provided, upload to Supabase Storage bucket `drawings/{sessionId}/{taskName}.png`
3. Set `needs_review = true` in `scoring_reports`

---

#### Function: `complete-session`
**Path:** `/functions/v1/complete-session`  
**Method:** POST  
**Auth:** Requires valid `link_token`

**Request:**
```json
{
  "linkToken": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "totalScore": 27,
  "needsReview": true,
  "subscores": { /* ... */ }
}
```

**Logic:**
1. Mark session `status = completed`, `completed_at = NOW()`
2. Mark `link_token` as `used = true`
3. Run auto-scoring engine (see section 3.3)
4. Return preliminary score

---

### 3.3 Scoring Engine

**Location:** Create `/src/lib/scoring/` directory

**Files to implement:**
```
src/lib/scoring/
├── index.ts              # scoreSession() main function
├── scorers.ts            # Task-specific scoring functions
├── norms.ts              # Percentile lookup (Lifshitz 2012 data)
├── utils.ts              # Helper functions
└── __tests__/
    └── scoring.test.ts   # TDD test suite
```

**Example signature:**
```typescript
export function scoreSession(taskResults: TaskResult[]): ScoringReport {
  // Auto-score: naming, memory, digitSpan, vigilance, serial7, language, abstraction, orientation
  // Manual review: trailMaking, cube, clock (set needsReview = true)
  
  return {
    totalScore: number,
    subscores: {
      visuospatial: number,
      naming: number,
      attention: number,
      language: number,
      abstraction: number,
      delayedRecall: number,
      orientation: number
    },
    percentile: number,              // From norms.ts
    needsReview: boolean,
    autoScoreErrors: string[]        // Failed scoring attempts
  };
}
```

**Norms data:** Create `/src/data/lifshitz-norms.json` with age-stratified percentiles from Lifshitz et al. 2012 (Israeli MoCA norms).

---

### 3.4 Frontend Integration Points

#### Update `AssessmentContext.tsx`

Replace `localStorage` persistence with API calls:

```typescript
// Current: localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
// Replace with:

const updateTaskData = async (taskName: string, data: any) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${linkToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ linkToken, taskName, taskData: data })
    });
    
    if (!response.ok) throw new Error('Failed to save task');
    
    // Update local state
    setState(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [taskName]: data }
    }));
  } catch (error) {
    console.error('Save error:', error);
    // Fallback to localStorage for offline resilience
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};
```

#### Update `EndScreen.tsx`

Call `complete-session` when patient finishes:

```typescript
useEffect(() => {
  const completeAssessment = async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/complete-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${linkToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ linkToken })
    });
    
    const result = await response.json();
    // Show preliminary score: result.totalScore
  };
  
  completeAssessment();
}, []);
```

#### Update `ClinicianDashboardList.tsx`

Fetch patient sessions from database:

```typescript
const [sessions, setSessions] = useState([]);

useEffect(() => {
  const fetchSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select(`
        *,
        scoring_reports(total_score, needs_review)
      `)
      .eq('clinician_id', currentUser.id)
      .order('created_at', { ascending: false });
    
    setSessions(data);
  };
  
  fetchSessions();
}, []);
```

#### Update `ClinicianDashboardDetail.tsx`

Fetch drawing data and enable scoring:

```typescript
const [drawingReviews, setDrawingReviews] = useState([]);

useEffect(() => {
  const fetchDrawings = async () => {
    const { data } = await supabase
      .from('drawing_reviews')
      .select('*')
      .eq('session_id', sessionId);
    
    setDrawingReviews(data);
  };
  
  fetchDrawings();
}, [sessionId]);

const saveRubricScore = async (taskName: string, rubric: any, score: number) => {
  await supabase
    .from('drawing_reviews')
    .update({
      rubric_items: rubric,
      clinician_score: score,
      reviewed_at: new Date(),
      reviewed_by: currentUser.id
    })
    .eq('session_id', sessionId)
    .eq('task_name', taskName);
};
```

---

## 4. Configuration Files

### 4.1 Environment Variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
```

### 4.2 Supabase Client Setup

Update `/utils/supabase/info.tsx`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const projectId = import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0];
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  publicAnonKey
);
```

---

## 5. Implementation Checklist

### Phase 1: Database Setup
- [ ] Create Supabase project in `il-central-1` region
- [ ] Run migrations for 4 tables (sessions, task_results, scoring_reports, drawing_reviews)
- [ ] Configure RLS policies
- [ ] Create storage bucket `drawings` with private access
- [ ] Set up clinician authentication (email/password)

### Phase 2: Edge Functions
- [ ] Implement `start-session` function
- [ ] Implement `submit-task` function
- [ ] Implement `save-drawing` function
- [ ] Implement `complete-session` function
- [ ] Add error handling and logging to all functions
- [ ] Test with Postman/curl

### Phase 3: Scoring Engine
- [ ] Create `/src/lib/scoring/` directory
- [ ] Implement `scorers.ts` with task-specific logic
- [ ] Add Lifshitz norms data to `/src/data/lifshitz-norms.json`
- [ ] Implement `norms.ts` percentile lookup
- [ ] Write TDD test suite (target: 95% coverage)
- [ ] Integrate into `complete-session` function

### Phase 4: Frontend Integration
- [ ] Update `AssessmentContext.tsx` to use API
- [ ] Add loading states and error handling
- [ ] Implement offline fallback (localStorage)
- [ ] Update `EndScreen.tsx` to call `complete-session`
- [ ] Update dashboard list to fetch from database
- [ ] Update dashboard detail to load drawings and scoring
- [ ] Add session link generation UI for clinicians
- [ ] Test complete patient → clinician flow

### Phase 5: Polish
- [ ] Add retry logic for network failures
- [ ] Implement optimistic updates
- [ ] Add session timeout handling
- [ ] Create PDF export functionality
- [ ] Create Excel export functionality
- [ ] Add clinician notes autosave
- [ ] Performance testing (100+ concurrent sessions)

---

## 6. Testing Strategy

### 6.1 Unit Tests
```bash
# Scoring engine
npm test src/lib/scoring

# Edge functions
deno test supabase/functions/**/*_test.ts
```

### 6.2 Integration Tests
```typescript
// Test complete session flow
describe('Patient Session Flow', () => {
  it('should create session, submit tasks, complete, and score', async () => {
    // 1. Clinician creates session
    const { linkToken } = await startSession();
    
    // 2. Patient submits all tasks
    for (const task of mockTasks) {
      await submitTask(linkToken, task);
    }
    
    // 3. Patient completes session
    const result = await completeSession(linkToken);
    
    // 4. Verify score calculated
    expect(result.totalScore).toBeDefined();
    expect(result.totalScore).toBeLessThanOrEqual(30);
  });
});
```

### 6.3 Load Testing
Use k6 or Artillery to simulate:
- 100 concurrent patient sessions
- 50 clinicians reviewing simultaneously
- Drawing upload stress test (5MB PNGs)

---

## 7. Security Checklist

- [ ] All tables have RLS policies enabled
- [ ] Link tokens are UUID v4 (cryptographically random)
- [ ] Link tokens expire after 7 days unused
- [ ] Service role key never exposed to frontend
- [ ] CORS configured for production domain only
- [ ] Rate limiting on Edge Functions (100 req/min per IP)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize clinician notes)
- [ ] HTTPS-only in production
- [ ] Content Security Policy headers

---

## 8. Deployment

### 8.1 Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Link to project
supabase link --project-ref your-project-id

# Deploy migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy start-session
supabase functions deploy submit-task
supabase functions deploy save-drawing
supabase functions deploy complete-session
```

### 8.2 Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel --prod
# or
netlify deploy --prod
```

---

## 9. Monitoring & Observability

### Key Metrics
- Session completion rate (target: >90%)
- Average session duration (expected: 25-30 min)
- Drawing upload success rate (target: >99%)
- Auto-scoring accuracy (compare to manual review)
- API error rate (target: <0.1%)

### Logging
```typescript
// Add to all Edge Functions
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  function: 'start-session',
  clinicianId: userId,
  caseId: caseId,
  duration: endTime - startTime
}));
```

### Alerts
- Alert if >10% of sessions fail to complete
- Alert if drawing upload fails 3+ times for same session
- Alert if auto-scoring errors exceed 5% of sessions

---

## 10. Known Issues & Workarounds

### Issue 1: Figma Make Preview Warnings
**Problem:** Console shows "multiple renderers" and "invalid hook call" warnings  
**Cause:** Figma Make's preview iframe environment creates multiple React instances  
**Impact:** None - these are environmental warnings, not application errors  
**Action:** Ignore these warnings; they do not affect production build

### Issue 2: Back Button Navigation
**Problem:** Browser back button breaks preview after navigation  
**Resolution:** Fixed in `AssessmentLayout.tsx` line 132 - uses explicit route logic instead of `navigate(-1)`

### Issue 3: Canvas Pressure Data
**Problem:** Not all browsers support `PointerEvent.pressure`  
**Workaround:** Default to 0.5 if pressure unavailable  
**Code:** `pressure: event.pressure || 0.5` in `BaseCanvas.tsx`

---

## 11. Documentation References

| Document | Purpose |
|----------|---------|
| `/src/imports/SPEC.md` | Complete design specification |
| `/src/imports/CONTEXT.md` | Project vision and technical context |
| `/src/imports/MEMORY.md` | Implementation history |
| This file | Backend integration guide |

---

## 12. Contact & Support

**Primary Developer:** [Your Name]  
**Repository:** https://github.com/Reakwind/Remote-Assessment-project  
**Figma Design:** [Link to design files]  
**MoCA License:** [Link to licensing agreement]

**Questions for AI Agent in Cursor:**
- Use this document as the source of truth for backend architecture
- Refer to SPEC.md for UI/UX requirements
- Check CONTEXT.md for project goals and constraints
- Test thoroughly before marking any phase complete
- Document all deviations from this spec with rationale

---

**Last Updated:** April 21, 2026  
**Document Version:** 1.0  
**Status:** Ready for Backend Implementation
