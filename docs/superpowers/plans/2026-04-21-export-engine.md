# PDF/CSV Export Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a secure, server-side PDF and CSV generation engine that allows clinicians to export comprehensive scoring reports and structured research data directly from the Supabase backend.

**Architecture:**
We will use Supabase Edge Functions combined with `jspdf` for PDF generation and standard string manipulation for CSVs. The functions will validate clinician JWTs, query the necessary `sessions`, `task_results`, and `scoring_reports` tables via the Supabase client, format the data, and return a downloadable Blob. We will ensure all exports adhere to the "Zero PII" (Case ID only) constraint.

**Tech Stack:** Deno, Supabase Edge Functions, `jspdf`, `jspdf-autotable`.

---

### Task 1: Generate CSV Export Edge Function

**Files:**
- Create: `supabase/functions/export-csv/index.ts`
- Create: `supabase/functions/export-csv/package.json` (for dependencies if needed, or use Deno imports)

- [ ] **Step 1: Write the Edge Function structure**

```typescript
// supabase/functions/export-csv/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Expects a clinician JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) return new Response('Unauthorized', { status: 401 });

  // Query all completed sessions for this clinician
  const { data: sessions, error: dbError } = await supabase
    .from('sessions')
    .select(`
      case_id,
      age_band,
      created_at,
      scoring_reports ( total_score, percentile, needs_review )
    `)
    .eq('clinician_id', user.id)
    .eq('status', 'completed');

  if (dbError) return new Response('Database error', { status: 500 });

  // Construct CSV
  const header = ['Case ID', 'Age Band', 'Date', 'Total Score', 'Percentile', 'Needs Review'].join(',');
  const rows = (sessions || []).map(s => {
    const report = Array.isArray(s.scoring_reports) ? s.scoring_reports[0] : s.scoring_reports;
    return [
      s.case_id,
      s.age_band,
      new Date(s.created_at).toISOString().split('T')[0],
      report?.total_score ?? 'N/A',
      report?.percentile ?? 'N/A',
      report?.needs_review ? 'Yes' : 'No'
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="moca_export.csv"',
    },
  });
});
```

- [ ] **Step 2: Deploy and verify the function**

Run: `supabase functions deploy export-csv`
Expected: Successful deployment. (If running locally, `supabase functions serve` can be used).

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/export-csv
git commit -m "feat: implement CSV export edge function"
```

### Task 2: Generate PDF Export Edge Function

**Files:**
- Create: `supabase/functions/export-pdf/index.ts`

- [ ] **Step 1: Write the Edge Function structure with jsPDF**

```typescript
// supabase/functions/export-pdf/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';
// Note: RTL text rendering in jsPDF is complex, but for MVP we will use basic ASCII or pre-rendered images if possible.
// For this plan, we will output basic English labels for the clinical report to bypass complex RTL shaping issues on the backend.

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  let body: { sessionId: string };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !user) return new Response('Unauthorized', { status: 401 });

  const { data: session } = await supabase
    .from('sessions')
    .select('*, scoring_reports(*)')
    .eq('id', body.sessionId)
    .eq('clinician_id', user.id)
    .single();

  if (!session) return new Response('Session not found', { status: 404 });

  const report = Array.isArray(session.scoring_reports) ? session.scoring_reports[0] : session.scoring_reports;

  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text('Remote Check - Clinical Report', 20, 20);
  
  doc.setFontSize(14);
  doc.text(`Case ID: ${session.case_id}`, 20, 40);
  doc.text(`Age Band: ${session.age_band}`, 20, 50);
  doc.text(`Date: ${new Date(session.created_at).toLocaleDateString()}`, 20, 60);

  doc.text(`Total Score: ${report?.total_score || 'Pending'}/30`, 20, 80);
  doc.text(`Percentile: ${report?.percentile || 'N/A'}%`, 20, 90);
  
  if (report?.needs_review) {
    doc.setTextColor(200, 0, 0);
    doc.text('WARNING: PROVISIONAL SCORE (NEEDS MANUAL REVIEW)', 20, 110);
  }

  const pdfOutput = doc.output('arraybuffer');

  return new Response(pdfOutput, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report_${session.case_id}.pdf"`,
    },
  });
});
```

- [ ] **Step 2: Deploy and verify**

Run: `supabase functions deploy export-pdf`
Expected: Successful deployment.

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/export-pdf
git commit -m "feat: implement basic PDF export edge function"
```

### Task 3: Integrate Export Buttons in Frontend

**Files:**
- Modify: `client/src/app/components/ClinicianDashboardDetail.tsx`
- Modify: `client/src/app/components/ClinicianDashboardList.tsx`

- [ ] **Step 1: Add download logic to DashboardDetail**

```typescript
// client/src/app/components/ClinicianDashboardDetail.tsx
import { supabase } from '../../lib/supabase';

// Inside component:
const handlePdfExport = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-pdf`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sessionId: p.id }) // Ensure you pass the correct session ID
  });
  
  if (!res.ok) {
    alert('Failed to generate PDF');
    return;
  }
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report_${p.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

// Bind to the <button> inside the header section
```

- [ ] **Step 2: Add CSV export to DashboardList**

```typescript
// client/src/app/components/ClinicianDashboardList.tsx
// Inside component header area:
const handleCsvExport = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-csv`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  });
  
  if (!res.ok) return;
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `moca_export.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};
```

- [ ] **Step 3: Run linter and verify**
Run: `npm run lint`

- [ ] **Step 4: Commit**
```bash
git add client/src/app/components/
git commit -m "feat: wire up export buttons to backend edge functions"
```
