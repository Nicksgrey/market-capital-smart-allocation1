/**
 * CAMADA 4 — DIAGNÓSTICO INTELIGENTE.
 *
 * "Este módulo faz uma leitura completa da carteira construída. Ele compara a
 * carteira contra todas as políticas utilizadas pelo Motor Paramétrico e gera
 * um relatório automático."
 *
 * Ele NÃO altera pesos: lê Carteira Macro/Meso/Micro, Objetivo, Horizonte,
 * Volatilidade e Risk Budget e devolve pontos fortes, pontos de atenção e
 * explicações.
 */
import {
  MACRO_CLASS_LABEL,
  type MacroClass,
  type StrategicPortfolio,
} from "@/domain/allocation/types";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";

import {
  DIAGNOSTIC_DIMENSION_LABEL,
  type DiagnosticFinding,
  type DiagnosticReport,
} from "../types";

export function runDiagnosticEngine(input: {
  profile: InvestorProfileConsolidation;
  portfolio: StrategicPortfolio;
}): DiagnosticReport {
  const { profile, portfolio } = input;
  const { policy, optimization, structure, volatilityControl } = portfolio;
  const weights = optimization.weights;

  const findings: DiagnosticFinding[] = [
    diversification(structure, policy.diversification.minClasses),
    liquidity(structure, profile),
    concentration(structure, weights, policy.concentration.maxPerMacroClass),
    currencyProtection(weights, policy.saa.macro["exterior"]?.min ?? 0),
    inflationProtection(structure),
    goalAdequacy(portfolio, profile),
    horizonAdequacy(weights, profile),
    volatilityAdequacy(volatilityControl),
  ];

  const overallScore = Math.round(
    findings.reduce((sum, item) => sum + item.score, 0) / findings.length,
  );
  const strengths = findings.filter((item) => item.status === "forte");
  const attentionPoints = findings.filter((item) => item.status === "atencao");

  return {
    overallScore,
    findings,
    strengths,
    attentionPoints,
    summary:
      attentionPoints.length === 0
        ? `A carteira atende a todas as políticas avaliadas e está consistente com o perfil final, o horizonte e a volatilidade de ${volatilityControl.approvedVolatility}% ao ano.`
        : `A carteira atende às políticas essenciais, com ${attentionPoints.length} ponto(s) de atenção que merecem acompanhamento ao longo do tempo.`,
  };
}

function finding(
  dimension: DiagnosticFinding["dimension"],
  score: number,
  headline: string,
  detail: string,
  attentionBelow = 70,
): DiagnosticFinding {
  return {
    dimension,
    label: DIAGNOSTIC_DIMENSION_LABEL[dimension],
    status: score >= attentionBelow ? "forte" : "atencao",
    score,
    headline,
    detail,
  };
}

function diversification(
  structure: StrategicPortfolio["structure"],
  minClasses: number,
): DiagnosticFinding {
  const activeClasses = structure.macro.filter((b) => b.weight > 0).length;
  const sleeves = structure.macro.reduce((n, b) => n + b.sleeves.length, 0);
  const countries = (
    Object.keys(structure.countryDistribution) as Array<
      keyof typeof structure.countryDistribution
    >
  ).filter((key) => structure.countryDistribution[key] > 0).length;

  const score =
    activeClasses >= minClasses + 1 && countries >= 2
      ? 95
      : activeClasses >= minClasses
        ? 80
        : 55;

  return finding(
    "diversificacao",
    score,
    score >= 80
      ? "Diversificação adequada entre classes e regiões"
      : "Diversificação abaixo do recomendado",
    `${activeClasses} classes macro ativas, ${sleeves} sub-classes e ${countries} região(ões) geográfica(s). Mínimo exigido pela política: ${minClasses} classes.`,
  );
}

function liquidity(
  structure: StrategicPortfolio["structure"],
  profile: InvestorProfileConsolidation,
): DiagnosticFinding {
  const shortTerm =
    structure.liquidityDistribution.d0 + structure.liquidityDistribution.d1_d30;
  const need = profile.discovery.liquidityNeed;
  const required = need === "alta" ? 25 : need === "media" ? 15 : 8;
  const score = shortTerm >= required ? 92 : shortTerm >= required * 0.6 ? 68 : 45;

  return finding(
    "liquidez",
    score,
    score >= 70
      ? "Liquidez adequada ao objetivo"
      : "Liquidez de curto prazo abaixo do necessário",
    `${round1(shortTerm)}% da carteira está em liquidez de até D+30, frente a ${required}% de referência para uma necessidade de liquidez ${need ?? "não informada"}.`,
  );
}

function concentration(
  structure: StrategicPortfolio["structure"],
  weights: Record<MacroClass, number>,
  maxPerMacroClass: number,
): DiagnosticFinding {
  const macroEntries = (Object.keys(weights) as MacroClass[]).map((macro) => ({
    macro,
    weight: weights[macro],
  }));
  const heaviest = macroEntries.reduce((a, b) => (b.weight > a.weight ? b : a));
  const sleeves = structure.macro.flatMap((bucket) => bucket.sleeves);
  const heaviestSleeve = sleeves.length
    ? sleeves.reduce((a, b) => (b.weight > a.weight ? b : a))
    : null;

  const macroOk = heaviest.weight <= maxPerMacroClass;
  const sleeveOk = !heaviestSleeve || heaviestSleeve.weight <= 20;
  const score = macroOk && sleeveOk ? 90 : macroOk ? 65 : 50;

  return finding(
    "concentracao",
    score,
    score >= 70
      ? "Concentração dentro dos limites da política"
      : `Concentração elevada em ${heaviestSleeve ? heaviestSleeve.label : MACRO_CLASS_LABEL[heaviest.macro]}`,
    `Maior classe macro: ${MACRO_CLASS_LABEL[heaviest.macro]} com ${round1(heaviest.weight)}% (limite ${maxPerMacroClass}%).${
      heaviestSleeve
        ? ` Maior sub-classe: ${heaviestSleeve.label} com ${round1(heaviestSleeve.weight)}%.`
        : ""
    }`,
  );
}

function currencyProtection(
  weights: Record<MacroClass, number>,
  minExterior: number,
): DiagnosticFinding {
  const exterior = weights.exterior ?? 0;
  const score = exterior >= Math.max(minExterior, 10) ? 93 : exterior > 0 ? 62 : 40;

  return finding(
    "protecao_cambial",
    score,
    score >= 70
      ? "Proteção cambial presente via exposição internacional"
      : "Exposição cambial abaixo do recomendado",
    `Exposição internacional de ${round1(exterior)}%. A política estratégica prevê no mínimo ${round1(minExterior)}% para esse perfil, e a diversificação em moeda forte reduz o risco específico do mercado brasileiro.`,
  );
}

function inflationProtection(
  structure: StrategicPortfolio["structure"],
): DiagnosticFinding {
  const inflationLinked = structure.macro
    .flatMap((bucket) => bucket.sleeves)
    .filter((sleeve) => /ipca|infla|imobili|real/i.test(sleeve.label))
    .reduce((sum, sleeve) => sum + sleeve.weight, 0);
  const score = inflationLinked >= 15 ? 92 : inflationLinked >= 8 ? 72 : 50;

  return finding(
    "protecao_inflacao",
    score,
    score >= 70
      ? "Boa proteção contra inflação"
      : "Proteção contra inflação abaixo do desejável",
    `${round1(inflationLinked)}% da carteira está em ativos indexados à inflação ou com repasse de preços (IPCA+, debêntures incentivadas e ativos reais).`,
  );
}

function goalAdequacy(
  portfolio: StrategicPortfolio,
  profile: InvestorProfileConsolidation,
): DiagnosticFinding {
  const goalRules = portfolio.policy.goal;
  const validationOk = portfolio.validation.checks
    .filter((check) => check.id === "objetivo" || check.id === "liquidez")
    .every((check) => check.severity === "aprovado");
  const score = goalRules.goal == null ? 60 : validationOk ? 90 : 68;

  return finding(
    "adequacao_objetivo",
    score,
    score >= 70
      ? `Carteira coerente com o objetivo: ${goalRules.headline}`
      : "Coerência com o objetivo exige atenção",
    goalRules.goal == null
      ? "O objetivo principal não foi informado na Descoberta do Investidor, o que reduz a precisão das inclinações aplicadas pelo Optimization Engine."
      : `Diretrizes aplicadas: ${goalRules.directives.join("; ")}. Necessidade de liquidez declarada: ${profile.discovery.liquidityNeed ?? "não informada"}.`,
  );
}

function horizonAdequacy(
  weights: Record<MacroClass, number>,
  profile: InvestorProfileConsolidation,
): DiagnosticFinding {
  const horizon = profile.discovery.horizonYears;
  const risky =
    (weights.acoes_brasil ?? 0) +
    (weights.exterior ?? 0) +
    (weights.fiis ?? 0) +
    (weights.alternativos ?? 0);

  let score = 85;
  if (horizon == null) score = 60;
  else if (horizon <= 2 && risky > 25) score = 45;
  else if (horizon <= 5 && risky > 45) score = 62;
  else if (horizon >= 10 && risky < 20) score = 66;

  return finding(
    "adequacao_horizonte",
    score,
    score >= 70
      ? "Carteira consistente com o horizonte de investimento"
      : "Relação entre horizonte e ativos de risco merece atenção",
    horizon == null
      ? "O horizonte de investimento não foi informado, o que limita a leitura da adequação temporal da carteira."
      : `Horizonte declarado de ${horizon} ano(s) com ${round1(risky)}% em ativos de maior volatilidade.`,
  );
}

function volatilityAdequacy(
  control: StrategicPortfolio["volatilityControl"],
): DiagnosticFinding {
  const score =
    control.status === "aprovada"
      ? 96
      : control.status === "aprovada_com_alerta"
        ? 74
        : 50;

  return finding(
    "adequacao_volatilidade",
    score,
    score >= 70
      ? `Carteira consistente com a volatilidade de ${control.approvedVolatility}%`
      : "Volatilidade escolhida em desacordo com o Risk Budget",
    `Volatilidade aprovada: ${control.approvedVolatility}% ao ano. Faixa permitida pelo Risk Budget: ${control.allowedRange.min}% a ${control.allowedRange.max}%. Recomendada: ${control.recommendedVolatility}%.`,
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}