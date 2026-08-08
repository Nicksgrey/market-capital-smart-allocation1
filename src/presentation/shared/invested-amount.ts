/**
 * Valor financeiro informado na entrada da Camada 3.
 *
 * É apenas um parâmetro de APRESENTAÇÃO: nenhum motor da Camada 1 ou 2 o
 * consome, e alterá-lo recalcula somente os valores em reais.
 */
const KEY = "mc:motor:invested-amount";

export function saveInvestedAmount(value: number | null): void {
  if (typeof window === "undefined") return;
  if (value == null || value <= 0) {
    window.sessionStorage.removeItem(KEY);
    return;
  }
  window.sessionStorage.setItem(KEY, String(value));
}

export function loadInvestedAmount(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}
