import type { InvestorGoal, LiquidityNeed } from "@/domain/profiling/types";
import type { LiquidityBucket, LiquidityRules } from "../types";

/**
 * REGRAS DE LIQUIDEZ
 *
 * Responde: "O investidor precisa desse dinheiro quando?" Define quanto do
 * patrimônio fica em cada horizonte de liquidez (D+0, D+1 a D+30, 1 a 5 anos,
 * mais de 5 anos), considerando reserva, necessidade de liquidez, horizonte,
 * fluxo financeiro e objetivo.
 */
const BASE_TARGETS: Record<
  LiquidityNeed,
  Record<LiquidityBucket, { min: number; max: number }>
> = {
  alta: {
    d0: { min: 10, max: 20 },
    d1_d30: { min: 20, max: 35 },
    um_a_cinco_anos: { min: 25, max: 45 },
    acima_cinco_anos: { min: 5, max: 25 },
  },
  media: {
    d0: { min: 5, max: 12 },
    d1_d30: { min: 12, max: 25 },
    um_a_cinco_anos: { min: 25, max: 45 },
    acima_cinco_anos: { min: 20, max: 45 },
  },
  baixa: {
    d0: { min: 2, max: 8 },
    d1_d30: { min: 8, max: 20 },
    um_a_cinco_anos: { min: 20, max: 40 },
    acima_cinco_anos: { min: 32, max: 65 },
  },
};

const GOAL_RATIONALE: Record<InvestorGoal, string> = {
  compra_imovel:
    "Objetivo de compra de imóvel exige maior liquidez de curto prazo e menor volatilidade.",
  reserva_seguranca:
    "Reserva de segurança concentra o patrimônio em liquidez imediata e curtíssimo prazo.",
  geracao_renda:
    "Geração de renda prioriza fluxo de caixa previsível com liquidez intermediária.",
  crescimento_patrimonial:
    "Crescimento patrimonial permite alongar vencimentos mantendo caixa mínimo operacional.",
  aposentadoria:
    "Aposentadoria permite alongar os vencimentos e ampliar a parcela de longo prazo.",
};

export function liquidityRulesOf(
  liquidityNeed: LiquidityNeed | null,
  goal: InvestorGoal | null,
  horizonYears: number | null,
): LiquidityRules {
  const need = liquidityNeed ?? "media";
  const base = BASE_TARGETS[need];
  const targets = {
    d0: { ...base.d0 },
    d1_d30: { ...base.d1_d30 },
    um_a_cinco_anos: { ...base.um_a_cinco_anos },
    acima_cinco_anos: { ...base.acima_cinco_anos },
  };

  // Horizonte longo permite alongar vencimentos; horizonte curto encurta.
  if (horizonYears != null && horizonYears >= 10) {
    targets.acima_cinco_anos.min = Math.min(
      targets.acima_cinco_anos.min + 5,
      targets.acima_cinco_anos.max,
    );
  }
  if (horizonYears != null && horizonYears <= 3) {
    targets.acima_cinco_anos.max = Math.max(
      targets.acima_cinco_anos.max - 15,
      targets.acima_cinco_anos.min,
    );
    targets.d1_d30.max = Math.min(targets.d1_d30.max + 10, 60);
  }

  const rationale = goal
    ? GOAL_RATIONALE[goal]
    : "Distribuição-alvo padrão de liquidez conforme a necessidade declarada.";

  return { targets, rationale };
}