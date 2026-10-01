/**
 * CAMADA 4 — INTELIGÊNCIA PÓS-ALOCAÇÃO
 * Tipos e vocabulário do domínio.
 *
 * Fonte de verdade: "Arquitetura Oficial do Motor Inteligente de Alocação
 * Patrimonial" (Market Capital).
 *
 * REGRA OFICIAL DA CAMADA: "Ela não altera a alocação da carteira. Ela apenas
 * consome a carteira aprovada pelo Validation Engine." Portanto nenhum tipo
 * aqui produz pesos — apenas interpretação, teste e educação.
 */
import type { MacroClass } from "@/domain/allocation/types";

/** Dimensões do Diagnóstico Inteligente, na ordem oficial do documento. */
export type DiagnosticDimension =
  | "diversificacao"
  | "liquidez"
  | "concentracao"
  | "protecao_cambial"
  | "protecao_inflacao"
  | "adequacao_objetivo"
  | "adequacao_horizonte"
  | "adequacao_volatilidade";

export const DIAGNOSTIC_DIMENSIONS: DiagnosticDimension[] = [
  "diversificacao",
  "liquidez",
  "concentracao",
  "protecao_cambial",
  "protecao_inflacao",
  "adequacao_objetivo",
  "adequacao_horizonte",
  "adequacao_volatilidade",
];

export const DIAGNOSTIC_DIMENSION_LABEL: Record<DiagnosticDimension, string> = {
  diversificacao: "Diversificação",
  liquidez: "Liquidez",
  concentracao: "Concentração",
  protecao_cambial: "Proteção Cambial",
  protecao_inflacao: "Proteção contra Inflação",
  adequacao_objetivo: "Adequação ao Objetivo",
  adequacao_horizonte: "Adequação ao Horizonte",
  adequacao_volatilidade: "Adequação à Volatilidade",
};

/** ✔ ponto forte · ⚠ ponto de atenção. */
export type DiagnosticStatus = "forte" | "atencao";

export interface DiagnosticFinding {
  dimension: DiagnosticDimension;
  label: string;
  status: DiagnosticStatus;
  /** 0–100 apenas para compor a pontuação geral do relatório. */
  score: number;
  headline: string;
  detail: string;
}

/** Relatório automático do Diagnóstico Inteligente. */
export interface DiagnosticReport {
  overallScore: number;
  findings: DiagnosticFinding[];
  strengths: DiagnosticFinding[];
  attentionPoints: DiagnosticFinding[];
  summary: string;
}

/** Cenários históricos previstos no documento oficial. */
export type StressScenarioId =
  | "covid_19"
  | "crise_2008"
  | "joesley_day"
  | "greve_caminhoneiros"
  | "alta_selic"
  | "queda_selic"
  | "inflacao_elevada"
  | "crise_bancaria_americana"
  | "cenarios_geopoliticos";

/** Comportamento esperado, em linguagem de setas (uso educacional). */
export type StressDirection = "forte_queda" | "queda" | "neutro" | "alta" | "forte_alta";

export const STRESS_DIRECTION_ARROW: Record<StressDirection, string> = {
  forte_queda: "▼▼▼",
  queda: "▼",
  neutro: "—",
  alta: "▲",
  forte_alta: "▲▲▲",
};

export const STRESS_DIRECTION_LABEL: Record<StressDirection, string> = {
  forte_queda: "Forte pressão negativa",
  queda: "Pressão negativa",
  neutro: "Comportamento estável",
  alta: "Comportamento protetivo",
  forte_alta: "Forte comportamento protetivo",
};

/**
 * Cenário histórico. As sensibilidades são referências educacionais de
 * comportamento típico de cada classe no ambiente descrito — nunca projeção
 * de rentabilidade.
 */
export interface StressScenario {
  id: StressScenarioId;
  label: string;
  period: string;
  context: string;
  sensitivity: Record<MacroClass, number>;
  learnings: string[];
}

export interface StressClassImpact {
  macro: MacroClass;
  label: string;
  weight: number;
  sensitivity: number;
  /** Contribuição da classe no comportamento da carteira (pp). */
  contribution: number;
  direction: StressDirection;
}

export interface StressScenarioResult {
  id: StressScenarioId;
  label: string;
  period: string;
  context: string;
  classImpacts: StressClassImpact[];
  /** Comportamento esperado agregado da carteira (educacional). */
  portfolioBehavior: number;
  /** Referência comparativa: portfólio 100% em ações. */
  allEquityBehavior: number;
  mostAffected: string[];
  protectors: string[];
  reading: string;
  learnings: string[];
}

export type ResilienceLabel = "alta" | "moderada" | "baixa";

export interface StressTestReport {
  results: StressScenarioResult[];
  resilience: ResilienceLabel;
  summary: string;
}

/** Ações do módulo "Próximos Passos". */
export type NextStepAction =
  "revisar_carteira" | "alterar_volatilidade" | "gerar_outra_estrategia" | "analise_personalizada";

export interface NextStep {
  action: NextStepAction;
  label: string;
  description: string;
  /** Destino declarado pelo documento (camada/painel ou CTA). */
  destination: string;
}

/** Gatilhos de complexidade que justificam orientação especializada. */
export type EscalationTriggerId =
  | "patrimonio_elevado"
  | "objetivo_complexo"
  | "geracao_de_renda"
  | "aposentadoria"
  | "investimentos_internacionais"
  | "indecisao_de_volatilidade"
  | "multiplas_simulacoes"
  | "carteira_sofisticada"
  | "pontos_de_atencao";

export interface EscalationTrigger {
  id: EscalationTriggerId;
  label: string;
  reason: string;
}

/** Origem da sugestão contextual (define a mensagem oficial exibida). */
export type EscalationOrigin = "diagnostico" | "stress_test";

export interface EscalationSuggestion {
  origin: EscalationOrigin;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  triggers: EscalationTrigger[];
}

/** Sinais de interação usados pelos gatilhos dos módulos ativos. */
export interface InteractionSignals {
  volatilityChanges: number;
  goalSimulations: number;
}

export const EMPTY_INTERACTION_SIGNALS: InteractionSignals = {
  volatilityChanges: 0,
  goalSimulations: 0,
};

/** Relatório completo da Camada 4. */
export interface PostAllocationAnalysis {
  diagnostic: DiagnosticReport;
  stressTest: StressTestReport;
  nextSteps: NextStep[];
  escalation: EscalationSuggestion;
}

/** Etapas apresentadas na Camada 4, na ordem oficial. */
export type InsightStage = "diagnostico" | "stress_test" | "proximos_passos";

export const INSIGHT_STAGES: InsightStage[] = ["diagnostico", "stress_test", "proximos_passos"];

export const INSIGHT_STAGE_LABEL: Record<InsightStage, string> = {
  diagnostico: "Diagnóstico Inteligente",
  stress_test: "Stress Test",
  proximos_passos: "Próximos Passos",
};

/** Link oficial de agendamento da consultoria Market Capital. */
export const CONSULTING_SCHEDULING_URL =
  "https://calendly.com/atendimento-marketcapital/consultoria";
