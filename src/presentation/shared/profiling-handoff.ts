import type { DiscoveryAnswers } from "@/domain/profiling/types";

/**
 * Handoff entre a Camada 1 e a Camada 2.
 *
 * Guarda apenas as ENTRADAS do perfilamento (nunca os resultados calculados),
 * de modo que a Camada 2 recalcule a consolidação pelo domínio. Persistência
 * definitiva por usuário permanece nas tabelas da Camada 1.
 */
const KEY = "mc:motor:profiling-handoff";

export interface ProfilingHandoff {
  behavioralScore: number;
  discovery: DiscoveryAnswers;
  selectedVolatility: number;
}

export function saveProfilingHandoff(handoff: ProfilingHandoff): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(handoff));
}

export function loadProfilingHandoff(): ProfilingHandoff | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProfilingHandoff;
  } catch {
    return null;
  }
}

export function clearProfilingHandoff(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}