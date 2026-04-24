// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../lib/supabase', () => ({
  edgeFn: (name: string) => `https://edge.test/${name}`,
}));

import { useSession } from '../useSession';

const mockFetch = vi.fn();

describe('useSession', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('marks session invalid when no token override is provided', async () => {
    window.history.replaceState({}, '', '/?t=query-token');

    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.status).toBe('invalid'));
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('surfaces invalid access code responses', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 } as Response);

    const { result } = renderHook(() => useSession('session-token', '1234'));

    await waitFor(() => expect(result.current.status).toBe('invalid_code'));
    expect(result.current.requiresAccessCode).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://edge.test/start-session',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'session-token', accessCode: '1234' }),
      }),
    );
  });

  it('returns code_required state when backend requires an access code', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'code_required', sessionId: 'sess-code' }),
    } as Response);

    const { result } = renderHook(() => useSession('session-token'));

    await waitFor(() => expect(result.current.status).toBe('code_required'));
    expect(result.current.sessionId).toBe('sess-code');
    expect(result.current.linkToken).toBe('session-token');
    expect(result.current.requiresAccessCode).toBe(true);
  });

  it('maps a successful start-session payload into ready scoring context', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        sessionId: 'sess-ready',
        sessionDate: '2026-04-01T00:00:00.000Z',
        educationYears: undefined,
        ageBand: '65-69',
      }),
    } as Response);

    const { result } = renderHook(() => useSession('session-token'));

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.linkToken).toBe('session-token');
    expect(result.current.scoringContext?.sessionId).toBe('sess-ready');
    expect(result.current.scoringContext?.educationYears).toBe(12);
    expect(result.current.scoringContext?.patientAge).toBe(67);
  });

  it('moves to error state when start-session request fails', async () => {
    mockFetch.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useSession('session-token'));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.sessionId).toBeNull();
    expect(result.current.linkToken).toBeNull();
  });
});
