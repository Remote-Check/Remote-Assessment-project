import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: { token: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { token } = body;
  if (!token) return json({ error: 'Missing token' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Look up session by token
  const { data: session, error } = await supabase
    .from('sessions')
    .select('id, status, used, age_band, education_years, created_at')
    .eq('link_token', token)
    .single();

  if (error || !session) {
    return json({ error: 'Invalid link' }, 404);
  }

  // If the session already started, allow the same patient link to resume.
  // This prevents lockout when the first start response is lost in transit.
  if (session.status === 'in_progress') {
    return json(buildStartResponse(session.id, session.age_band, session.education_years));
  }

  // Enforce single-use for links that are no longer resumable.
  if (session.used) {
    return json({ error: 'Link already used' }, 410);
  }

  if (session.status !== 'pending') {
    return json({ error: 'Session not available' }, 409);
  }

  const { error: updateError } = await supabase
    .from('sessions')
    .update({ started_at: new Date().toISOString(), status: 'in_progress', used: true })
    .eq('id', session.id);

  if (updateError) {
    return json({ error: 'Failed to start session' }, 500);
  }

  return json(buildStartResponse(session.id, session.age_band, session.education_years));
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function buildStartResponse(sessionId: string, ageBand: string | null, educationYears: number | null) {
  return {
    sessionId,
    ageBand,
    educationYears,
    sessionDate: new Date().toISOString(),
  };
}
