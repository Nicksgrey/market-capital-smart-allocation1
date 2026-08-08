/**
 * REGRA DE RENDA VARIÁVEL — BRASIL + EXTERIOR (restrição de alocação).
 *
 * Sempre que existir exposição a ações, a exposição TOTAL determinada pelo
 * Optimization Engine é repartida internamente em 50% Brasil e 50% Exterior.
 * A regra nunca aumenta artificialmente a renda variável: ela apenas divide o
 * peso já calculado. Quando a divisão 50/50 não couber nas faixas da SAA, a
 * exposição total da classe é recalculada dentro dos limites permitidos; se não
 * houver solução válida, a regra é marcada como inviável para que o Validation
 * Engine reprove a carteira.
 */
import {
  MACRO_CLASS_ORDER,
  type AllocationBand,
  type EquityExposure,
  type MacroClass,
} from "../types";

export const EQUITY_SPLIT_POLICY = {
  brasilShareOfEquity: 50,
  exteriorShareOfEquity: 50,
  rationale:
    "A exposição internacional foi incorporada para reduzir a concentração do patrimônio em um único país, ampliar a diversificação geográfica e cambial e proporcionar exposição a diferentes economias, setores e ciclos de mercado.",
} as const;

type Bands = Partial<Record<MacroClass, AllocationBand>>;

export function applyEquitySplit(
  weights: Record<MacroClass, number>,
  bands: Bands,
): EquityExposure {
  const requestedTotal = round4(weights.acoes_brasil + weights.exterior);

  if (requestedTotal <= 0.01) {
    weights.acoes_brasil = 0;
    weights.exterior = 0;
    return {
      total: 0,
      brasil: 0,
      exterior: 0,
      requestedTotal: 0,
      adjusted: false,
      feasible: true,
      note: "O motor não determinou exposição a renda variável para este perfil, portanto nenhuma exposição em ações foi criada artificialmente.",
    };
  }

  const brBand = bands.acoes_brasil;
  const exBand = bands.exterior;
  const minHalf = Math.max(brBand?.min ?? 0, exBand?.min ?? 0);
  const maxHalf = Math.min(brBand?.max ?? 0, exBand?.max ?? 0);

  if (maxHalf < minHalf || maxHalf <= 0) {
    const half = round4(requestedTotal / 2);
    weights.acoes_brasil = half;
    weights.exterior = half;
    return {
      total: round4(half * 2),
      brasil: half,
      exterior: half,
      requestedTotal,
      adjusted: false,
      feasible: false,
      note: "Não foi encontrada uma combinação válida: as faixas da SAA para Ações Brasil e Ações Exterior não permitem uma divisão 50/50 da exposição em renda variável.",
    };
  }

  const half = clamp(requestedTotal / 2, minHalf, maxHalf);
  const total = round4(half * 2);
  weights.acoes_brasil = round4(half);
  weights.exterior = round4(half);

  const delta = round4(requestedTotal - total);
  const leftover = redistribute(weights, bands, delta);
  const adjusted = Math.abs(delta) > 0.01;
  const feasible = Math.abs(leftover) < 0.05;

  return {
    total,
    brasil: round4(half),
    exterior: round4(half),
    requestedTotal,
    adjusted,
    feasible,
    note: feasible
      ? adjusted
        ? `A exposição total em renda variável foi recalculada de ${fmt(requestedTotal)}% para ${fmt(total)}% para permitir a divisão 50/50 entre Brasil e Exterior dentro das faixas da SAA, com o residual redistribuído entre as demais classes permitidas.`
        : `A exposição total em renda variável de ${fmt(total)}% foi dividida em ${fmt(half)}% em Ações Brasil e ${fmt(half)}% em Ações Exterior (50/50 sobre a classe de ações).`
      : "Não foi encontrada uma combinação válida entre a divisão 50/50 da renda variável e as demais restrições parametrizadas da carteira.",
  };
}

/** Distribui um residual entre as classes NÃO acionárias respeitando as faixas. */
function redistribute(
  weights: Record<MacroClass, number>,
  bands: Bands,
  delta: number,
): number {
  let remaining = delta;
  const others = MACRO_CLASS_ORDER.filter(
    (macro) => macro !== "acoes_brasil" && macro !== "exterior",
  );

  for (let pass = 0; pass < 12 && Math.abs(remaining) > 0.001; pass += 1) {
    const headroom = others.map((macro) => {
      const band = bands[macro];
      if (!band) return { macro, room: 0 };
      const room =
        remaining > 0 ? band.max - weights[macro] : weights[macro] - band.min;
      return { macro, room: Math.max(room, 0) };
    });
    const totalRoom = headroom.reduce((sum, h) => sum + h.room, 0);
    if (totalRoom <= 0) break;

    for (const { macro, room } of headroom) {
      if (room <= 0) continue;
      const share = (remaining * room) / totalRoom;
      weights[macro] = round4(weights[macro] + share);
    }
    // Recalcula o residual real a partir do total da carteira.
    const total = MACRO_CLASS_ORDER.reduce((sum, m) => sum + weights[m], 0);
    remaining = round4(100 - total);
  }

  return remaining;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function fmt(value: number): string {
  return (Math.round(value * 10) / 10).toString().replace(".", ",");
}
