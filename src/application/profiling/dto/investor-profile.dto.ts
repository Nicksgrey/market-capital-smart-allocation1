import type {
  DiscoveryAnswers,
  InvestorProfileConsolidation,
} from "@/domain/profiling/types";

/** Entrada completa da Camada 1 (suitability + descoberta + volatilidade). */
export interface ProfilingInput {
  /** Score do suitability realizado no site da Market Capital (0–100). */
  behavioralScore: number;
  discovery: DiscoveryAnswers;
  /** Volatilidade escolhida na barra deslizante. Ausente = usa a recomendada. */
  selectedVolatility?: number;
}

export type ProfilingOutput = InvestorProfileConsolidation;

export const EMPTY_DISCOVERY: DiscoveryAnswers = {
  age: null,
  netWorth: null,
  monthlyIncome: null,
  monthlyExpenses: null,
  emergencyReserve: null,
  isRetired: false,
  dependents: 0,
  horizonYears: null,
  mainGoal: null,
  liquidityNeed: null,
};

export function isDiscoveryComplete(discovery: DiscoveryAnswers): boolean {
  return (
    discovery.age != null &&
    discovery.netWorth != null &&
    discovery.monthlyIncome != null &&
    discovery.monthlyExpenses != null &&
    discovery.emergencyReserve != null &&
    discovery.horizonYears != null &&
    discovery.mainGoal != null &&
    discovery.liquidityNeed != null
  );
}