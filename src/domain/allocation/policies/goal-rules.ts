import type { InvestorGoal } from "@/domain/profiling/types";
import type { GoalRules } from "../types";

/**
 * REGRAS POR OBJETIVO
 *
 * Responde: "Qual é o objetivo do investidor?" — uma carteira muda
 * completamente dependendo da finalidade. As inclinações (tilts) são ajustes
 * em pontos percentuais aplicados pelo Optimization Engine, sempre limitados
 * pelas faixas da SAA.
 */
const GOAL_RULES: Record<InvestorGoal, Omit<GoalRules, "goal">> = {
  aposentadoria: {
    headline: "Aposentadoria",
    directives: [
      "Maior crescimento",
      "Maior horizonte",
      "Maior renda variável",
      "Vencimentos podem ser alongados",
    ],
    tilts: { acoes_brasil: 2, exterior: 3, renda_fixa: -4, caixa: -1 },
  },
  geracao_renda: {
    headline: "Geração de renda",
    directives: [
      "Maior previsibilidade",
      "Maior fluxo de caixa",
      "Preferência por ativos pagadores",
    ],
    tilts: { fiis: 4, renda_fixa: 2, exterior: -3, acoes_brasil: -3 },
  },
  compra_imovel: {
    headline: "Compra de imóvel",
    directives: ["Maior liquidez", "Menor volatilidade", "Vencimentos curtos"],
    tilts: { renda_fixa: 5, caixa: 3, acoes_brasil: -4, exterior: -3, fiis: -1 },
  },
  reserva_seguranca: {
    headline: "Proteção patrimonial",
    directives: [
      "Maior preservação",
      "Maior diversificação",
      "Maior proteção cambial",
    ],
    tilts: { renda_fixa: 4, caixa: 2, exterior: 1, acoes_brasil: -4, fiis: -3 },
  },
  crescimento_patrimonial: {
    headline: "Acumulação",
    directives: [
      "Maior crescimento",
      "Maior exposição a ativos de risco dentro dos limites definidos",
    ],
    tilts: {
      acoes_brasil: 3,
      exterior: 3,
      alternativos: 1,
      renda_fixa: -5,
      caixa: -2,
    },
  },
};

export function goalRulesOf(goal: InvestorGoal | null): GoalRules {
  if (!goal) {
    return {
      goal: null,
      headline: "Objetivo não informado",
      directives: [
        "Sem inclinação por objetivo — mantém o ponto neutro da SAA",
      ],
      tilts: {},
    };
  }
  return { goal, ...GOAL_RULES[goal] };
}