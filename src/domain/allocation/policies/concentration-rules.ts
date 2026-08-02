import type { PolicyFamily } from "@/domain/profiling/types";
import type { ConcentrationRules } from "../types";

/**
 * REGRAS DE CONCENTRAÇÃO
 *
 * Limites duros verificados por classe, setor, país, emissor e tipo de ativo.
 * Exemplos oficiais de reprovação: FIIs 90%, Brasil 95%, uma única empresa 80%.
 */
export const CONCENTRATION_RULES: Record<PolicyFamily, ConcentrationRules> = {
  conservador: {
    maxPerMacroClass: 95,
    maxPerCountry: 95,
    maxPerIssuer: 20,
    maxPerSingleCompany: 10,
    maxPerMesoSleeve: 35,
  },
  moderado: {
    maxPerMacroClass: 60,
    maxPerCountry: 80,
    maxPerIssuer: 15,
    maxPerSingleCompany: 8,
    maxPerMesoSleeve: 25,
  },
  arrojado: {
    maxPerMacroClass: 45,
    maxPerCountry: 70,
    maxPerIssuer: 12,
    maxPerSingleCompany: 8,
    maxPerMesoSleeve: 22,
  },
};

export function concentrationRulesOf(
  family: PolicyFamily,
): ConcentrationRules {
  return CONCENTRATION_RULES[family];
}