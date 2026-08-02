import { calculateFinancialCapacity } from "@/domain/profiling/engines/financial-capacity-engine";
import { calculateRiskBudget } from "@/domain/profiling/engines/risk-budget-engine";
import { evaluateVolatility } from "@/domain/profiling/engines/volatility-engine";
import { buildProfileDiagnosis } from "@/domain/profiling/engines/profile-diagnosis";
import {
  classifyRiskProfile,
  clampScore,
} from "@/domain/profiling/value-objects/risk-profile";
import { recommendedVolatility } from "@/domain/profiling/value-objects/volatility";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";
import type { ProfilingInput } from "../dto/investor-profile.dto";

/**
 * Caso de uso que executa a Camada 1 na ordem oficial:
 * Suitability → Descoberta → Perfil Comportamental → Capacidade Financeira
 * → Risk Budget → Volatilidade-Alvo → Perfil Final.
 *
 * O Painel de Consolidação apenas consome este resultado; não calcula nada.
 */
export function consolidateInvestorProfile(
  input: ProfilingInput,
): InvestorProfileConsolidation {
  const behavioralScore = clampScore(input.behavioralScore);
  const behavioral = {
    score: behavioralScore,
    profile: classifyRiskProfile(behavioralScore),
  };

  const financialCapacity = calculateFinancialCapacity(input.discovery);

  const riskBudget = calculateRiskBudget(
    behavioral.score,
    financialCapacity.score,
  );

  const selected =
    input.selectedVolatility ?? recommendedVolatility(riskBudget.policyFamily);
  const volatility = evaluateVolatility(riskBudget.policyFamily, selected);

  const diagnosis = buildProfileDiagnosis({
    discovery: input.discovery,
    behavioral,
    financialCapacity,
    riskBudget,
    volatility,
  });

  return {
    discovery: input.discovery,
    behavioral,
    financialCapacity,
    riskBudget,
    volatility,
    diagnosis,
  };
}