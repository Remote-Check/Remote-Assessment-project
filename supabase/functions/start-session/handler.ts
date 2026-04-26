import { corsResponse, json as jsonResponse } from "../_shared/http.ts";
import type { writeAuditEvent } from "../_shared/audit.ts";
import type {
  StartAttemptFingerprint,
  StartRateLimitDecision,
} from "../_shared/start-rate-limit.ts";

interface StartSessionBody {
  token: string;
}

interface StartSessionRecord {
  id: string;
  link_token: string;
  status: "pending" | "in_progress";
  link_used_at: string | null;
  age_band: string | null;
  education_years: number | null;
  patient_age_years: number | null;
  moca_version: string | null;
  assessment_language: string | null;
}

type SupabaseClient = any;

export interface StartSessionDeps {
  createSupabaseClient: () => SupabaseClient;
  buildStartAttemptFingerprint: (
    req: Request,
    accessCode: string,
  ) => Promise<StartAttemptFingerprint>;
  checkStartRateLimit: (
    supabase: SupabaseClient,
    fingerprint: StartAttemptFingerprint,
  ) => Promise<StartRateLimitDecision>;
  recordStartAttempt: (
    supabase: SupabaseClient,
    input: {
      fingerprint: StartAttemptFingerprint;
      success: boolean;
      failureReason?: string;
      sessionId?: string | null;
      metadata?: Record<string, unknown>;
    },
  ) => Promise<void>;
  writeAuditEvent: typeof writeAuditEvent;
  now: () => string;
}

export async function handleStartSession(
  req: Request,
  deps: StartSessionDeps,
) {
  const json = (body: unknown, status = 200, headers?: HeadersInit) =>
    jsonResponse(body, status, req, headers);
  if (req.method === "OPTIONS") {
    return corsResponse(req);
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: StartSessionBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const token = body.token?.trim();
  if (!token) return json({ error: "Missing test number" }, 400);

  const supabase = deps.createSupabaseClient();
  const fingerprint = await deps.buildStartAttemptFingerprint(req, token);
  const rateLimit = await deps.checkStartRateLimit(supabase, fingerprint);
  if (!rateLimit.allowed) {
    // Avoid extending the active rate-limit window with more failed rows for
    // retries that are already blocked.
    return json(
      { error: "Too many start attempts. Please try again later." },
      429,
      rateLimit.retryAfterSeconds
        ? { "Retry-After": String(rateLimit.retryAfterSeconds) }
        : undefined,
    );
  }

  if (!/^\d{8}$/.test(token)) {
    await deps.recordStartAttempt(supabase, {
      fingerprint,
      success: false,
      failureReason: "invalid_format",
    });
    return json({ error: "Invalid test number" }, 404);
  }

  const { data: sessionData, error } = await supabase
    .from("sessions")
    .select(
      "id, link_token, status, link_used_at, age_band, education_years, patient_age_years, created_at, access_code, moca_version, assessment_language",
    )
    .eq("access_code", token)
    .in("status", ["pending", "in_progress"])
    .single();
  const session = sessionData as StartSessionRecord | null;

  if (error || !session) {
    await deps.recordStartAttempt(supabase, {
      fingerprint,
      success: false,
      failureReason: "invalid_test_number",
    });
    return json({ error: "Invalid test number" }, 404);
  }

  if (
    !Number.isInteger(session.education_years) ||
    !Number.isInteger(session.patient_age_years)
  ) {
    await deps.recordStartAttempt(supabase, {
      fingerprint,
      success: false,
      failureReason: "missing_scoring_context",
      sessionId: session.id,
    });
    return json(
      { error: "Session is missing required clinical scoring context" },
      409,
    );
  }

  if (session.link_used_at) {
    await deps.recordStartAttempt(supabase, {
      fingerprint,
      success: false,
      failureReason: "test_number_already_used",
      sessionId: session.id,
    });
    return json({ error: "Test number already used" }, 410);
  }

  if (session.status === "pending") {
    const { data: startedSession, error: updateError } = await supabase
      .from("sessions")
      .update({
        started_at: deps.now(),
        link_used_at: deps.now(),
        status: "in_progress",
      })
      .eq("id", session.id)
      .eq("status", "pending")
      .is("link_used_at", null)
      .select("id")
      .maybeSingle();

    if (updateError) {
      return json({ error: "Failed to start session" }, 500);
    }
    if (!startedSession) {
      await deps.recordStartAttempt(supabase, {
        fingerprint,
        success: false,
        failureReason: "test_number_already_used",
        sessionId: session.id,
      });
      return json({ error: "Test number already used" }, 410);
    }

    await deps.writeAuditEvent(supabase, {
      eventType: "session_started",
      sessionId: session.id,
      actorType: "patient",
      metadata: { mocaVersion: session.moca_version },
    });
  }

  await deps.recordStartAttempt(supabase, {
    fingerprint,
    success: true,
    sessionId: session.id,
    metadata: { mocaVersion: session.moca_version },
  });

  return json({
    status: "ready",
    sessionId: session.id,
    linkToken: session.link_token,
    ageBand: session.age_band,
    educationYears: session.education_years,
    patientAge: session.patient_age_years,
    mocaVersion: session.moca_version,
    language: session.assessment_language,
    sessionDate: deps.now(),
  });
}
