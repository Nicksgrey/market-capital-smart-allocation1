import {
  recommendedVolatility,
  volatilityRangeOf,
} from "../value-objects/volatility";
import type { PolicyFamily, VolatilityResult } from "../types";

/**
 * VOLATILIDADE-ALVO
 *
 * O investidor escolhe o nível de volatilidade anual em uma barra deslizante,
 * sempre atrelada à faixa do seu Perfil Final.
 *
 * Regras oficiais:
 *  1. Dentro da faixa → aprovada, pode continuar.
 *  2. Abaixo da faixa → permitida, porém sinalizada.
 *  3. Acima da faixa → não calcula imediatamente; primeiro explica.
 *
 * A decisão final sobre a utilização da volatilidade solicitada pertence ao
 * Motor de Controle da Volatilidade (Camada 2). Aqui apenas classificamos.
 */
export function evaluateVolatility(
  family: PolicyFamily,
  selected: number,
): VolatilityResult {
  const { min, max } = volatilityRangeOf(family);
  const recommended = recommendedVolatility(family);

  if (selected > max) {
    return {
      policyFamily: family,
      min,
      max,
      recommended,
      selected,
      status: "acima_do_permitido",
      message: `A volatilidade de ${selected}% está acima do permitido para o seu perfil final (faixa de ${min}% a ${max}% ao ano). Antes de qualquer cálculo é necessário compreender o impacto: assumir essa oscilação exigiria elevar o risco além do seu Risk Budget.`,
    };
  }

  if (selected < min) {
    return {
      policyFamily: family,
      min,
      max,
      recommended,
      selected,
      status: "abaixo_da_faixa",
      message: `A volatilidade de ${selected}% está abaixo da faixa do seu perfil final (${min}% a ${max}% ao ano). É permitida, porém resultará em uma carteira mais conservadora do que o seu Risk Budget suporta.`,
    };
  }

  return {
    policyFamily: family,
    min,
    max,
    recommended,
    selected,
    status: "dentro_da_faixa",
    message: `Volatilidade de ${selected}% ao ano aprovada — dentro da faixa de ${min}% a ${max}% do seu perfil final.`,
  };
}