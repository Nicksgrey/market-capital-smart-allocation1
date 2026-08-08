/**
 * REGRA DA CLASSE AÇÕES — BRASIL + EXTERIOR (restrição interna da classe).
 *
 * A regra se aplica EXCLUSIVAMENTE à classe AÇÕES — nunca ao conjunto da renda
 * variável. FIIs, FI-Infra e demais classes NÃO entram neste cálculo.
 *
 * AÇÕES → 50% Ações Brasil + 50% Ações Exterior.
 *
 * O peso total de Ações definido pelo Optimization Engine é preservado
 * integralmente: a regra apenas reparte esse peso ao meio, sem alterar a SAA,
 * sem recalcular o total e sem redistribuir resíduos para outras classes.
 */
import {
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
  _bands: Bands,
): EquityExposure {
  /** Peso total da CLASSE AÇÕES determinado pelo Optimization Engine. */
  const equityTotal = round4(weights.acoes_brasil + weights.exterior);

  if (equityTotal <= 0.01) {
    weights.acoes_brasil = 0;
    weights.exterior = 0;
    return {
      total: 0,
      brasil: 0,
      exterior: 0,
      requestedTotal: 0,
      adjusted: false,
      feasible: true,
      note: "O motor não determinou exposição à classe Ações para este perfil, portanto nenhuma exposição em ações foi criada artificialmente.",
    };
  }

  /** Divisão interna da classe: metade exata para cada geografia. */
  const half = round4(equityTotal / 2);
  weights.acoes_brasil = half;
  weights.exterior = half;

  return {
    total: equityTotal,
    brasil: half,
    exterior: half,
    requestedTotal: equityTotal,
    adjusted: false,
    feasible: true,
    note: `A exposição à classe Ações de ${fmt(equityTotal)}% definida pelo Optimization Engine foi preservada e dividida internamente em ${fmt(
      half,
    )}% em Ações Brasil e ${fmt(half)}% em Ações Exterior (50/50 da classe Ações). FIIs, FI-Infra e demais classes não entram neste cálculo.`,
  };
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function fmt(value: number): string {
  return (Math.round(value * 10) / 10).toString().replace(".", ",");
}
