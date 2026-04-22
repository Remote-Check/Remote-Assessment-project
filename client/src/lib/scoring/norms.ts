interface NormBand { mean: number; sd: number }
interface NormEntry { ageMin: number; ageMax: number; educationLow: NormBand; educationHigh: NormBand }

export function lookupNorm(norms: NormEntry[], age: number, educationYears: number): NormBand | null {
  const band = norms.find(n => age >= n.ageMin && age <= n.ageMax);
  if (!band) return null;
  return educationYears <= 12 ? band.educationLow : band.educationHigh;
}

// Abramowitz & Stegun approximation of the standard normal CDF
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  return z >= 0 ? 1 - p : p;
}

export function computePercentile(score: number, norm: NormBand): number {
  const z = (score - norm.mean) / norm.sd;
  return Math.min(100, Math.max(0, Math.round(normalCdf(z) * 100)));
}
