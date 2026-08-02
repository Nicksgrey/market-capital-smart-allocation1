import type { StrategicPortfolio } from "../types";

/**
 * Contrato de persistência da Camada 2. A gravação da carteira aprovada
 * pertence à Camada 3 (Construção e Apresentação) e será implementada quando
 * essa etapa for solicitada — aqui apenas a estrutura é preparada.
 */
export interface StrategicPortfolioRepository {
  save(input: {
    profileId: string;
    portfolio: StrategicPortfolio;
  }): Promise<{ id: string }>;
  findLatestByProfile(profileId: string): Promise<StrategicPortfolio | null>;
}