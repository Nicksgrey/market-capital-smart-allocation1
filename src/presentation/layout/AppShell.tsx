import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";

import { ThemeToggle } from "../shared/ThemeToggle";
import logoLight from "@/assets/mc-logo-light.png.asset.json";
import logoDark from "@/assets/mc-logo-dark.png.asset.json";

const modules: Array<{
  label: string;
  to?:
    | "/"
    | "/perfilamento"
    | "/alocacao"
    | "/carteira"
    | "/analise"
    | "/rebalanceamento";
}> = [
  { label: "Visão Geral", to: "/" },
  { label: "Perfil do Investidor", to: "/perfilamento" },
  { label: "Inteligência de Alocação", to: "/alocacao" },
  { label: "Carteira Estratégica", to: "/carteira" },
  { label: "Inteligência Pós-Alocação", to: "/analise" },
  { label: "Rebalanceamento", to: "/rebalanceamento" },
];

function useModuleTitle() {
  const { pathname } = useLocation();
  const titles: Record<string, string> = {
    "/": "Visão Geral do Patrimônio",
    "/perfilamento": "Perfilamento do Investidor",
    "/alocacao": "Inteligência de Alocação",
    "/carteira": "Carteira Estratégica",
    "/analise": "Inteligência Pós-Alocação",
    "/rebalanceamento": "Rebalanceamento de Carteira",
  };
  return titles[pathname] ?? "Motor Inteligente de Alocação Patrimonial";
}

export function AppShell({ children }: { children: ReactNode }) {
  const title = useModuleTitle();
  const isOverview = useLocation().pathname === "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl gap-0 px-0 py-0 lg:gap-8 lg:px-6 lg:py-8">
        <aside className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
          <div className="p-8">
            <Link to="/" className="block">
              <img
                src={logoLight.url}
                alt="Market Capital Consultoria"
                className="h-10 w-auto object-contain dark:hidden"
              />
              <img
                src={logoDark.url}
                alt="Market Capital Consultoria"
                className="hidden h-10 w-auto object-contain dark:block"
              />
            </Link>
          </div>

          <nav aria-label="Módulos" className="mt-2 px-6">
            <ul className="space-y-2">
              {modules.map((m) => (
                <li key={m.label}>
                  {m.to ? (
                    <Link
                      to={m.to}
                      className="flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      activeOptions={{ exact: true }}
                      activeProps={{
                        className:
                          "flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-primary bg-primary/10 border border-primary/20",
                      }}
                    >
                      {m.label}
                    </Link>
                  ) : (
                    <span className="flex cursor-not-allowed items-center gap-3 rounded-xl px-5 py-3.5 text-sm text-muted-foreground/40">
                      {m.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-8">
            <div className="flex items-center gap-3 border-t border-border pt-6">
              <div className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-secondary text-xs font-bold">
                IP
              </div>
              <div>
                <p className="text-xs font-bold">Investidor Iniciante</p>
                <p className="text-[10px] font-black tracking-widest text-primary uppercase">
                  Plano PRO
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-20 items-center justify-between border-b border-border px-6 backdrop-blur-md bg-background/80">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                {isOverview ? "Performance Realtime" : "Market Capital"}
              </p>
              <h1 className="font-display text-xl font-extrabold tracking-tight">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                Estrutura inicial
              </span>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
