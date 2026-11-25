export const toCents = (v) => Math.round(Number(v) * 100);
export const fmt = (c) => (c / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Largest-remainder allocation with integer weights -> shares always sum exactly to total.
export function allocate(totalCents, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!(totalCents > 0) || sum === 0) return weights.map(() => 0);
  const parts = weights.map((w, i) => ({ i, q: Math.floor((totalCents * w) / sum), r: (totalCents * w) % sum }));
  const left = totalCents - parts.reduce((a, p) => a + p.q, 0);
  [...parts].sort((a, b) => b.r - a.r || a.i - b.i).slice(0, left).forEach((p) => { p.q += 1; });
  return parts.map((p) => p.q);
}
