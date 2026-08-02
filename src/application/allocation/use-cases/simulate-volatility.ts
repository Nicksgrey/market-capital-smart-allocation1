import type { InvestorProfileConsolidation } from "@/domain/profiling/types";
import type { StrategicPortfolio } from "@/domain/allocation/types";

import {
  buildStrategicPortfolio,
  isBlocked,
} from "./build-strategic-portfolio";
import {
  SIMULATION_DISCLAIMER,
  type VolatilitySimulationOutput,
} from "../dto/strategic-portfolio.dto";

/**
 * "Simular outra volatilidade" — NÃO altera a carteira oficial. Abre um modo
 * de comparação entre a carteira recomendada e a carteira simulada, com o
 * aviso educacional obrigatório.
 */
export function simulateVolatility(input: {
  profile: InvestorProfileConsolidation;
  simulatedVolatility: number;
}): VolatilitySimulationOutput {
  const recommended = buildStrategicPortfolio({ profile: input.profile });
  const simulated = buildStrategicPortfolio({
    profile: input.profile,
    requestedVolatility: input.simulatedVolatility,
    educationalSimulation: true,
  });

  return {
    recommended: recommended as StrategicPortfolio,
    simulated: isBlocked(simulated) ? null : simulated,
    disclaimer: SIMULATION_DISCLAIMER,
  };
}