import { handleStartSession } from "./handler.ts";
import type {
  StartAttemptFingerprint,
  StartRateLimitDecision,
} from "../_shared/start-rate-limit.ts";

function assertEquals<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(
      message ?? `Expected ${String(expected)}, got ${String(actual)}`,
    );
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

Deno.test("handleStartSession returns 429 without recording another failed attempt when already rate limited", async () => {
  const recordCalls: unknown[] = [];
  const fingerprint: StartAttemptFingerprint = {
    source: "203.0.113.10",
    ipHash: "ip-hash",
    accessCodeHash: "code-hash",
  };
  const rateLimit: StartRateLimitDecision = {
    allowed: false,
    reason: "ip_rate_limited",
    retryAfterSeconds: 900,
    ipFailures: 60,
    codeFailures: 0,
  };

  const response = await handleStartSession(
    new Request("https://example.test/functions/v1/start-session", {
      method: "POST",
      body: JSON.stringify({ token: "12345678" }),
      headers: { "content-type": "application/json" },
    }),
    {
      createSupabaseClient: () => ({} as never),
      buildStartAttemptFingerprint: async () => fingerprint,
      checkStartRateLimit: async () => rateLimit,
      recordStartAttempt: async (...args) => {
        recordCalls.push(args);
      },
      writeAuditEvent: async () => undefined,
      now: () => "2026-04-26T00:00:00.000Z",
    },
  );

  assertEquals(response.status, 429);
  assertEquals(response.headers.get("Retry-After"), "900");
  assertEquals(
    recordCalls.length,
    0,
    "blocked retries should not record another failed attempt",
  );
  assertEquals(
    await response.text(),
    JSON.stringify({
      error: "Too many start attempts. Please try again later.",
    }),
  );
});

Deno.test("handleStartSession records invalid-format attempts after rate-limit check passes", async () => {
  const recordCalls: Array<{ failureReason?: string; success: boolean }> = [];
  const fingerprint: StartAttemptFingerprint = {
    source: "203.0.113.10",
    ipHash: "ip-hash",
    accessCodeHash: "code-hash",
  };

  const response = await handleStartSession(
    new Request("https://example.test/functions/v1/start-session", {
      method: "POST",
      body: JSON.stringify({ token: "12-34" }),
      headers: { "content-type": "application/json" },
    }),
    {
      createSupabaseClient: () => ({} as never),
      buildStartAttemptFingerprint: async () => fingerprint,
      checkStartRateLimit: async () => ({
        allowed: true,
        ipFailures: 0,
        codeFailures: 0,
      }),
      recordStartAttempt: async (_supabase, input) => {
        recordCalls.push({
          failureReason: input.failureReason,
          success: input.success,
        });
      },
      writeAuditEvent: async () => undefined,
      now: () => "2026-04-26T00:00:00.000Z",
    },
  );

  assertEquals(response.status, 404);
  assertEquals(recordCalls.length, 1);
  assert(recordCalls[0], "expected one recorded attempt");
  assertEquals(recordCalls[0].success, false);
  assertEquals(recordCalls[0].failureReason, "invalid_format");
});
