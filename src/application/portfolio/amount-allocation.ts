/**
 * CAMADA 3 — CONSISTÊNCIA MATEMÁTICA DOS VALORES FINANCEIROS.
 *
 * O percentual é a fonte de verdade; o valor em reais é derivado dele. Para que
 * a soma dos valores feche EXATAMENTE com o valor informado pelo investidor em
 * todos os níveis (Macro, Meso e Micro), a conversão usa o método do maior
 * resto (largest remainder) em centavos.
 */
export function distributeAmount(
  total: number,
  weights: number[],
): number[] {
  if (weights.length === 0) return [];
  const sumWeights = weights.reduce((sum, weight) => sum + weight, 0);
  if (sumWeights <= 0) return weights.map(() => 0);

  const totalCents = Math.round(total * 100);
  const raw = weights.map((weight) => (totalCents * weight) / sumWeights);
  const floors = raw.map((value) => Math.floor(value));
  let remaining = totalCents - floors.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest);

  for (let i = 0; remaining > 0 && order.length > 0; i += 1) {
    const target = order[i % order.length];
    if (!target) break;
    floors[target.index] = (floors[target.index] ?? 0) + 1;
    remaining -= 1;
  }

  return floors.map((cents) => cents / 100);
}
