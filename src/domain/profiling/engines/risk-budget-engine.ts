import {
  classifyRiskProfile,
  clampScore,
  policyFamilyOf,
} from "../value-objects/risk-profile";
import type { RiskBudgetResult } from "../types";

/**
 * RISK BUDGET
 *
 * Cruza o Perfil Comportamental (quanto risco o investidor suporta
 * psicologicamente) com a Capacidade Financeira (quanto risco ele realmente
 * pode assumir). Regra oficial: sempre prevalece o menor risco — o Perfil
 * Final é o menor dos dois.
 */
export function calculateRiskBudget(
  behavioralScore: number,
  financialScore: number,
): RiskBudgetResult {
  const behavioral = clampScore(behavioralScore);
  const financial = clampScore(financialScore);
  const riskBudgetScore = Math.min(behavioral, financial);
  const finalProfile = classifyRiskProfile(riskBudgetScore);

  const limitedBy =
    behavioral === financial
      ? "equilibrado"
      : behavioral < financial
        ? "comportamental"
        : "financeira";

  return {
    behavioralScore: behavioral,
    financialScore: financial,
    riskBudgetScore,
    finalProfile,
    policyFamily: policyFamilyOf(finalProfile),
    limitedBy,
  };
}