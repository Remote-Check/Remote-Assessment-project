import { useMemo } from 'react';
import type { BatteryManifest } from '../types/battery';
import type { ScoringContext, ScoringReport } from '../types/scoring';
import { scoreSession } from '../lib/scoring';

interface UseScoringResult {
  report: ScoringReport | null;
}

export function useScoring(
  results: Record<string, unknown>,
  manifest: BatteryManifest,
  ctx: ScoringContext,
  enabled: boolean
): UseScoringResult {
  const report = useMemo(() => {
    if (!enabled) return null;

    // Remap step-id-keyed results to type-keyed for scoreSession
    const byType: Record<string, unknown> = {};
    for (const step of manifest.steps) {
      if (step.id in results) {
        byType[step.type] = results[step.id];
      }
    }

    return scoreSession(byType, ctx);
  }, [enabled, results, manifest, ctx]);

  return { report };
}
