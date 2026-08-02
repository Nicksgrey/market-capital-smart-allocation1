import type { ReactNode } from "react";

const modules = [
  { label: "Visão Geral", active: true },
  { label: "Perfil do Investidor", active: false },
  { label: "Classes de Ativos", active: false },
  { label: "Carteiras Modelo", active: false },
  { label: "Alocação Sugerida", active: false },
  { label: "Rebalanceamento", active: false },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-accent font-display text-sm font-semibold text-accent-foreground">
              MC
            </span>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Market Capital
              </p>
              <p className="font-display text-sm font-semibold">
                Motor Inteligente de Alocação Patrimonial
              </p>
            </div>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Estrutura inicial
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <nav aria-label="Módulos" className="hidden w-60 shrink-0 lg:block">
          <ul className="space-y-1">
            {modules.map((m) => (
              <li key={m.label}>
                <span
                  className={`block rounded-md px-3 py-2 text-sm ${
                    m.active
                      ? "bg-secondary font-medium text-secondary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}