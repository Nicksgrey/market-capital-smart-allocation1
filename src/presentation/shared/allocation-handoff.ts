/**
 * Handoff entre a Camada 2 e a Camada 3.
 *
 * Guarda apenas a volatilidade aprovada pelo Motor de Controle da
 * Volatilidade, de modo que a Camada 3 reconstrua a carteira pelos motores
 * oficiais em vez de transportar resultados calculados.
 */
const KEY = "mc:motor:allocation-handoff";

export interface AllocationHandoff {
  requestedVolatility: number;
  educationalSimulation: boolean;
}

export function saveAllocationHandoff(handoff: AllocationHandoff): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(handoff));
}

export function loadAllocationHandoff(): AllocationHandoff | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AllocationHandoff;
  } catch {
    return null;
  }
}

export function clearAllocationHandoff(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}