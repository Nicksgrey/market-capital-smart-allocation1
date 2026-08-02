import type {
  DiscoveryAnswers,
  InvestorProfileConsolidation,
  ProfilingStep,
} from "../types";

/**
 * Agregado persistido da Camada 1.
 * Espelha a tabela `map_investor_profiles` sem depender de infraestrutura.
 */
export interface InvestorProfile {
  id: string;
  userId: string;
  discovery: DiscoveryAnswers;
  behavioralScore: number | null;
  behavioralProfile: string | null;
  financialCapacityScore: number | null;
  financialCapacityLabel: string | null;
  riskBudgetScore: number | null;
  finalProfile: string | null;
  recommendedVolatility: number | null;
  selectedVolatility: number | null;
  volatilityRangeMin: number | null;
  volatilityRangeMax: number | null;
  volatilityStatus: string | null;
  status: "em_andamento" | "validado";
  currentStep: ProfilingStep;
  diagnosis: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Contrato de persistência do perfilamento (implementado na infraestrutura). */
export interface InvestorProfileRepository {
  findCurrent(): Promise<InvestorProfile | null>;
  saveConsolidation(
    consolidation: InvestorProfileConsolidation,
  ): Promise<InvestorProfile>;
}