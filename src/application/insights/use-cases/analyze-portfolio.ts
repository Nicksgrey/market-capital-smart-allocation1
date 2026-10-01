/**
 * CAMADA 4 — INTELIGÊNCIA PÓS-ALOCAÇÃO (orquestração oficial).
 *
 * Sequência ativa: Diagnóstico Inteligente → Stress Test → Próximos Passos.
 * Este caso de uso consome APENAS a carteira aprovada pelo Validation Engine.
 */
import { runDiagnosticEngine } from "@/domain/insights/engines/diagnostic-engine";
import { runNextStepsEngine, NEXT_STEPS } from "@/domain/insights/engines/next-steps-engine";
import { runStressTestEngine } from "@/domain/insights/engines/stress-test-engine";
import { EMPTY_INTERACTION_SIGNALS } from "@/domain/insights/types";

import type {
  AnalyzePortfolioInput,
  AnalyzePortfolioOutput,
} from "../dto/insights.dto";

export function analyzePortfolio(
  input: AnalyzePortfolioInput,
): AnalyzePortfolioOutput {
  const { profile, portfolio } = input;
  const signals = input.signals ?? EMPTY_INTERACTION_SIGNALS;

  const diagnostic = runDiagnosticEngine({ profile, portfolio });
  const stressTest = runStressTestEngine({ portfolio });
  const escalation = runNextStepsEngine({
    profile,
    portfolio,
    diagnostic,
    stressTest,
    signals,
    ...(input.escalationOrigin ? { origin: input.escalationOrigin } : {}),
  });

  return { diagnostic, stressTest, nextSteps: NEXT_STEPS, escalation };
}