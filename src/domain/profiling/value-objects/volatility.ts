import type { PolicyFamily } from "../types";

/**
 * Faixas de volatilidade anual por família de política (SAA), conforme a
 * documentação oficial:
 * Conservador 2% a 6% | Moderado 6% a 10% | Arrojado 10% a 18%
 *
 * A volatilidade recomendada é o ponto médio da faixa do perfil final.
 */
export const VOLATILITY_RANGES: Record<
  PolicyFamily,
  { min: number; max: number; objective: string }
> = {
  conservador: { min: 2, max: 6, objective: "Preservação do patrimônio" },
  moderado: { min: 6, max: 10, objective: "Crescimento com estabilidade" },
  arrojado: { min: 10, max: 18, objective: "Maximização do patrimônio" },
};

/** Escala apresentada na barra deslizante da plataforma. */
export const VOLATILITY_SLIDER = { min: 2, max: 18, step: 1 } as const;

export function volatilityRangeOf(family: PolicyFamily) {
  return VOLATILITY_RANGES[family];
}

export function recommendedVolatility(family: PolicyFamily): number {
  const { min, max } = VOLATILITY_RANGES[family];
  return (min + max) / 2;
}