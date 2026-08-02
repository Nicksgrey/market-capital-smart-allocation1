import type { InvestorProfileConsolidation } from "@/domain/profiling/types";
import type { PolicyDecision } from "../types";
import { saaPolicyOf } from "../policies/saa-policy";
import { diversificationRulesOf } from "../policies/diversification-rules";
import { concentrationRulesOf } from "../policies/concentration-rules";
import { liquidityRulesOf } from "../policies/liquidity-rules";
import { taxRulesOf } from "../policies/tax-rules";
import { goalRulesOf } from "../policies/goal-rules";

/**
 * POLICY ENGINE — biblioteca de regras.
 *
 * Define o que é permitido: SAA, diversificação, liquidez, tributação,
 * concentração e regras por objetivo. Primeiro passo da Camada 2.
 */
export function runPolicyEngine(
  profile: InvestorProfileConsolidation,
): PolicyDecision {
  const family = profile.riskBudget.policyFamily;
  const { mainGoal, liquidityNeed, horizonYears } = profile.discovery;

  return {
    family,
    saa: saaPolicyOf(family),
    diversification: diversificationRulesOf(family),
    concentration: concentrationRulesOf(family),
    liquidity: liquidityRulesOf(liquidityNeed, mainGoal, horizonYears),
    tax: taxRulesOf(mainGoal),
    goal: goalRulesOf(mainGoal),
    liquidityNeed,
    horizonYears,
  };
}