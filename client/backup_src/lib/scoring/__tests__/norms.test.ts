import { describe, it, expect } from 'vitest';
import { lookupNorm, computePercentile } from '../norms';

const NORMS = [
  { ageMin: 60, ageMax: 69, educationLow: { mean: 22.8, sd: 3.9 }, educationHigh: { mean: 25.6, sd: 3.1 } },
  { ageMin: 70, ageMax: 79, educationLow: { mean: 21.4, sd: 4.2 }, educationHigh: { mean: 24.3, sd: 3.5 } },
  { ageMin: 80, ageMax: 99, educationLow: { mean: 19.6, sd: 4.5 }, educationHigh: { mean: 22.8, sd: 3.9 } },
];

describe('lookupNorm', () => {
  it('returns educationLow for age 65, education 12 years', () => {
    const norm = lookupNorm(NORMS, 65, 12);
    expect(norm).toEqual({ mean: 22.8, sd: 3.9 });
  });

  it('returns educationHigh for age 65, education 13 years', () => {
    const norm = lookupNorm(NORMS, 65, 13);
    expect(norm).toEqual({ mean: 25.6, sd: 3.1 });
  });

  it('returns correct band for age 75', () => {
    const norm = lookupNorm(NORMS, 75, 16);
    expect(norm).toEqual({ mean: 24.3, sd: 3.5 });
  });

  it('returns correct band for age 85', () => {
    const norm = lookupNorm(NORMS, 85, 8);
    expect(norm).toEqual({ mean: 19.6, sd: 4.5 });
  });

  it('returns null for age outside all bands', () => {
    expect(lookupNorm(NORMS, 50, 12)).toBeNull();
  });

  it('uses educationLow for exactly 12 years', () => {
    const norm = lookupNorm(NORMS, 65, 12);
    expect(norm?.mean).toBe(22.8);
  });
});

describe('computePercentile', () => {
  it('returns 50 for score at mean', () => {
    const p = computePercentile(22.8, { mean: 22.8, sd: 3.9 });
    expect(p).toBeCloseTo(50, 0);
  });

  it('returns ~84 for score one SD above mean', () => {
    const p = computePercentile(22.8 + 3.9, { mean: 22.8, sd: 3.9 });
    expect(p).toBeCloseTo(84, 0);
  });

  it('returns ~16 for score one SD below mean', () => {
    const p = computePercentile(22.8 - 3.9, { mean: 22.8, sd: 3.9 });
    expect(p).toBeCloseTo(16, 0);
  });

  it('clamps to 0–100 range', () => {
    const high = computePercentile(100, { mean: 22.8, sd: 3.9 });
    const low  = computePercentile(-100, { mean: 22.8, sd: 3.9 });
    expect(high).toBeLessThanOrEqual(100);
    expect(low).toBeGreaterThanOrEqual(0);
  });
});
