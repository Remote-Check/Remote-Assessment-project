import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";
import { writeAuditEvent } from "../_shared/audit.ts";
import {
  buildStartAttemptFingerprint,
  checkStartRateLimit,
  recordStartAttempt,
} from "../_shared/start-rate-limit.ts";
import { handleStartSession, type StartSessionDeps } from "./handler.ts";

const defaultDeps: StartSessionDeps = {
  createSupabaseClient: supabaseClient,
  buildStartAttemptFingerprint,
  checkStartRateLimit,
  recordStartAttempt,
  writeAuditEvent,
  now: () => new Date().toISOString(),
};

if (import.meta.main) {
  Deno.serve((req) => handleStartSession(req, defaultDeps));
}
function supabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
}
