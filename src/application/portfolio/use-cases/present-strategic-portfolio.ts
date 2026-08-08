import { MACRO_CLASS_LABEL } from "@/domain/allocation/types";
import { EQUITY_SPLIT_POLICY } from "@/domain/allocation/policies/equity-split-rules";
import {
  FII_INTERNAL_RATIONALE,
  FI_INFRA_RATIONALE,
} from "@/domain/allocation/policies/fii-internal-rules";
import { microExamplesFor } from "@/domain/portfolio/micro-catalog";
import {
  MICRO_DISCLAIMER,
  PORTFOLIO_CONCLUSION,
  type EquitySummaryView,
  type MacroView,
  type MesoGroupView,
  type MicroGroupView,
} from "@/domain/portfolio/types";
import { riskProfileLabel } from "@/domain/profiling/value-objects/risk-profile";

import type {
  PresentStrategicPortfolioInput,
  PresentStrategicPortfolioOutput,
} from "../dto/portfolio-presentation.dto";

/**
 * CAMADA 3 — CONSTRUÇÃO E APRESENTAÇÃO DA CARTEIRA.
 *
 * Não calcula nada: recebe a carteira aprovada pelo Validation Engine e
 * organiza a visualização em Macro → Meso → Micro.
 */
export function presentStrategicPortfolio(
  input: PresentStrategicPortfolioInput,
): PresentStrategicPortfolioOutput {
  const { profile, portfolio } = input;
  const { structure, optimization, validation } = portfolio;
  const investedAmount =
    input.investedAmount != null && input.investedAmount > 0
      ? input.investedAmount
      : null;

  /** Percentual é a fonte de verdade: o valor é sempre derivado dele. */
  const amountOf = (weight: number): number | null =>
    investedAmount == null ? null : (investedAmount * weight) / 100;

  const macro: MacroView[] = structure.macro.map((bucket) => ({
    macro: bucket.macro,
    label: bucket.label,
    weight: bucket.weight,
    amount: amountOf(bucket.weight),
  }));

  const meso: MesoGroupView[] = structure.macro.map((bucket) => ({
    macro: bucket.macro,
    label: bucket.label,
    weight: bucket.weight,
    amount: amountOf(bucket.weight),
    sleeves: bucket.sleeves.map((sleeve) => ({
      id: sleeve.id,
      label: sleeve.label,
      weight: sleeve.weight,
      shareOfClass: sleeve.shareOfClass,
      amount: amountOf(sleeve.weight),
      liquidityBucket: sleeve.liquidityBucket,
      country: sleeve.country,
      ...(sleeve.taxNote ? { taxNote: sleeve.taxNote } : {}),
    })),
  }));

  const micro: MicroGroupView[] = structure.macro.flatMap((bucket) =>
    bucket.sleeves.map((sleeve) => ({
      macro: bucket.macro,
      macroLabel: MACRO_CLASS_LABEL[bucket.macro],
      sleeveId: sleeve.id,
      sleeveLabel: sleeve.label,
      weight: sleeve.weight,
      amount: amountOf(sleeve.weight),
      assets: sleeve.micro.map((asset) => ({
        name: asset.name,
        description: asset.description,
        weight: asset.weight,
        amount: amountOf(asset.weight),
        examples: microExamplesFor(sleeve.id),
      })),
    })),
  );

  const totalWeight =
    Math.round(macro.reduce((sum, item) => sum + item.weight, 0) * 10) / 10;

  const brasil = weightOf(macro, "acoes_brasil");
  const exterior = weightOf(macro, "exterior");
  const equityTotal = round1(brasil + exterior);
  const equity: EquitySummaryView | null =
    equityTotal > 0
      ? {
          total: equityTotal,
          brasil,
          exterior,
          totalAmount: amountOf(equityTotal),
          brasilAmount: amountOf(brasil),
          exteriorAmount: amountOf(exterior),
        }
      : null;

  const rationales = buildRationales({
    equity,
    fiis: meso.find((group) => group.macro === "fiis") ?? null,
    hasFiInfra: meso.some((group) =>
      group.sleeves.some((sleeve) => sleeve.id === "renda_fixa:fi_infra"),
    ),
  });

  return {
    header: {
      finalProfile: riskProfileLabel(profile.riskBudget.finalProfile),
      targetVolatility: optimization.targetVolatility,
      approvedByValidationEngine: validation.approved,
      educationalOnly: portfolio.educationalOnly,
    },
    macro,
    meso,
    micro,
    investedAmount,
    equity,
    rationales,
    liquidityDistribution: structure.liquidityDistribution,
    countryDistribution: structure.countryDistribution,
    totalWeight,
    totalAmount: investedAmount,
    microDisclaimer: MICRO_DISCLAIMER,
    conclusion: {
      title: PORTFOLIO_CONCLUSION.title,
      message: PORTFOLIO_CONCLUSION.message,
      ctaLabel: PORTFOLIO_CONCLUSION.ctaLabel,
    },
  };
}

function buildRationales(input: {
  equity: EquitySummaryView | null;
  fiis: MesoGroupView | null;
  hasFiInfra: boolean;
}): string[] {
  const rationales: string[] = [];

  if (input.equity) {
    rationales.push(
      `Sua exposição em ações de ${pct(input.equity.total)} foi distribuída entre Brasil (${pct(
        input.equity.brasil,
      )}) e Exterior (${pct(
        input.equity.exterior,
      )}) para reduzir a concentração geográfica do patrimônio, ampliar a diversificação entre economias e setores e adicionar diversificação cambial à estratégia.`,
    );
    rationales.push(EQUITY_SPLIT_POLICY.rationale);
  }

  if (input.fiis) {
    const detail = input.fiis.sleeves
      .map((sleeve) => `${sleeve.label} ${pct(sleeve.shareOfClass)} da classe (${pct(sleeve.weight)} da carteira)`)
      .join(", ");
    rationales.push(
      `${FII_INTERNAL_RATIONALE} Na sua carteira, os FIIs representam ${pct(
        input.fiis.weight,
      )} do patrimônio: ${detail}.`,
    );
  }

  if (input.hasFiInfra) rationales.push(FI_INFRA_RATIONALE);

  return rationales;
}

function weightOf(macro: MacroView[], key: MacroView["macro"]): number {
  return macro.find((item) => item.macro === key)?.weight ?? 0;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function pct(value: number): string {
  return `${(Math.round(value * 10) / 10).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}