/**
 * CAMADA 4 — Contexto completo da IA Financeira.
 *
 * "Ele possui acesso ao contexto completo do investidor: perfil, objetivo,
 * horizonte, volatilidade, Risk Budget, carteira, classes, setores e ativos."
 */
import {
  LIQUIDITY_BUCKET_LABEL,
  MACRO_CLASS_LABEL,
  type Country,
  type LiquidityBucket,
} from "@/domain/allocation/types";
import { capacityLabelText } from "@/domain/profiling/value-objects/capacity-label";
import { riskProfileLabel } from "@/domain/profiling/value-objects/risk-profile";

import { analyzePortfolio } from "./analyze-portfolio";
import type { AiAdvisorContext, AnalyzePortfolioInput } from "../dto/insights.dto";

const COUNTRY_LABEL: Record<Country, string> = {
  brasil: "Brasil",
  estados_unidos: "Estados Unidos",
  europa: "Europa",
  emergentes: "Emergentes",
};

export function buildAiAdvisorContext(
  input: AnalyzePortfolioInput,
): AiAdvisorContext {
  const { profile, portfolio } = input;
  const analysis = analyzePortfolio(input);
  const { policy, optimization, structure, volatilityControl, validation } =
    portfolio;

  return {
    perfil: {
      perfilComportamental: riskProfileLabel(profile.behavioral.profile),
      scoreComportamental: profile.behavioral.score,
      capacidadeFinanceira: capacityLabelText(profile.financialCapacity.label),
      scoreCapacidadeFinanceira: profile.financialCapacity.score,
      riskBudget: profile.riskBudget.riskBudgetScore,
      perfilFinal: riskProfileLabel(profile.riskBudget.finalProfile),
      familiaDePolitica: policy.family,
    },
    objetivo: policy.goal.headline,
    horizonteAnos: profile.discovery.horizonYears,
    necessidadeDeLiquidez: profile.discovery.liquidityNeed ?? "não informada",
    volatilidade: {
      aprovada: volatilityControl.approvedVolatility,
      recomendada: volatilityControl.recommendedVolatility,
      faixaPermitida: `${volatilityControl.allowedRange.min}% a ${volatilityControl.allowedRange.max}%`,
      status: volatilityControl.status,
    },
    carteiraMacro: structure.macro.map((bucket) => ({
      classe: MACRO_CLASS_LABEL[bucket.macro],
      peso: bucket.weight,
    })),
    carteiraMeso: structure.macro.flatMap((bucket) =>
      bucket.sleeves.map((sleeve) => ({
        classe: MACRO_CLASS_LABEL[bucket.macro],
        subClasse: sleeve.label,
        peso: sleeve.weight,
        pesoDentroDaClasse: sleeve.shareOfClass,
      })),
    ),
    carteiraMicro: structure.macro.flatMap((bucket) =>
      bucket.sleeves.flatMap((sleeve) =>
        sleeve.micro.map((asset) => ({
          subClasse: sleeve.label,
          ativo: asset.name,
          peso: asset.weight,
        })),
      ),
    ),
    distribuicaoDeLiquidez: Object.fromEntries(
      (
        Object.keys(structure.liquidityDistribution) as LiquidityBucket[]
      ).map((bucket) => [
        LIQUIDITY_BUCKET_LABEL[bucket],
        structure.liquidityDistribution[bucket],
      ]),
    ),
    distribuicaoGeografica: Object.fromEntries(
      (Object.keys(structure.countryDistribution) as Country[]).map(
        (country) => [
          COUNTRY_LABEL[country],
          structure.countryDistribution[country],
        ],
      ),
    ),
    rendaVariavel: {
      total: optimization.equity.total,
      brasil: optimization.equity.brasil,
      exterior: optimization.equity.exterior,
      regra: "50% da exposição total em ações no Brasil e 50% no Exterior.",
      observacao: optimization.equity.note,
    },
    politicas: {
      saa: `${policy.saa.family} — ${policy.saa.objective}`,
      diretrizesDoObjetivo: policy.goal.directives,
      limitesDeConcentracao: `Máximo por classe macro ${policy.concentration.maxPerMacroClass}%, por país ${policy.concentration.maxPerCountry}%, por emissor ${policy.concentration.maxPerIssuer}%, por empresa ${policy.concentration.maxPerSingleCompany}%.`,
      regrasTributarias: policy.tax.preferenceOrder,
    },
    diagnostico: {
      pontuacaoGeral: analysis.diagnostic.overallScore,
      pontosFortes: analysis.diagnostic.strengths.map((f) => f.headline),
      pontosDeAtencao: analysis.diagnostic.attentionPoints.map(
        (f) => f.headline,
      ),
    },
    stressTest: {
      resiliencia: analysis.stressTest.resilience,
      cenarios: analysis.stressTest.results.map((result) => ({
        cenario: result.label,
        leitura: result.reading,
      })),
    },
    validationEngine: {
      aprovada: validation.approved,
      resumo: validation.summary,
    },
    apenasEducacional: portfolio.educationalOnly,
  };
}

export function optimizationFactorsSummary(
  input: AnalyzePortfolioInput,
): string[] {
  return input.portfolio.optimization.factors.map(
    (factor) => `${factor.label}: ${factor.detail}`,
  );
}