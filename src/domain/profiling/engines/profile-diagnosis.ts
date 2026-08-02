import { riskProfileLabel } from "../value-objects/risk-profile";
import { capacityLabelText } from "../value-objects/capacity-label";
import type {
  BehavioralResult,
  DiscoveryAnswers,
  FinancialCapacityResult,
  RiskBudgetResult,
  VolatilityResult,
} from "../types";

export function liquidityNeedText(need: DiscoveryAnswers["liquidityNeed"]) {
  switch (need) {
    case "alta":
      return "Alta";
    case "media":
      return "Média";
    case "baixa":
      return "Baixa";
    default:
      return "Não informada";
  }
}

export function reserveText(reserve: DiscoveryAnswers["emergencyReserve"]) {
  switch (reserve) {
    case "nenhuma":
      return "Inexistente";
    case "abaixo_6_meses":
      return "Insuficiente";
    case "entre_6_e_12_meses":
      return "Adequada";
    case "acima_12_meses":
      return "Robusta";
    default:
      return "Não informada";
  }
}

export function goalText(goal: DiscoveryAnswers["mainGoal"]) {
  switch (goal) {
    case "compra_imovel":
      return "Compra de imóvel";
    case "reserva_seguranca":
      return "Reserva de segurança";
    case "geracao_renda":
      return "Geração de renda";
    case "crescimento_patrimonial":
      return "Crescimento patrimonial";
    case "aposentadoria":
      return "Aposentadoria";
    default:
      return "Não informado";
  }
}

/**
 * Diagnóstico rápido exibido no Painel de Consolidação.
 * O painel não calcula nada: apenas apresenta o que a Camada 1 produziu.
 */
export function buildProfileDiagnosis(input: {
  discovery: DiscoveryAnswers;
  behavioral: BehavioralResult;
  financialCapacity: FinancialCapacityResult;
  riskBudget: RiskBudgetResult;
  volatility: VolatilityResult;
}): string {
  const { discovery, behavioral, financialCapacity, riskBudget, volatility } =
    input;

  const tolerance =
    behavioral.score >= 61
      ? "boa tolerância às oscilações do mercado"
      : behavioral.score >= 41
        ? "tolerância intermediária às oscilações do mercado"
        : "baixa tolerância às oscilações do mercado";

  const capacityPhrase = `sua capacidade financeira (${capacityLabelText(
    financialCapacity.label,
  ).toLowerCase()}) recomenda uma postura ${riskProfileLabel(
    riskBudget.finalProfile,
  ).toLowerCase()}`;

  const horizonPhrase =
    discovery.horizonYears != null
      ? `Como seu horizonte de investimento é de ${discovery.horizonYears} anos`
      : "Considerando o horizonte informado";

  const liquidityPhrase = `sua necessidade de liquidez é ${liquidityNeedText(
    discovery.liquidityNeed,
  ).toLowerCase()}`;

  return `Seu perfil demonstra ${tolerance}, porém ${capacityPhrase}. ${horizonPhrase} e ${liquidityPhrase}, o Motor Inteligente de Alocação construirá uma carteira respeitando um nível de volatilidade de aproximadamente ${volatility.selected}% ao ano.`;
}