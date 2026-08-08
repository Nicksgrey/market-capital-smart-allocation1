/**
 * CAMADA 2 — INTELIGÊNCIA DE ALOCAÇÃO
 * Tipos e vocabulário do domínio (Motor Paramétrico).
 *
 * Fonte de verdade: "Arquitetura Oficial do Motor Inteligente de Alocação
 * Patrimonial" (Market Capital). Sequência oficial:
 * Policy Engine → Controle da Volatilidade → Optimization Engine →
 * Allocation Engine → Validation Engine.
 */
import type {
  InvestorGoal,
  LiquidityNeed,
  PolicyFamily,
} from "@/domain/profiling/types";

/** Grandes classes (nível MACRO). */
export type MacroClass =
  | "renda_fixa"
  | "acoes_brasil"
  | "exterior"
  | "fiis"
  | "alternativos"
  | "caixa";

export const MACRO_CLASS_ORDER: MacroClass[] = [
  "renda_fixa",
  "acoes_brasil",
  "exterior",
  "fiis",
  "alternativos",
  "caixa",
];

export const MACRO_CLASS_LABEL: Record<MacroClass, string> = {
  renda_fixa: "Renda Fixa",
  acoes_brasil: "Ações Brasil",
  exterior: "Ações Exterior",
  fiis: "Fundos Imobiliários",
  alternativos: "Alternativos",
  caixa: "Caixa",
};

/** Classes que compõem a exposição total em renda variável (ações). */
export const EQUITY_MACRO_CLASSES: MacroClass[] = ["acoes_brasil", "exterior"];

/** Horizontes de liquidez usados pelas Regras de Liquidez. */
export type LiquidityBucket = "d0" | "d1_d30" | "um_a_cinco_anos" | "acima_cinco_anos";

export const LIQUIDITY_BUCKET_LABEL: Record<LiquidityBucket, string> = {
  d0: "D+0",
  d1_d30: "D+1 a D+30",
  um_a_cinco_anos: "1 a 5 anos",
  acima_cinco_anos: "Mais de 5 anos",
};

export type Country = "brasil" | "estados_unidos" | "europa" | "emergentes";

export type EquitySector =
  | "financeiro"
  | "energia"
  | "consumo"
  | "tecnologia"
  | "industrial"
  | "saude"
  | "materiais"
  | "utilities"
  | "telecom";

/** Faixa permitida (em % do patrimônio) para uma classe macro. */
export interface AllocationBand {
  min: number;
  max: number;
}

/** Política de Alocação Estratégica (SAA) de uma família de perfil. */
export interface SaaPolicy {
  family: PolicyFamily;
  objective: string;
  volatility: AllocationBand;
  macro: Partial<Record<MacroClass, AllocationBand>>;
}

/** Regras de Diversificação. */
export interface DiversificationRules {
  maxPerAsset: number;
  maxPerIssuer: number;
  maxPerSector: number;
  maxPerCountry: number;
  minClasses: number;
  maxCorrelatedCluster: number;
}

/** Regras de Liquidez — distribuição-alvo por horizonte. */
export interface LiquidityRules {
  targets: Record<LiquidityBucket, AllocationBand>;
  rationale: string;
}

/** Regras Tributárias — ordem de preferência entre veículos equivalentes. */
export interface TaxRules {
  preferenceOrder: string[];
  rationale: string;
}

/** Regras de Concentração — limites duros auditados pelo Validation Engine. */
export interface ConcentrationRules {
  maxPerMacroClass: number;
  maxPerCountry: number;
  maxPerIssuer: number;
  maxPerSingleCompany: number;
  maxPerMesoSleeve: number;
}

/** Regras por Objetivo — inclinações aplicadas ao Optimization Engine. */
export interface GoalRules {
  goal: InvestorGoal | null;
  headline: string;
  directives: string[];
  /** Ajustes em pontos percentuais por classe macro. */
  tilts: Partial<Record<MacroClass, number>>;
}

/** Saída do Policy Engine: o que é permitido. */
export interface PolicyDecision {
  family: PolicyFamily;
  saa: SaaPolicy;
  diversification: DiversificationRules;
  liquidity: LiquidityRules;
  tax: TaxRules;
  concentration: ConcentrationRules;
  goal: GoalRules;
  liquidityNeed: LiquidityNeed | null;
  horizonYears: number | null;
}

/** Status do Motor de Controle da Volatilidade. */
export type VolatilityControlStatus =
  | "aprovada"
  | "aprovada_com_alerta"
  | "acima_do_permitido"
  | "bloqueada";

export interface VolatilityControlDecision {
  /** Regra oficial acionada (1 a 4). */
  rule: 1 | 2 | 3 | 4;
  status: VolatilityControlStatus;
  /** Pode seguir para o Optimization Engine? */
  canOptimize: boolean;
  /** Verdadeiro quando a carteira só pode ser simulada (fins educacionais). */
  educationalOnly: boolean;
  requestedVolatility: number;
  approvedVolatility: number;
  recommendedVolatility: number;
  allowedRange: AllocationBand;
  title: string;
  message: string;
  options: string[];
}

export interface OptimizationFactor {
  label: string;
  detail: string;
}

/**
 * Exposição total em renda variável e sua divisão interna Brasil/Exterior.
 * A divisão 50/50 é uma restrição de alocação: ela NUNCA aumenta a exposição
 * total em ações, apenas reparte a exposição já determinada pelo motor.
 */
export interface EquityExposure {
  /** Exposição total em ações após a aplicação da restrição. */
  total: number;
  brasil: number;
  exterior: number;
  /** Exposição total antes da restrição 50/50. */
  requestedTotal: number;
  /** true quando a exposição total precisou ser recalculada para caber nas faixas. */
  adjusted: boolean;
  /** false quando não existe combinação válida dentro dos limites da SAA. */
  feasible: boolean;
  note: string;
}

/** Saída do Optimization Engine: pesos macro finais (não vêm da SAA). */
export interface OptimizationResult {
  targetVolatility: number;
  weights: Record<MacroClass, number>;
  bands: Partial<Record<MacroClass, AllocationBand>>;
  factors: OptimizationFactor[];
  /** Divisão oficial da renda variável entre Brasil e Exterior. */
  equity: EquityExposure;
}

export interface MicroAsset {
  name: string;
  description: string;
  weight: number;
}

export interface MesoSleeve {
  id: string;
  label: string;
  weight: number;
  /** Participação da sub-classe DENTRO da classe macro (% da classe). */
  shareOfClass: number;
  liquidityBucket: LiquidityBucket;
  country: Country;
  taxNote?: string;
  micro: MicroAsset[];
}

export interface MacroBucket {
  macro: MacroClass;
  label: string;
  weight: number;
  sleeves: MesoSleeve[];
}

/** Saída do Allocation Engine: carteira estruturada Macro → Meso → Micro. */
export interface StructuredPortfolio {
  macro: MacroBucket[];
  liquidityDistribution: Record<LiquidityBucket, number>;
  countryDistribution: Record<Country, number>;
}

export type ValidationSeverity = "aprovado" | "alerta" | "reprovado";

export interface ValidationCheck {
  id: string;
  label: string;
  severity: ValidationSeverity;
  detail: string;
  /**
   * true quando a regra é OBRIGATÓRIA: sua violação é um ERRO BLOQUEANTE e
   * reprova a carteira. false quando a regra é de qualidade: sua violação
   * gera apenas WARNING (ponto de atenção não bloqueante).
   */
  mandatory: boolean;
}

/** Saída do Validation Engine: auditoria da carteira. */
export interface ValidationReport {
  approved: boolean;
  checks: ValidationCheck[];
  /** Violações de regras obrigatórias — reprovam a carteira. */
  blockingErrors: ValidationCheck[];
  /** Pontos de atenção não bloqueantes, insumo do Diagnóstico Inteligente. */
  warnings: ValidationCheck[];
  summary: string;
}

/** Resultado completo da Camada 2. */
export interface StrategicPortfolio {
  policy: PolicyDecision;
  volatilityControl: VolatilityControlDecision;
  optimization: OptimizationResult;
  structure: StructuredPortfolio;
  validation: ValidationReport;
  /** true quando a carteira é apenas simulação educacional. */
  educationalOnly: boolean;
}

/** Etapas apresentadas na Camada 2. */
export type AllocationStage =
  | "policy"
  | "controle_volatilidade"
  | "optimization"
  | "allocation"
  | "validation";

export const ALLOCATION_STAGES: AllocationStage[] = [
  "policy",
  "controle_volatilidade",
  "optimization",
  "allocation",
  "validation",
];