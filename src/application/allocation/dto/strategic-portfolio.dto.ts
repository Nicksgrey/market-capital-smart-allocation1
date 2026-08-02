import type {
  InvestorProfileConsolidation,
} from "@/domain/profiling/types";
import type { StrategicPortfolio } from "@/domain/allocation/types";

/** Entrada da Camada 2: consolidação da Camada 1 + volatilidade solicitada. */
export interface BuildStrategicPortfolioInput {
  profile: InvestorProfileConsolidation;
  /** Ausente = usa a volatilidade selecionada na Camada 1. */
  requestedVolatility?: number;
  /** Habilita o cálculo apenas para fins educacionais (Regra 3). */
  educationalSimulation?: boolean;
}

export type BuildStrategicPortfolioOutput = StrategicPortfolio;

/** Comparação entre a carteira recomendada e uma simulação educacional. */
export interface VolatilitySimulationOutput {
  recommended: StrategicPortfolio;
  simulated: StrategicPortfolio | null;
  disclaimer: string;
}

export const SIMULATION_DISCLAIMER =
  "Esta simulação possui finalidade exclusivamente educacional e não substitui a carteira recomendada pelo Motor Inteligente de Alocação, construída com base no seu Perfil Final e no seu Risk Budget.";