import { useState, useEffect } from 'react';
import { edgeFn } from '../lib/supabase';
import type { ScoringContext } from '../types/scoring';

export type SessionStatus = 'loading' | 'ready' | 'already_used' | 'invalid' | 'error';

export interface SessionState {
  status: SessionStatus;
  sessionId: string | null;
  scoringContext: ScoringContext | null;
}

const AGE_BAND_MAP: Record<string, number> = {
  '60-69': 65,
  '70-79': 75,
  '80+':   85,
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    status: 'loading',
    sessionId: null,
    scoringContext: null,
  });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('t');

    if (!token) {
      setState({ status: 'invalid', sessionId: null, scoringContext: null });
      return;
    }

    fetch(edgeFn('start-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.status === 410) {
          setState({ status: 'already_used', sessionId: null, scoringContext: null });
          return;
        }
        if (!res.ok) {
          setState({ status: 'invalid', sessionId: null, scoringContext: null });
          return;
        }

        const data = await res.json();
        setState({
          status: 'ready',
          sessionId: data.sessionId,
          scoringContext: {
            sessionId:       data.sessionId,
            sessionDate:     new Date(data.sessionDate),
            educationYears:  data.educationYears,
            patientAge:      AGE_BAND_MAP[data.ageBand] ?? 70,
            sessionLocation: { place: data.locationPlace, city: data.locationCity },
          },
        });
      })
      .catch(() => {
        setState({ status: 'error', sessionId: null, scoringContext: null });
      });
  }, []);

  return state;
}
