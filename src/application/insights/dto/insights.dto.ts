import type { StrategicPortfolio } from "@/domain/allocation/types";
import type {
  EscalationOrigin,
  InteractionSignals,
  PostAllocationAnalysis,
} from "@/domain/insights/types";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";

/** Entrada da Camada 4: perfil consolidado + carteira aprovada. */
export interface AnalyzePortfolioInput {
  profile: InvestorProfileConsolidation;
  portfolio: StrategicPortfolio;
  signals?: InteractionSignals;
  escalationOrigin?: EscalationOrigin;
}

export type AnalyzePortfolioOutput = PostAllocationAnalysis;