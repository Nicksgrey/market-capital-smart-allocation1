import type { CapacityLabel } from "../types";

/**
 * O Financial Capacity Score (FCS) usa a mesma escala de 0 a 100 do perfil
 * comportamental, permitindo o cruzamento direto no Risk Budget.
 */
export const CAPACITY_BANDS: ReadonlyArray<{
  label: CapacityLabel;
  text: string;
  min: number;
  max: number;
}> = [
  { label: "muito_baixa", text: "Muito Baixa", min: 0, max: 20 },
  { label: "baixa", text: "Baixa", min: 21, max: 40 },
  { label: "moderada", text: "Moderada", min: 41, max: 60 },
  { label: "alta", text: "Alta", min: 61, max: 80 },
  { label: "muito_alta", text: "Muito Alta", min: 81, max: 100 },
];

export function classifyCapacity(score: number): CapacityLabel {
  const value = Math.min(100, Math.max(0, Math.round(score)));
  return (
    CAPACITY_BANDS.find((b) => value >= b.min && value <= b.max)?.label ??
    "muito_baixa"
  );
}

export function capacityLabelText(label: CapacityLabel): string {
  return CAPACITY_BANDS.find((b) => b.label === label)?.text ?? "Indefinida";
}