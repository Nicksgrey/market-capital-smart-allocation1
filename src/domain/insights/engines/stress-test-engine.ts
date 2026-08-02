/**
 * CAMADA 4 — STRESS TEST.
 *
 * Não muda a carteira. Para cada cenário histórico mostra: comportamento
 * esperado da carteira, quais classes tenderiam a sofrer mais, quais
 * tenderiam a proteger o patrimônio e os principais aprendizados.
 *
 * Foco EDUCACIONAL: nenhuma projeção de rentabilidade, nenhuma garantia de
 * repetição de comportamento passado.
 */
import {
  MACRO_CLASS_LABEL,
  MACRO_CLASS_ORDER,
  type MacroClass,
  type StrategicPortfolio,
} from "@/domain/allocation/types";

import { STRESS_SCENARIOS } from "../scenarios";
import type {
  ResilienceLabel,
  StressClassImpact,
  StressDirection,
  StressScenarioResult,
  StressTestReport,
} from "../types";

export function runStressTestEngine(input: {
  portfolio: StrategicPortfolio;
}): StressTestReport {
  const weights = input.portfolio.optimization.weights;

  const results: StressScenarioResult[] = STRESS_SCENARIOS.map((scenario) => {
    const classImpacts: StressClassImpact[] = MACRO_CLASS_ORDER.filter(
      (macro) => (weights[macro] ?? 0) > 0,
    ).map((macro) => {
      const weight = weights[macro] ?? 0;
      const sensitivity = scenario.sensitivity[macro];
      return {
        macro,
        label: MACRO_CLASS_LABEL[macro],
        weight: round1(weight),
        sensitivity,
        contribution: round1((weight / 100) * sensitivity),
        direction: directionOf(sensitivity),
      };
    });

    const portfolioBehavior = round1(
      classImpacts.reduce((sum, item) => sum + item.contribution, 0),
    );
    const allEquityBehavior = scenario.sensitivity.acoes_brasil;

    const suffering = classImpacts
      .filter((item) => item.sensitivity < 0)
      .sort((a, b) => a.sensitivity - b.sensitivity);
    const protecting = classImpacts
      .filter((item) => item.sensitivity > 0)
      .sort((a, b) => b.sensitivity - a.sensitivity);

    return {
      id: scenario.id,
      label: scenario.label,
      period: scenario.period,
      context: scenario.context,
      classImpacts,
      portfolioBehavior,
      allEquityBehavior,
      mostAffected: suffering.map((item) => item.label),
      protectors: protecting.map((item) => item.label),
      reading: readingOf(portfolioBehavior, allEquityBehavior, protecting.map((i) => i.label)),
      learnings: scenario.learnings,
    };
  });

  const negatives = results.filter((result) => result.portfolioBehavior < 0);
  const worst = negatives.length
    ? Math.min(...negatives.map((result) => result.portfolioBehavior))
    : 0;
  const resilience: ResilienceLabel =
    worst >= -8 ? "alta" : worst >= -15 ? "moderada" : "baixa";

  return {
    results,
    resilience,
    summary:
      `Nos cenários simulados, o comportamento adverso mais intenso da carteira foi de ${round1(worst)}%, ` +
      `caracterizando resiliência ${resilience}. Os valores são referências educacionais de comportamento de classes ` +
      `em cada ambiente de mercado e não representam projeção de rentabilidade.`,
  };
}

function directionOf(sensitivity: number): StressDirection {
  if (sensitivity <= -20) return "forte_queda";
  if (sensitivity < -1) return "queda";
  if (sensitivity <= 1) return "neutro";
  if (sensitivity < 8) return "alta";
  return "forte_alta";
}

function readingOf(
  portfolioBehavior: number,
  allEquityBehavior: number,
  protectors: string[],
): string {
  if (portfolioBehavior >= 0) {
    return `Nesse ambiente a carteira tenderia a se comportar de forma positiva, sustentada principalmente por ${
      protectors.length ? protectors.join(", ") : "ativos de menor volatilidade"
    }.`;
  }
  const cushion = round1(allEquityBehavior - portfolioBehavior);
  return `A carteira tenderia a sofrer ${Math.abs(portfolioBehavior)}%, ${
    cushion > 0
      ? `aproximadamente ${cushion} pontos percentuais menos do que um portfólio 100% em ações`
      : "em linha com uma carteira integralmente exposta a ações"
  }, em razão da diversificação entre classes${
    protectors.length ? ` e do comportamento protetivo de ${protectors.join(", ")}` : ""
  }.`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function macroWeightsOf(
  portfolio: StrategicPortfolio,
): Record<MacroClass, number> {
  return portfolio.optimization.weights;
}