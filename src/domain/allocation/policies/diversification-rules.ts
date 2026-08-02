import type { PolicyFamily } from "@/domain/profiling/types";
import type { DiversificationRules } from "../types";

/**
 * REGRAS DE DIVERSIFICAÇÃO
 *
 * Responde: "Como distribuir o patrimônio para evitar concentração
 * excessiva?" — diversificação entre classes, geográfica, setorial,
 * concentração por ativo, por emissor e correlação entre ativos.
 */
export const DIVERSIFICATION_RULES: Record<PolicyFamily, DiversificationRules> =
  {
    conservador: {
      maxPerAsset: 15,
      maxPerIssuer: 20,
      maxPerSector: 25,
      maxPerCountry: 95,
      minClasses: 3,
      maxCorrelatedCluster: 60,
    },
    moderado: {
      maxPerAsset: 12,
      maxPerIssuer: 15,
      maxPerSector: 25,
      maxPerCountry: 80,
      minClasses: 4,
      maxCorrelatedCluster: 55,
    },
    arrojado: {
      maxPerAsset: 10,
      maxPerIssuer: 12,
      maxPerSector: 25,
      maxPerCountry: 70,
      minClasses: 5,
      maxCorrelatedCluster: 50,
    },
  };

export const DIVERSIFICATION_DIMENSIONS = [
  "Diversificação entre classes",
  "Diversificação geográfica",
  "Diversificação setorial",
  "Concentração por ativo",
  "Concentração por emissor",
  "Correlação entre ativos",
] as const;

export function diversificationRulesOf(
  family: PolicyFamily,
): DiversificationRules {
  return DIVERSIFICATION_RULES[family];
}