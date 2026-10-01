import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CONSULTING_SCHEDULING_URL } from "@/domain/insights/types";
import { InsightsView } from "@/presentation/insights/InsightsView";
import { AppShell } from "@/presentation/layout/AppShell";

const title = "Inteligência Pós-Alocação | Motor Inteligente de Alocação";
const description =
  "Camada 4 do Motor Inteligente de Alocação Patrimonial: diagnóstico inteligente, stress test histórico e próximos passos da estratégia.";

export const Route = createFileRoute("/analise")({
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
  component: InsightsPage,
});

function InsightsPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Camada 4
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Inteligência Pós-Alocação
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Interpretar, explicar, testar e educar sobre a carteira gerada. Esta
            camada não altera a alocação: consome apenas a carteira aprovada
            pelo Validation Engine.
          </p>
        </header>

        <InsightsView
          onBackToPortfolio={() => {
            void navigate({ to: "/carteira" });
          }}
          onNextStep={(action) => {
            if (
              action === "revisar_carteira" ||
              action === "alterar_volatilidade"
            ) {
              void navigate({ to: "/perfilamento" });
              return;
            }
            if (action === "gerar_outra_estrategia") {
              void navigate({ to: "/alocacao" });
              return;
            }
            window.open(CONSULTING_SCHEDULING_URL, "_blank", "noreferrer");
          }}
        />
      </div>
    </AppShell>
  );
}