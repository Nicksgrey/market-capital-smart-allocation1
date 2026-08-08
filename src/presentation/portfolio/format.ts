/**
 * Formatação de apresentação (padrão brasileiro).
 * O arredondamento ocorre APENAS na exibição: os percentuais calculados pelo
 * motor continuam sendo a fonte de verdade.
 */
export function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

/** Converte a digitação do usuário (padrão BR) em número. */
export function parseCurrencyInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return Number(digits) / 100;
}

/** Máscara progressiva para o campo "Quanto deseja investir?". */
export function maskCurrencyInput(raw: string): string {
  const value = parseCurrencyInput(raw);
  if (value == null) return "";
  return formatCurrency(value);
}
