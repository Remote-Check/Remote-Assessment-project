# Backend Implementation Guide

This document explains where to place backend code for the Remote Check MoCA platform.

---

## Directory Structure

```
/workspaces/default/code/
├── supabase/
│   ├── functions/
│   │   ├── start-session/
│   │   │   ├── index.ts                 # POST /start-session
│   │   │   └── _test.ts                # Tests
│   │   ├── submit-task/
│   │   │   ├── index.ts                 # POST /submit-task
│   │   │   └── _test.ts
│   │   ├── save-drawing/
│   │   │   ├── index.ts                 # POST /save-drawing
│   │   │   └── _test.ts
│   │   ├── complete-session/
│   │   │   ├── index.ts                 # POST /complete-session
│   │   │   └── _test.ts
│   │   ├── _shared/
│   │   │   ├── supabase.ts             # createClient helper
│   │   │   ├── validators.ts           # Request validation
│   │   │   ├── errors.ts               # Error handling
│   │   │   └── cors.ts                 # CORS headers
│   │   └── server/                      # Existing Hono server (keep)
│   │       ├── index.tsx
│   │       └── kv_store.tsx
│   ├── migrations/
│   │   ├── 20260421_initial_schema.sql # Use DATABASE_SCHEMA.sql
│   │   └── seed.sql                    # Test data (optional)
│   └── config.toml                      # Supabase config
├── src/
│   ├── lib/
│   │   └── scoring/
│   │       ├── index.ts                 # Main scoreSession() export
│   │       ├── scorers.ts               # Task-specific scoring
│   │       ├── norms.ts                 # Percentile lookup
│   │       ├── utils.ts                 # Helper functions
│   │       └── __tests__/
│   │           └── scoring.test.ts      # TDD test suite
│   ├── data/
│   │   ├── scoring-config.json          # Scoring rules
│   │   └── lifshitz-norms.json          # Israeli normative data
│   ├── types/
│   │   └── scoring.ts                   # TypeScript interfaces
│   └── app/                             # Frontend (already exists)
│       └── ...
├── BACKEND_HANDOFF.md                   # ✅ Main handoff doc
├── API_SPEC.md                          # ✅ API reference
├── DATABASE_SCHEMA.sql                  # ✅ Schema migration
└── BACKEND_README.md                    # ✅ This file
```

---

## Implementation Order

### Phase 1: Database Setup (Start Here)

1. **Create Supabase project:**
   ```bash
   npx supabase init
   npx supabase login
   npx supabase link --project-ref <your-project-id>
   ```

2. **Apply database schema:**
   ```bash
   cp DATABASE_SCHEMA.sql supabase/migrations/20260421_initial_schema.sql
   npx supabase db push
   ```

3. **Verify tables created:**
   ```bash
   npx supabase db diff
   ```

---

### Phase 2: Scoring Engine (Pure Functions)

Create these files in order:

**1. Type definitions** (`src/types/scoring.ts`):
```typescript
export interface TaskResult {
  taskName: string;
  rawData: any;
}

export interface ScoringReport {
  totalScore: number;
  subscores: {
    visuospatial: number;
    naming: number;
    attention: number;
    language: number;
    abstraction: number;
    delayedRecall: number;
    orientation: number;
  };
  percentile: number;
  needsReview: boolean;
  autoScoreErrors: string[];
}
```

**2. Scoring configuration** (`src/data/scoring-config.json`):
```json
{
  "naming": {
    "maxScore": 3,
    "correctAnswers": ["אריה", "קרנף", "גמל"]
  },
  "memory": {
    "maxFirstRecall": 5
  },
  "orientation": {
    "maxScore": 6,
    "fields": ["date", "month", "year", "day", "place", "city"]
  }
}
```

**3. Scorers** (`src/lib/scoring/scorers.ts`):
```typescript
export function scoreNaming(data: any): number {
  // Returns 0-3 based on correct animal names
}

export function scoreMemory(data: any): number {
  // Returns score based on first recall
}

export function scoreOrientation(data: any): number {
  // Returns 0-6 based on correct fields
}

// ... implement for all auto-scored tasks
```

**4. Norms lookup** (`src/lib/scoring/norms.ts`):
```typescript
import normsData from '../../data/lifshitz-norms.json';

export function getPercentile(score: number, ageBand: string): number {
  // Lookup percentile from Lifshitz 2012 data
}
```

**5. Main scoring function** (`src/lib/scoring/index.ts`):
```typescript
import { scoreNaming, scoreMemory, scoreOrientation } from './scorers';
import { getPercentile } from './norms';

export function scoreSession(
  taskResults: TaskResult[],
  ageBand: string
): ScoringReport {
  const subscores = {
    visuospatial: 0, // Manual review
    naming: 0,
    attention: 0,
    language: 0,
    abstraction: 0,
    delayedRecall: 0,
    orientation: 0
  };

  const errors: string[] = [];
  let needsReview = false;

  // Auto-score each task
  for (const result of taskResults) {
    try {
      switch (result.taskName) {
        case 'naming':
          subscores.naming = scoreNaming(result.rawData);
          break;
        case 'orientation':
          subscores.orientation = scoreOrientation(result.rawData);
          break;
        // ... other tasks
      }
    } catch (error) {
      errors.push(`Failed to score ${result.taskName}: ${error.message}`);
      needsReview = true;
    }
  }

  // Drawings always need review
  if (taskResults.some(t => ['cube', 'clock', 'trailMaking'].includes(t.taskName))) {
    needsReview = true;
  }

  const totalScore = Object.values(subscores).reduce((a, b) => a + b, 0);
  const percentile = getPercentile(totalScore, ageBand);

  return {
    totalScore,
    subscores,
    percentile,
    needsReview,
    autoScoreErrors: errors
  };
}
```

**6. Tests** (`src/lib/scoring/__tests__/scoring.test.ts`):
```typescript
import { scoreSession } from '../index';

describe('Scoring Engine', () => {
  it('should score perfect naming task', () => {
    const result = scoreSession([{
      taskName: 'naming',
      rawData: { answers: ['אריה', 'קרנף', 'גמל'] }
    }], '60-64');

    expect(result.subscores.naming).toBe(3);
  });

  it('should mark drawings for review', () => {
    const result = scoreSession([{
      taskName: 'cube',
      rawData: { strokes: [] }
    }], '60-64');

    expect(result.needsReview).toBe(true);
  });
});
```

---

### Phase 3: Edge Functions

Create each function in its own directory.

**Example: `supabase/functions/start-session/index.ts`**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify clinician auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const { caseId, ageBand } = await req.json();

    // Validate
    if (!caseId || !ageBand) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create session
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        case_id: caseId,
        age_band: ageBand,
        clinician_id: user.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Return session details
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        linkToken: session.link_token,
        sessionUrl: `${Deno.env.get('APP_URL')}/#/session/${session.link_token}`,
        createdAt: session.created_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Deploy:**
```bash
npx supabase functions deploy start-session
```

**Repeat for other functions** following API_SPEC.md

---

### Phase 4: Frontend Integration

Update existing files to use API:

**1. Create API client** (`src/lib/api/client.ts`):
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function submitTask(
  linkToken: string,
  taskName: string,
  taskData: any
) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-task`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${linkToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ taskName, taskData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit task');
  }

  return response.json();
}

export async function completeSession(linkToken: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/complete-session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${linkToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ linkToken })
  });

  if (!response.ok) {
    throw new Error('Failed to complete session');
  }

  return response.json();
}
```

**2. Update AssessmentContext.tsx:**
```typescript
import { submitTask } from '../lib/api/client';

const updateTaskData = async (taskName: string, data: any) => {
  try {
    await submitTask(linkToken, taskName, data);
    setState(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [taskName]: data }
    }));
  } catch (error) {
    console.error('Failed to save task:', error);
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};
```

---

## Environment Variables

Create `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-side only

# App
VITE_APP_URL=http://localhost:5173  # or production URL
```

Add to `.gitignore`:
```
.env.local
.env.*.local
```

---

## Testing Commands

```bash
# Unit tests (scoring engine)
npm test src/lib/scoring

# Edge function tests
deno test supabase/functions/**/*_test.ts

# Integration tests
npm test -- --integration

# Local Supabase
npx supabase start
npx supabase functions serve

# Deploy
npx supabase db push
npx supabase functions deploy
```

---

## Common Issues

### 1. CORS Errors
**Fix:** Add CORS headers to all Edge Functions (see example above)

### 2. RLS Policy Blocks
**Fix:** Ensure service role key is used in Edge Functions, not anon key

### 3. Link Token Invalid
**Check:** Verify token exists in sessions table and `used = FALSE`

### 4. Scoring Errors
**Fix:** Wrap each scorer in try-catch, add to `autoScoreErrors` array

---

## Next Steps

1. ✅ Read BACKEND_HANDOFF.md for full context
2. ✅ Read API_SPEC.md for endpoint details
3. ✅ Apply DATABASE_SCHEMA.sql to Supabase
4. Start with Phase 2 (Scoring Engine) - pure functions, no dependencies
5. Move to Phase 3 (Edge Functions) - test each one individually
6. Finally Phase 4 (Frontend Integration) - connect UI to backend

---

## Questions?

Refer to:
- BACKEND_HANDOFF.md - Complete implementation guide
- API_SPEC.md - API reference
- DATABASE_SCHEMA.sql - Database structure
- /src/imports/SPEC.md - Design specification
- /src/imports/CONTEXT.md - Project context

Good luck! 🚀
