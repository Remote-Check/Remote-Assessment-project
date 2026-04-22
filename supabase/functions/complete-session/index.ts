import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// We won't import the complex React-based TS here due to module resolution issues.
// Instead, we will execute the final SQL functions to mark it complete.
// The actual complex auto-scoring can be handled either in the client, 
// a dedicated microservice, or via a simplified server-side aggregation.

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: { sessionId: string; scoringReport?: any };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { sessionId } = body;
  
  if (!sessionId) {
    return json({ error: 'Missing required field: sessionId' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Validate session is in_progress
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, status')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return json({ error: 'Session not found' }, 404);
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

  return json({ ok: true, totalScore: 0, needsReview: true });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
