import {
  MACRO_CLASS_ORDER,
  type MacroClass,
  type OptimizationFactor,
  type OptimizationResult,
  type PolicyDecision,
} from "../types";
import { RISK_ORIENTATION } from "../policies/saa-policy";

/**
 * OPTIMIZATION ENGINE — cálculo dos pesos.
 *
 * Recebe o que o Policy Engine permitiu e a volatilidade aprovada pelo Motor
 * de Controle da Volatilidade e responde: "qual deve ser exatamente a
 * carteira?". Os pesos NÃO são os da SAA — a SAA apenas delimita as faixas.
 */
export function runOptimizationEngine(input: {
  policy: PolicyDecision;
  approvedVolatility: number;
}): OptimizationResult {
  const { policy } = input;
  const bands = policy.saa.macro;
  const volRange = policy.saa.volatility;

  // Posição relativa da volatilidade aprovada dentro da faixa do perfil.
  const t = clamp01(
    (input.approvedVolatility - volRange.min) / (volRange.max - volRange.min),
  );

  const weights = emptyWeights();
  const factors: OptimizationFactor[] = [];

  // 1) Ponto de partida: interpolação dentro da faixa da SAA pela volatilidade.
  for (const macro of MACRO_CLASS_ORDER) {
    const band = bands[macro];
    if (!band) continue;
    const span = band.max - band.min;
    weights[macro] =
      RISK_ORIENTATION[macro] === "risco"
        ? band.min + t * span
        : band.max - t * span;
  }
  factors.push({
    label: "Volatilidade aprovada",
    detail: `${input.approvedVolatility}% ao ano posiciona a carteira em ${Math.round(
      t * 100,
    )}% da faixa de risco permitida pela SAA ${policy.family}.`,
  });

  // 2) Inclinações por objetivo.
  applyTilts(weights, policy.goal.tilts, bands);
  factors.push({
    label: "Regras por objetivo",
    detail: `${policy.goal.headline}: ${policy.goal.directives.join(" · ")}.`,
  });

  // 3) Necessidade de liquidez: eleva caixa/renda fixa quando alta.
  const liquidityTilts: Partial<Record<MacroClass, number>> =
    policy.liquidityNeed === "alta"
      ? { caixa: 3, renda_fixa: 3, acoes_brasil: -3, exterior: -3 }
      : policy.liquidityNeed === "baixa"
        ? { caixa: -1, renda_fixa: -2, exterior: 2, acoes_brasil: 1 }
        : {};
  applyTilts(weights, liquidityTilts, bands);
  factors.push({
    label: "Regras de liquidez",
    detail: policy.liquidity.rationale,
  });

  // 4) Eficiência tributária entra na seleção de veículos (Allocation Engine),
  // não no peso macro — registrada aqui como critério ativo.
  factors.push({ label: "Regras tributárias", detail: policy.tax.rationale });

  // 5) Diversificação e concentração: nenhuma classe acima do limite duro.
  const maxClass = policy.concentration.maxPerMacroClass;
  for (const macro of MACRO_CLASS_ORDER) {
    if (weights[macro] > maxClass) weights[macro] = maxClass;
  }
  factors.push({
    label: "Diversificação e concentração",
    detail: `Limite de ${maxClass}% por classe macro, ${policy.concentration.maxPerIssuer}% por emissor e ${policy.concentration.maxPerSingleCompany}% por empresa.`,
  });

  // 6) Normalização para 100% respeitando as faixas da SAA.
  normalizeToBands(weights, bands);

  return {
    targetVolatility: input.approvedVolatility,
    weights: roundWeights(weights),
    bands,
    factors,
  };
}

function emptyWeights(): Record<MacroClass, number> {
  return {
    renda_fixa: 0,
    acoes_brasil: 0,
    exterior: 0,
    fiis: 0,
    alternativos: 0,
    caixa: 0,
  };
}

function applyTilts(
  weights: Record<MacroClass, number>,
  tilts: Partial<Record<MacroClass, number>>,
  bands: PolicyDecision["saa"]["macro"],
) {
  for (const macro of MACRO_CLASS_ORDER) {
    const band = bands[macro];
    const tilt = tilts[macro];
    if (!band || tilt == null) continue;
    weights[macro] = clamp(weights[macro] + tilt, band.min, band.max);
  }
}

/**
 * Ajusta os pesos para somar 100% distribuindo o resíduo proporcionalmente à
 * folga disponível de cada classe dentro da sua faixa da SAA.
 */
function normalizeToBands(
  weights: Record<MacroClass, number>,
  bands: PolicyDecision["saa"]["macro"],
) {
  for (let pass = 0; pass < 12; pass += 1) {
    const total = MACRO_CLASS_ORDER.reduce((sum, m) => sum + weights[m], 0);
    const residual = 100 - total;
    if (Math.abs(residual) < 0.001) return;

    const headroom = MACRO_CLASS_ORDER.map((macro) => {
      const band = bands[macro];
      if (!band) return { macro, room: 0 };
      const room =
        residual > 0 ? band.max - weights[macro] : weights[macro] - band.min;
      return { macro, room: Math.max(room, 0) };
    });

    const totalRoom = headroom.reduce((sum, h) => sum + h.room, 0);
    if (totalRoom <= 0) return;

    for (const { macro, room } of headroom) {
      if (room <= 0) continue;
      weights[macro] += (residual * room) / totalRoom;
    }
  }
}

function roundWeights(
  weights: Record<MacroClass, number>,
): Record<MacroClass, number> {
  const rounded = emptyWeights();
  for (const macro of MACRO_CLASS_ORDER) {
    rounded[macro] = Math.round(weights[macro]);
  }
  // Corrige o arredondamento na maior classe para fechar exatamente 100%.
  const diff =
    100 - MACRO_CLASS_ORDER.reduce((sum, m) => sum + rounded[m], 0);
  if (diff !== 0) {
    const largest = MACRO_CLASS_ORDER.reduce((a, b) =>
      rounded[a] >= rounded[b] ? a : b,
    );
    rounded[largest] += diff;
  }
  return rounded;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return clamp(value, 0, 1);
}