/**
 * CAMADA 1 — PERFILAMENTO DO INVESTIDOR
 * Tipos e vocabulário do domínio.
 *
 * Fonte de verdade: "Arquitetura Oficial do Motor Inteligente de
 * Alocação Patrimonial" (Market Capital). Nenhuma regra aqui pode ser
 * alterada sem autorização explícita.
 */

/** Bandas de perfil comportamental (suitability 0–100). */
export type RiskProfile =
  | "muito_conservador"
  | "conservador"
  | "moderado"
  | "moderado_arrojado"
  | "arrojado";

/** Famílias de política (SAA) utilizadas pela Camada 2. */
export type PolicyFamily = "conservador" | "moderado" | "arrojado";

export type CapacityLabel =
  | "muito_baixa"
  | "baixa"
  | "moderada"
  | "alta"
  | "muito_alta";

export type EmergencyReserve =
  | "nenhuma"
  | "abaixo_6_meses"
  | "entre_6_e_12_meses"
  | "acima_12_meses";

export type LiquidityNeed = "alta" | "media" | "baixa";

export type InvestorGoal =
  | "compra_imovel"
  | "reserva_seguranca"
  | "geracao_renda"
  | "crescimento_patrimonial"
  | "aposentadoria";

/** Etapas do fluxo da Camada 1, na ordem definida na documentação. */
export type ProfilingStep =
  | "suitability"
  | "descoberta"
  | "capacidade_financeira"
  | "risk_budget"
  | "volatilidade_alvo"
  | "consolidacao";

export const PROFILING_STEPS: ProfilingStep[] = [
  "suitability",
  "descoberta",
  "capacidade_financeira",
  "risk_budget",
  "volatilidade_alvo",
  "consolidacao",
];

export type VolatilityStatus =
  | "dentro_da_faixa"
  | "abaixo_da_faixa"
  | "acima_do_permitido";

/** Dados coletados na etapa "Descoberta do Investidor". */
export interface DiscoveryAnswers {
  age: number | null;
  netWorth: number | null;
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  emergencyReserve: EmergencyReserve | null;
  isRetired: boolean;
  dependents: number;
  horizonYears: number | null;
  mainGoal: InvestorGoal | null;
  liquidityNeed: LiquidityNeed | null;
}

/** Resultado da etapa "Perfil Comportamental" (suitability do site). */
export interface BehavioralResult {
  score: number;
  profile: RiskProfile;
}

export interface FinancialCapacityFactor {
  key: keyof DiscoveryAnswers | "fluxo_de_caixa";
  label: string;
  weight: number;
  /** 0–100 antes da ponderação. */
  rawScore: number;
  /** rawScore * weight / 100. */
  weightedScore: number;
  note: string;
}

/** Resultado da etapa "Capacidade Financeira" (FCS). */
export interface FinancialCapacityResult {
  score: number;
  label: CapacityLabel;
  breakdown: FinancialCapacityFactor[];
}

/** Resultado da etapa "Risk Budget" + "Perfil Final". */
export interface RiskBudgetResult {
  behavioralScore: number;
  financialScore: number;
  /** Sempre prevalece o menor risco. */
  riskBudgetScore: number;
  finalProfile: RiskProfile;
  policyFamily: PolicyFamily;
  limitedBy: "comportamental" | "financeira" | "equilibrado";
}

/** Resultado da etapa "Volatilidade-Alvo". */
export interface VolatilityResult {
  policyFamily: PolicyFamily;
  min: number;
  max: number;
  recommended: number;
  selected: number;
  status: VolatilityStatus;
  message: string;
}

/** Consolidação completa da Camada 1 (Painel de Consolidação). */
export interface InvestorProfileConsolidation {
  discovery: DiscoveryAnswers;
  behavioral: BehavioralResult;
  financialCapacity: FinancialCapacityResult;
  riskBudget: RiskBudgetResult;
  volatility: VolatilityResult;
  diagnosis: string;
}