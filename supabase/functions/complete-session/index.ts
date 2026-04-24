import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail } from '../_shared/notifications.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
// We won't import the complex React-based TS here due to module resolution issues.
// Instead, we will execute the final SQL functions to mark it complete.
// The actual complex auto-scoring can be handled either in the client, 
// a dedicated microservice, or via a simplified server-side aggregation.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: { sessionId: string; linkToken: string; scoringReport?: any };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { sessionId, linkToken } = body;
  
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

  // Trigger recalculation of the total score from subscores if any exist
  const { error: recalcError } = await supabase.rpc('recalculate_total_score', {
    p_session_id: sessionId
  });

  if (recalcError) {
    console.error('Recalculate Score Error:', recalcError);
    // Non-fatal, proceed
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
