import { corsResponse, json as jsonResponse } from "../_shared/http.ts";
import type { writeAuditEvent } from "../_shared/audit.ts";
import type {
  StartAttemptFingerprint,
  StartRateLimitDecision,
} from "../_shared/start-rate-limit.ts";

interface StartSessionBody {
  token: string;
  deviceContext?: unknown;
}

interface StartSessionRecord {
  id: string;
  patient_id: string | null;
  link_token: string;
  status: "pending" | "in_progress";
  link_used_at: string | null;
  age_band: string | null;
  education_years: number | null;
  patient_age_years: number | null;
  patient_date_of_birth: string | null;
  patient_gender: string | null;
  patient_dominant_hand: string | null;
  moca_version: string | null;
  assessment_language: string | null;
}

interface PatientRecord {
  date_of_birth: string | null;
  gender: string | null;
  dominant_hand: string | null;
  education_years: number | null;
  language: string | null;
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

  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) return json({ error: "Missing test number" }, 400);
  const deviceContext = normalizeDeviceContext(body.deviceContext);

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
      "id, patient_id, link_token, status, link_used_at, age_band, education_years, patient_age_years, patient_date_of_birth, patient_gender, patient_dominant_hand, created_at, access_code, moca_version, assessment_language",
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

  const clinicalContext = await resolveClinicalContext(supabase, session, deps.now());
  if (!clinicalContext) {
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

  const startableSession = clinicalContext;

  if (startableSession.link_used_at) {
    await deps.recordStartAttempt(supabase, {
      fingerprint,
      success: false,
      failureReason: "test_number_already_used",
      sessionId: startableSession.id,
    });
    return json({ error: "Test number already used" }, 410);
  }

  if (startableSession.status === "pending") {
    const { data: startedSession, error: updateError } = await supabase
      .from("sessions")
      .update({
        started_at: deps.now(),
        link_used_at: deps.now(),
        status: "in_progress",
        device_context: deviceContext,
        patient_id: startableSession.patient_id,
        education_years: startableSession.education_years,
        patient_age_years: startableSession.patient_age_years,
        patient_date_of_birth: startableSession.patient_date_of_birth,
        patient_gender: startableSession.patient_gender,
        patient_dominant_hand: startableSession.patient_dominant_hand,
      })
      .eq("id", startableSession.id)
      .eq("status", "pending")
      .is("link_used_at", null)
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error("Failed to start session:", updateError);
      return json({ error: "Failed to start session" }, 500);
    }
    if (!startedSession) {
      await deps.recordStartAttempt(supabase, {
        fingerprint,
        success: false,
        failureReason: "test_number_already_used",
        sessionId: startableSession.id,
      });
      return json({ error: "Test number already used" }, 410);
    }

    await deps.writeAuditEvent(supabase, {
      eventType: "session_started",
      sessionId: startableSession.id,
      actorType: "patient",
      metadata: { mocaVersion: startableSession.moca_version, deviceContext },
    });
  }

  await deps.recordStartAttempt(supabase, {
    fingerprint,
    success: true,
    sessionId: startableSession.id,
    metadata: { mocaVersion: startableSession.moca_version },
  });

  return json({
    status: "ready",
    sessionId: startableSession.id,
    linkToken: startableSession.link_token,
    ageBand: startableSession.age_band,
    educationYears: startableSession.education_years,
    patientAge: startableSession.patient_age_years,
    mocaVersion: startableSession.moca_version,
    language: startableSession.assessment_language,
    sessionDate: deps.now(),
  });
}

async function resolveClinicalContext(
  supabase: SupabaseClient,
  session: StartSessionRecord,
  nowIso: string,
): Promise<StartSessionRecord | null> {
  const candidate = { ...session };

  if (
    candidate.patient_id &&
    (
      !isInteger(candidate.education_years) ||
      !isInteger(candidate.patient_age_years) ||
      !candidate.patient_date_of_birth ||
      !candidate.patient_gender ||
      !candidate.patient_dominant_hand
    )
  ) {
    const { data: patient, error } = await supabase
      .from("patients")
      .select("date_of_birth, gender, dominant_hand, education_years, language")
      .eq("id", candidate.patient_id)
      .single();

    if (error || !patient) return null;
    const patientRecord = patient as PatientRecord;

    candidate.patient_date_of_birth = candidate.patient_date_of_birth ??
      patientRecord.date_of_birth;
    candidate.patient_gender = candidate.patient_gender ?? patientRecord.gender;
    candidate.patient_dominant_hand = candidate.patient_dominant_hand ??
      patientRecord.dominant_hand;
    candidate.education_years = isInteger(candidate.education_years)
      ? candidate.education_years
      : patientRecord.education_years;
    candidate.patient_age_years = isInteger(candidate.patient_age_years)
      ? candidate.patient_age_years
      : calculateAgeYears(candidate.patient_date_of_birth, nowIso);
    candidate.assessment_language = candidate.assessment_language ??
      patientRecord.language ?? "he";
  }

  const educationYears = candidate.education_years;
  const patientAgeYears = candidate.patient_age_years;

  if (
    !candidate.patient_id ||
    !isInteger(educationYears) ||
    educationYears < 0 ||
    educationYears > 40 ||
    !isInteger(patientAgeYears) ||
    patientAgeYears < 60 ||
    patientAgeYears > 130 ||
    !candidate.patient_date_of_birth ||
    !["male", "female"].includes(candidate.patient_gender ?? "") ||
    !["right", "left", "ambidextrous"].includes(
      candidate.patient_dominant_hand ?? "",
    )
  ) {
    return null;
  }

  return candidate;
}

function calculateAgeYears(dateOfBirth: string | null, nowIso: string): number | null {
  if (!dateOfBirth) return null;
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  const now = new Date(nowIso);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(now.getTime())) return null;
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - birth.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < birth.getUTCDate())) {
    age -= 1;
  }
  return age;
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function normalizeDeviceContext(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const input = raw as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};

  setString(normalized, "userAgent", input.userAgent, 300);
  setString(normalized, "platform", input.platform, 80);
  setString(normalized, "language", input.language, 32);
  setString(normalized, "pointer", input.pointer, 16);
  setString(normalized, "hover", input.hover, 16);
  setStringChoice(normalized, "formFactor", input.formFactor, [
    "phone",
    "tablet",
    "desktop",
  ]);
  setStringChoice(normalized, "orientation", input.orientation, [
    "portrait",
    "landscape",
  ]);
  setStringArray(normalized, "languages", input.languages, 5, 32);
  setInteger(normalized, "screenWidth", input.screenWidth, 10000);
  setInteger(normalized, "screenHeight", input.screenHeight, 10000);
  setInteger(normalized, "viewportWidth", input.viewportWidth, 10000);
  setInteger(normalized, "viewportHeight", input.viewportHeight, 10000);
  setInteger(normalized, "touchPoints", input.touchPoints, 20);
  setNumber(normalized, "devicePixelRatio", input.devicePixelRatio, 10);
  if (typeof input.standalone === "boolean") normalized.standalone = input.standalone;

  return normalized;
}

function setString(target: Record<string, unknown>, key: string, value: unknown, maxLength: number) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  if (trimmed) target[key] = trimmed.slice(0, maxLength);
}

function setStringChoice(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
  choices: readonly string[],
) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  if (choices.includes(trimmed)) target[key] = trimmed;
}

function setStringArray(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
  maxItems: number,
  maxLength: number,
) {
  if (!Array.isArray(value)) return;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
  if (items.length > 0) target[key] = items;
}

function setInteger(target: Record<string, unknown>, key: string, value: unknown, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const integer = Math.round(value);
  if (integer >= 0 && integer <= max) target[key] = integer;
}

function setNumber(target: Record<string, unknown>, key: string, value: unknown, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  if (value >= 0 && value <= max) target[key] = Math.round(value * 100) / 100;
}
