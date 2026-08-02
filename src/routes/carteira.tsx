import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/presentation/layout/AppShell";
import { PortfolioView } from "@/presentation/portfolio/PortfolioView";

const title = "Carteira Estratégica | Motor Inteligente de Alocação";
const description =
  "Camada 3 do Motor Inteligente de Alocação Patrimonial: apresentação da carteira aprovada em três níveis — Macro, Meso e Micro.";

export const Route = createFileRoute("/carteira")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Camada 3
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Carteira Estratégica
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Macro → Meso → Micro. Esta camada não calcula nada: recebe a
            carteira aprovada pelo Validation Engine e organiza a visualização.
          </p>
        </header>

        <PortfolioView
          onBackToAllocation={() => {
            void navigate({ to: "/alocacao" });
          }}
          onAnalyze={() => {
            void navigate({ to: "/analise" });
          }}
        />
      </div>
    </AppShell>
  );
}