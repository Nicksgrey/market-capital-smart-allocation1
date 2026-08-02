import type { InvestorGoal } from "@/domain/profiling/types";
import type { TaxRules } from "../types";

/**
 * REGRAS TRIBUTÁRIAS
 *
 * Responde: "Existe uma forma mais eficiente de atingir o mesmo objetivo sob a
 * ótica tributária?" Não faz planejamento tributário personalizado — apenas
 * usa a eficiência tributária como critério adicional de seleção.
 */
const BASE_PREFERENCE = [
  "Debêntures incentivadas e fundos de infraestrutura (isentos)",
  "LCI/LCA antes de CDB quando a taxa líquida for equivalente",
  "Tesouro IPCA+ para proteção inflacionária de longo prazo",
  "ETFs de acumulação no exterior quando aplicável",
  "FIIs para renda isenta na pessoa física",
  "CDB e crédito privado tributados apenas como complemento",
];

export function taxRulesOf(goal: InvestorGoal | null): TaxRules {
  const preferenceOrder = [...BASE_PREFERENCE];

  if (goal === "geracao_renda") {
    preferenceOrder.unshift(
      "FIIs e ativos de renda isenta priorizados para fluxo de caixa",
    );
  }
  if (goal === "crescimento_patrimonial" || goal === "aposentadoria") {
    preferenceOrder.unshift(
      "ETFs de acumulação priorizados para diferimento tributário",
    );
  }

  return {
    preferenceOrder,
    rationale:
      "Entre alternativas equivalentes para o mesmo objetivo, o motor prioriza o veículo mais eficiente sob a ótica tributária.",
  };
}