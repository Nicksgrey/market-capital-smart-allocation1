/**
 * CAMADA 3 — CONSTRUÇÃO E APRESENTAÇÃO DA CARTEIRA
 *
 * Fonte de verdade: "Arquitetura Oficial do Motor Inteligente de Alocação
 * Patrimonial" (Market Capital).
 *
 * REGRA OFICIAL DA CAMADA: "Esta camada não calcula nada. Ela recebe a
 * carteira aprovada pelo Validation Engine e organiza a visualização."
 * Portanto todos os tipos abaixo são estruturas de LEITURA — nenhum peso é
 * recalculado, apenas reorganizado nos três níveis de exibição.
 */
import type {
  Country,
  LiquidityBucket,
  MacroClass,
} from "@/domain/allocation/types";

/** Nível MACRO — as grandes classes e seus percentuais. */
export interface MacroView {
  macro: MacroClass;
  label: string;
  weight: number;
  /** Valor financeiro correspondente ao percentual (null sem valor informado). */
  amount: number | null;
}

/** Uma sub-classe apresentada dentro de uma classe macro (nível MESO). */
export interface MesoView {
  id: string;
  label: string;
  weight: number;
  /** Participação DENTRO da classe macro (% da classe). */
  shareOfClass: number;
  amount: number | null;
  liquidityBucket: LiquidityBucket;
  country: Country;
  taxNote?: string;
}

/** Agrupamento MESO por classe macro. */
export interface MesoGroupView {
  macro: MacroClass;
  label: string;
  weight: number;
  amount: number | null;
  sleeves: MesoView[];
}

/** Um ativo específico apresentado no nível MICRO. */
export interface MicroView {
  name: string;
  description: string;
  weight: number;
  amount: number | null;
  /** Exemplos educacionais (tickers/títulos) da metodologia do curso. */
  examples: string[];
}

/** Agrupamento MICRO por sub-classe (meso). */
export interface MicroGroupView {
  macro: MacroClass;
  macroLabel: string;
  sleeveId: string;
  sleeveLabel: string;
  weight: number;
  amount: number | null;
  assets: MicroView[];
}

/** Resumo da renda variável (percentual + valor) para leitura do investidor. */
export interface EquitySummaryView {
  total: number;
  brasil: number;
  exterior: number;
  totalAmount: number | null;
  brasilAmount: number | null;
  exteriorAmount: number | null;
}

/** Níveis de exibição da Camada 3. */
export type PortfolioLevel = "macro" | "meso" | "micro";

export const PORTFOLIO_LEVELS: PortfolioLevel[] = ["macro", "meso", "micro"];

export const PORTFOLIO_LEVEL_LABEL: Record<PortfolioLevel, string> = {
  macro: "Macro",
  meso: "Meso",
  micro: "Micro",
};

/** Carteira Estratégica pronta para apresentação. */
export interface PortfolioPresentation {
  /** Perfil final e volatilidade que originaram a carteira (somente leitura). */
  header: {
    finalProfile: string;
    targetVolatility: number;
    approvedByValidationEngine: boolean;
    educationalOnly: boolean;
  };
  macro: MacroView[];
  meso: MesoGroupView[];
  micro: MicroGroupView[];
  /** Valor financeiro informado pelo investidor (parâmetro de apresentação). */
  investedAmount: number | null;
  /** Renda variável total e sua divisão Brasil/Exterior. */
  equity: EquitySummaryView | null;
  /** Justificativas automáticas geradas a partir dos dados reais da carteira. */
  rationales: string[];
  liquidityDistribution: Record<LiquidityBucket, number>;
  countryDistribution: Record<Country, number>;
  totalWeight: number;
  /** Soma dos valores financeiros (deve fechar com o valor informado). */
  totalAmount: number | null;
  /** Aviso obrigatório sobre o caráter educacional do nível micro. */
  microDisclaimer: string;
  /** Mensagem de conclusão da Camada 3. */
  conclusion: {
    title: string;
    message: string;
    ctaLabel: string;
  };
}

export const MICRO_DISCLAIMER =
  "Este nível é uma sugestão educacional baseada na metodologia do curso. São apenas exemplos e a lista pode ser atualizada conforme a política da plataforma.";

export const PORTFOLIO_CONCLUSION = {
  title: "Sua carteira foi construída com sucesso.",
  message:
    "Agora vamos analisar sua qualidade, riscos e pontos de melhoria.",
  ctaLabel: "Analisar Minha Carteira",
} as const;