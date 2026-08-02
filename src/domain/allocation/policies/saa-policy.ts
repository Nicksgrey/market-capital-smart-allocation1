import type { PolicyFamily } from "@/domain/profiling/types";
import type { MacroClass, SaaPolicy } from "../types";

/**
 * POLÍTICA DE ALOCAÇÃO ESTRATÉGICA (SAA)
 *
 * Faixas macro oficiais por família de perfil. Nenhum peso calculado pelo
 * Optimization Engine pode sair destas faixas.
 */
export const SAA_POLICIES: Record<PolicyFamily, SaaPolicy> = {
  conservador: {
    family: "conservador",
    objective: "Preservação do patrimônio",
    volatility: { min: 2, max: 6 },
    macro: {
      renda_fixa: { min: 70, max: 95 },
      acoes_brasil: { min: 0, max: 20 },
      fiis: { min: 5, max: 15 },
      exterior: { min: 0, max: 15 },
      caixa: { min: 5, max: 10 },
    },
  },
  moderado: {
    family: "moderado",
    objective: "Crescimento com estabilidade",
    volatility: { min: 6, max: 10 },
    macro: {
      renda_fixa: { min: 40, max: 60 },
      acoes_brasil: { min: 15, max: 30 },
      exterior: { min: 15, max: 30 },
      fiis: { min: 10, max: 20 },
      caixa: { min: 0, max: 5 },
    },
  },
  arrojado: {
    family: "arrojado",
    objective: "Maximização do patrimônio",
    volatility: { min: 10, max: 18 },
    macro: {
      renda_fixa: { min: 10, max: 35 },
      acoes_brasil: { min: 20, max: 40 },
      exterior: { min: 25, max: 45 },
      fiis: { min: 5, max: 15 },
      alternativos: { min: 5, max: 15 },
    },
  },
};

export function saaPolicyOf(family: PolicyFamily): SaaPolicy {
  return SAA_POLICIES[family];
}

/** Classes habilitadas pela SAA da família (as demais ficam em 0%). */
export function allowedMacroClasses(family: PolicyFamily): MacroClass[] {
  return Object.keys(SAA_POLICIES[family].macro) as MacroClass[];
}

/**
 * Classes de risco crescem quando a volatilidade-alvo sobe dentro da faixa;
 * as defensivas se comportam de forma inversa.
 */
export const RISK_ORIENTATION: Record<MacroClass, "risco" | "defensiva"> = {
  acoes_brasil: "risco",
  exterior: "risco",
  alternativos: "risco",
  fiis: "risco",
  renda_fixa: "defensiva",
  caixa: "defensiva",
};