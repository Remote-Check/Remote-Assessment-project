# Clinical Audit Logs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a secure, immutable `session_events` audit log to track all state transitions and critical actions (like overriding a score) for medical compliance.

**Architecture:**
We will create a new PostgreSQL table `session_events`. We will write Postgres triggers on the `sessions`, `task_results`, and `drawing_reviews` tables that automatically insert a record into the audit log whenever an insert or update occurs. This ensures that no event is ever missed, regardless of whether the change came from an Edge Function, a direct API call, or the dashboard.

**Tech Stack:** Supabase PostgreSQL, PL/pgSQL Triggers.

---

### Task 1: Create Audit Table and Triggers Migration

**Files:**
- Create: `supabase/migrations/20260421000005_audit_logs.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- supabase/migrations/20260421000005_audit_logs.sql

CREATE TABLE session_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  actor_id UUID, -- Can be null if it's the patient via link_token
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Clinicians can only view logs for their own sessions. No one can update/delete.
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view audit logs" ON session_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_events.session_id
      AND sessions.clinician_id = auth.uid()
    )
  );

CREATE POLICY "No one can modify audit logs" ON session_events
  FOR INSERT WITH CHECK (false);
CREATE POLICY "No one can update audit logs" ON session_events
  FOR UPDATE USING (false);
CREATE POLICY "No one can delete audit logs" ON session_events
  FOR DELETE USING (false);

-- Trigger Function
CREATE OR REPLACE FUNCTION log_session_event()
RETURNS TRIGGER AS $$
DECLARE
  v_event_type VARCHAR(50);
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_event_type := TG_TABLE_NAME || '_created';
    INSERT INTO session_events (session_id, event_type, actor_id, new_data)
    VALUES (
      CASE WHEN TG_TABLE_NAME = 'sessions' THEN NEW.id ELSE NEW.session_id END,
      v_event_type,
      auth.uid(),
      row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_event_type := TG_TABLE_NAME || '_updated';
    INSERT INTO session_events (session_id, event_type, actor_id, old_data, new_data)
    VALUES (
      CASE WHEN TG_TABLE_NAME = 'sessions' THEN NEW.id ELSE NEW.session_id END,
      v_event_type,
      auth.uid(),
      row_to_json(OLD),
      row_to_json(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to tables
CREATE TRIGGER audit_sessions_trigger
  AFTER INSERT OR UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION log_session_event();

CREATE TRIGGER audit_task_results_trigger
  AFTER INSERT OR UPDATE ON task_results
  FOR EACH ROW EXECUTE FUNCTION log_session_event();

CREATE TRIGGER audit_drawing_reviews_trigger
  AFTER UPDATE ON drawing_reviews
  FOR EACH ROW EXECUTE FUNCTION log_session_event();
```

- [ ] **Step 2: Verify syntax**
(For agentic workers: visually verify SQL syntax or run against a local pg_format linter).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/
git commit -m "feat: add immutable audit logging via pg triggers"
```

### Task 2: Expose Audit Logs in Clinician Dashboard

**Files:**
- Modify: `client/src/app/components/ClinicianDashboardDetail.tsx`

- [ ] **Step 1: Fetch and display logs**
Add a new tab or section at the bottom of the Session Detail page to fetch the `session_events` table for the active session.

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Inside ClinicianDashboardDetail component:
const [auditLogs, setAuditLogs] = useState<any[]>([]);

useEffect(() => {
  if (!p?.id) return;
  supabase.from('session_events')
    .select('*')
    .eq('session_id', p.id)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) setAuditLogs(data);
    });
}, [p?.id]);

// In the JSX render:
<div className="mt-12 bg-white rounded-xl p-6 border border-gray-200">
  <h3 className="text-xl font-bold mb-4">יומן אירועים (Audit Log)</h3>
  <div className="text-sm font-mono text-gray-500 max-h-64 overflow-y-auto space-y-2">
    {auditLogs.map(log => (
      <div key={log.id} className="border-b pb-2">
        <span className="font-bold">{new Date(log.created_at).toLocaleString()}</span> - 
        <span className="text-blue-600 ml-2">{log.event_type}</span>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Verify component compiles**
Run: `npm run build` inside `client/`

- [ ] **Step 3: Commit**
```bash
git add client/src/app/components/ClinicianDashboardDetail.tsx
git commit -m "feat: display audit logs in clinician dashboard"
```
