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

/** Contexto completo entregue à IA Financeira. */
export interface AiAdvisorContext {
  perfil: {
    perfilComportamental: string;
    scoreComportamental: number;
    capacidadeFinanceira: string;
    scoreCapacidadeFinanceira: number;
    riskBudget: number;
    perfilFinal: string;
    familiaDePolitica: string;
  };
  objetivo: string;
  horizonteAnos: number | null;
  necessidadeDeLiquidez: string;
  volatilidade: {
    aprovada: number;
    recomendada: number;
    faixaPermitida: string;
    status: string;
  };
  carteiraMacro: Array<{ classe: string; peso: number }>;
  carteiraMeso: Array<{ classe: string; subClasse: string; peso: number }>;
  carteiraMicro: Array<{ subClasse: string; ativo: string; peso: number }>;
  distribuicaoDeLiquidez: Record<string, number>;
  distribuicaoGeografica: Record<string, number>;
  politicas: {
    saa: string;
    diretrizesDoObjetivo: string[];
    limitesDeConcentracao: string;
    regrasTributarias: string[];
  };
  diagnostico: {
    pontuacaoGeral: number;
    pontosFortes: string[];
    pontosDeAtencao: string[];
  };
  stressTest: {
    resiliencia: string;
    cenarios: Array<{ cenario: string; leitura: string }>;
  };
  validationEngine: { aprovada: boolean; resumo: string };
  apenasEducacional: boolean;
}