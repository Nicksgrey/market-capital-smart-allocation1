import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/presentation/layout/AppShell";
import { AllocationFlow } from "@/presentation/allocation/AllocationFlow";

const title = "Inteligência de Alocação | Motor Inteligente de Alocação";
const description =
  "Camada 2 do Motor Inteligente de Alocação Patrimonial: Policy Engine, controle da volatilidade, optimization engine, allocation engine e validation engine.";

export const Route = createFileRoute("/alocacao")({
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
  component: AllocationPage,
});

function AllocationPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | undefined>(undefined);

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Camada 2
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Inteligência de Alocação
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Policy Engine → Controle da Volatilidade → Optimization Engine →
            Allocation Engine → Validation Engine.
          </p>
        </header>

        <AllocationFlow
          onReviewProfile={() => navigate({ to: "/perfilamento" })}
          onGeneratePortfolio={() =>
            setMessage(
              "A Camada 3 — Construção da Carteira — será habilitada na próxima etapa do projeto.",
            )
          }
          {...(message ? { portfolioMessage: message } : {})}
        />
      </div>
    </AppShell>
  );
}