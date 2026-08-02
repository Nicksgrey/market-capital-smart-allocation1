import { MACRO_CLASS_LABEL } from "@/domain/allocation/types";
import { microExamplesFor } from "@/domain/portfolio/micro-catalog";
import {
  MICRO_DISCLAIMER,
  PORTFOLIO_CONCLUSION,
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

  const macro: MacroView[] = structure.macro.map((bucket) => ({
    macro: bucket.macro,
    label: bucket.label,
    weight: bucket.weight,
  }));

  const meso: MesoGroupView[] = structure.macro.map((bucket) => ({
    macro: bucket.macro,
    label: bucket.label,
    weight: bucket.weight,
    sleeves: bucket.sleeves.map((sleeve) => ({
      id: sleeve.id,
      label: sleeve.label,
      weight: sleeve.weight,
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
      assets: sleeve.micro.map((asset) => ({
        name: asset.name,
        description: asset.description,
        weight: asset.weight,
        examples: microExamplesFor(sleeve.id),
      })),
    })),
  );

  const totalWeight =
    Math.round(macro.reduce((sum, item) => sum + item.weight, 0) * 10) / 10;

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
    liquidityDistribution: structure.liquidityDistribution,
    countryDistribution: structure.countryDistribution,
    totalWeight,
    microDisclaimer: MICRO_DISCLAIMER,
    conclusion: {
      title: PORTFOLIO_CONCLUSION.title,
      message: PORTFOLIO_CONCLUSION.message,
      ctaLabel: PORTFOLIO_CONCLUSION.ctaLabel,
    },
  };
}