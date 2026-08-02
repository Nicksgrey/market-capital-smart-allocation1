import type { PolicyFamily, RiskProfile } from "../types";

/**
 * Bandas de classificação definidas na documentação oficial:
 * 0–20 Muito conservador | 21–40 Conservador | 41–60 Moderado
 * 61–80 Moderado Arrojado | 81–100 Arrojado
 */
export const RISK_PROFILE_BANDS: ReadonlyArray<{
  profile: RiskProfile;
  label: string;
  min: number;
  max: number;
}> = [
  { profile: "muito_conservador", label: "Muito Conservador", min: 0, max: 20 },
  { profile: "conservador", label: "Conservador", min: 21, max: 40 },
  { profile: "moderado", label: "Moderado", min: 41, max: 60 },
  { profile: "moderado_arrojado", label: "Moderado Arrojado", min: 61, max: 80 },
  { profile: "arrojado", label: "Arrojado", min: 81, max: 100 },
];

export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function classifyRiskProfile(score: number): RiskProfile {
  const value = clampScore(score);
  const band = RISK_PROFILE_BANDS.find(
    (b) => value >= b.min && value <= b.max,
  );
  return band?.profile ?? "muito_conservador";
}

export function riskProfileLabel(profile: RiskProfile): string {
  return (
    RISK_PROFILE_BANDS.find((b) => b.profile === profile)?.label ?? "Indefinido"
  );
}

/**
 * A Política de Alocação Estratégica (SAA) da Camada 2 é organizada em três
 * famílias: Conservador, Moderado e Arrojado. As cinco bandas de perfil são
 * mapeadas para essas famílias sempre pelo menor risco da faixa.
 */
export function policyFamilyOf(profile: RiskProfile): PolicyFamily {
  switch (profile) {
    case "muito_conservador":
    case "conservador":
      return "conservador";
    case "moderado":
    case "moderado_arrojado":
      return "moderado";
    case "arrojado":
      return "arrojado";
  }
}

export function policyFamilyLabel(family: PolicyFamily): string {
  switch (family) {
    case "conservador":
      return "Conservador";
    case "moderado":
      return "Moderado";
    case "arrojado":
      return "Arrojado";
  }
}