# Real-Time Clinician Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable Supabase Realtime subscriptions so clinicians can watch patients progress through the battery live from their dashboard.

**Architecture:**
We will utilize Supabase's built-in Postgres Changes (Realtime API). First, we will enable replication on the `task_results` and `sessions` tables via a SQL migration. Then, we will update the `ClinicianDashboardList` to subscribe to these changes and update the UI instantly without requiring a page refresh.

**Tech Stack:** Supabase Realtime API, React hooks.

---

### Task 1: Enable Realtime on Tables

**Files:**
- Create: `supabase/migrations/20260421000006_enable_realtime.sql`

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/20260421000006_enable_realtime.sql

-- Enable the 'supabase_realtime' publication for the specific tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE task_results;
ALTER PUBLICATION supabase_realtime ADD TABLE scoring_reports;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/
git commit -m "chore: enable supabase realtime on core tables"
```

### Task 2: Subscribe to Changes in Dashboard List

**Files:**
- Modify: `client/src/app/components/ClinicianDashboardList.tsx`

- [ ] **Step 1: Replace mock data with real data fetch & subscription**

```typescript
// Replace the fake generatePatients logic with:
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Inside component:
const [patients, setPatients] = useState<any[]>([]);

useEffect(() => {
  // 1. Initial Fetch
  const fetchPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('sessions')
      .select('*, scoring_reports(total_score)')
      .eq('clinician_id', user.id)
      .order('created_at', { ascending: false });
      
    if (data) setPatients(data);
  };
  
  fetchPatients();

  // 2. Real-time Subscription
  const channel = supabase.channel('dashboard-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sessions' },
      (payload) => {
        console.log('Realtime update received!', payload);
        // Refresh full list to get joined scoring_reports safely
        fetchPatients();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

// Update the rest of the component to map over `patients` instead of `filteredPatients` mock.
```

- [ ] **Step 2: Verify component builds**
Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add client/src/app/components/ClinicianDashboardList.tsx
git commit -m "feat: implement real-time subscriptions on dashboard list"
```

### Task 3: Live Task Tracker in Dashboard Detail

**Files:**
- Modify: `client/src/app/components/ClinicianDashboardDetail.tsx`

- [ ] **Step 1: Subscribe to task_results**

```typescript
// Inside ClinicianDashboardDetail:
const [liveTasks, setLiveTasks] = useState<string[]>([]);

useEffect(() => {
  if (!p?.id) return;

  // Initial fetch
  supabase.from('task_results').select('task_name').eq('session_id', p.id)
    .then(({ data }) => setLiveTasks((data || []).map(d => d.task_name)));

  // Subscribe to new tasks
  const channel = supabase.channel(`task-updates-${p.id}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'task_results', filter: `session_id=eq.${p.id}` },
      (payload) => {
        setLiveTasks(prev => [...prev, payload.new.task_name]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [p?.id]);

// Render a live progress bar based on liveTasks.length / 14
```

- [ ] **Step 2: Commit**

```bash
git add client/src/app/components/ClinicianDashboardDetail.tsx
git commit -m "feat: add live task progression tracker to session detail"
```
