import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/presentation/layout/AppShell";

const title = "Motor Inteligente de Alocação Patrimonial | Market Capital";
const description =
  "Estrutura inicial do Motor Inteligente de Alocação Patrimonial da Market Capital, organizado em camadas de domínio, aplicação, infraestrutura e apresentação.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          Market Capital
        </p>
        <h1 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Motor Inteligente de Alocação Patrimonial
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Estrutura inicial preparada. Aguardando a documentação funcional para
          iniciar a construção em etapas.
        </p>
      </div>
    </AppShell>
  );
}
