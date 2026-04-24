import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail } from '../_shared/notifications.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Client-side scoring (see client/src/lib/scoring) produces a ScoringReport
// whose `domains` array maps 1:1 to the scoring_reports.subscores jsonb
// columns. Translate domain ids to subscore keys here so legacy rows stay
// consistent.
const DOMAIN_TO_SUBSCORE: Record<string, string> = {
  visuospatial: 'visuospatial',
  naming: 'naming',
  attention: 'attention',
  language: 'language',
  abstraction: 'abstraction',
  memory: 'delayedRecall',
  orientation: 'orientation',
};

interface DomainInput {
  domain?: string;
  raw?: number;
}

interface ScoringReportInput {
  totalRaw?: number;
  totalAdjusted?: number;
  totalProvisional?: boolean;
  pendingReviewCount?: number;
  normPercentile?: number | null;
  domains?: DomainInput[];
}

function buildSubscores(report: ScoringReportInput | undefined): Record<string, number> | null {
  if (!report || !Array.isArray(report.domains)) return null;
  const subscores: Record<string, number> = {
    visuospatial: 0,
    naming: 0,
    attention: 0,
    language: 0,
    abstraction: 0,
    delayedRecall: 0,
    orientation: 0,
  };
  for (const d of report.domains) {
    if (!d?.domain || typeof d.raw !== 'number') continue;
    const key = DOMAIN_TO_SUBSCORE[d.domain];
    if (!key) continue;
    subscores[key] = d.raw;
  }
  return subscores;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: { sessionId: string; linkToken: string; scoringReport?: ScoringReportInput };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { sessionId, linkToken, scoringReport } = body;
  
  if (!sessionId || !linkToken) {
    return json({ error: 'Missing required fields: sessionId, linkToken' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Validate session is in_progress
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, status, link_token, case_id, clinician_id, patient_id, assessment_type')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return json({ error: 'Session not found' }, 404);
  }
  if (session.link_token !== linkToken) {
    return json({ error: 'Unauthorized' }, 401);
  }

  if (session.status === 'completed') {
    return json({ error: 'Session already completed' }, 409);
  }

  // Mark session completed via RPC
  const { error: markError } = await supabase.rpc('mark_session_completed', {
    p_session_id: sessionId
  });

  if (markError) {
    console.error('Mark Session Error:', markError);
    return json({ error: 'Failed to mark session as completed' }, 500);
  }

  // Persist the client-computed scoring report into scoring_reports.
  // A row already exists thanks to the trigger_create_scoring_report trigger
  // that fires when the session is inserted, so we UPDATE rather than insert.
  const subscores = buildSubscores(scoringReport);
  if (scoringReport && subscores) {
    const totalScore =
      typeof scoringReport.totalAdjusted === 'number'
        ? Math.max(0, Math.min(30, Math.round(scoringReport.totalAdjusted)))
        : typeof scoringReport.totalRaw === 'number'
        ? Math.max(0, Math.min(30, Math.round(scoringReport.totalRaw)))
        : null;
    const needsReview =
      typeof scoringReport.totalProvisional === 'boolean'
        ? scoringReport.totalProvisional
        : (scoringReport.pendingReviewCount ?? 0) > 0;
    const percentile =
      typeof scoringReport.normPercentile === 'number'
        ? Math.max(0, Math.min(100, Math.round(scoringReport.normPercentile)))
        : null;

    const { error: reportError } = await supabase
      .from('scoring_reports')
      .update({
        total_score: totalScore,
        subscores,
        needs_review: needsReview,
        percentile,
        computed_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    if (reportError) {
      console.error('Scoring report persistence error:', reportError);
    }
  } else {
    // Fallback: ask the DB to sum whatever subscores already exist.
    const { error: recalcError } = await supabase.rpc('recalculate_total_score', {
      p_session_id: sessionId,
    });
    if (recalcError) {
      console.error('Recalculate Score Error:', recalcError);
    }
  }

  // Notify clinician by email if profile + auth email are available
  try {
    if (session.clinician_id) {
      const { data: clinicianProfile } = await supabase
        .from('clinicians')
        .select('email, full_name')
        .eq('id', session.clinician_id)
        .maybeSingle();

      let clinicianEmail = clinicianProfile?.email ?? null;
      if (!clinicianEmail) {
        const { data: userResult } = await supabase.auth.admin.getUserById(session.clinician_id);
        clinicianEmail = userResult?.user?.email ?? null;
      }

      let patientName: string | null = null;
      if (session.patient_id) {
        const { data: patient } = await supabase
          .from('patients')
          .select('full_name')
          .eq('id', session.patient_id)
          .maybeSingle();
        patientName = patient?.full_name ?? null;
      }

      const dashboardBase = Deno.env.get('PUBLIC_URL') || 'https://app.remotecheck.com';
      const dashboardUrl = `${dashboardBase}/#/dashboard/session/${sessionId}`;
      const assessmentLabel = (session.assessment_type ?? 'moca').toUpperCase();
      const patientLine = patientName
        ? `<p>המטופל <strong>${patientName}</strong> השלים את המבדק (${assessmentLabel}).</p>`
        : `<p>המבדק (${assessmentLabel}) עבור מזהה תיק <strong>${session.case_id ?? sessionId}</strong> הושלם.</p>`;

      if (clinicianEmail) {
        await sendEmail({
          to: clinicianEmail,
          subject: 'Remote Check: מבחן הושלם',
          html: `
            <div dir="rtl" style="font-family: Heebo, Arial, sans-serif; color: #111;">
              <p>שלום${clinicianProfile?.full_name ? ` ${clinicianProfile.full_name}` : ''},</p>
              ${patientLine}
              <p><a href="${dashboardUrl}" style="color:#1d4ed8;font-weight:bold;">פתחו את התוצאות בלוח הבקרה</a></p>
              <p style="color:#666;font-size:12px;">הקישור זמין רק לקלינאים מחוברים.</p>
            </div>
          `,
        });
      }
    }
  } catch (notificationError) {
    console.error('Clinician completion email failed:', notificationError);
  }

  const { data: finalReport } = await supabase
    .from('scoring_reports')
    .select('total_score, needs_review')
    .eq('session_id', sessionId)
    .maybeSingle();

  return json({
    ok: true,
    totalScore: finalReport?.total_score ?? 0,
    needsReview: finalReport?.needs_review ?? true,
  });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
