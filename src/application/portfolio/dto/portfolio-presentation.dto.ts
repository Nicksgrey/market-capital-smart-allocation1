import type { StrategicPortfolio } from "@/domain/allocation/types";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";
import type { PortfolioPresentation } from "@/domain/portfolio/types";

/**
 * Entrada da Camada 3: a carteira APROVADA pelo Validation Engine (Camada 2)
 * e o perfil consolidado (Camada 1), usados apenas para leitura.
 */
export interface PresentStrategicPortfolioInput {
  profile: InvestorProfileConsolidation;
  portfolio: StrategicPortfolio;
}

export type PresentStrategicPortfolioOutput = PortfolioPresentation;