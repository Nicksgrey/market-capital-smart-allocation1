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

const layers = [
  {
    name: "Domínio",
    path: "src/domain",
    detail: "Entidades, value objects e contratos de repositório, sem framework.",
  },
  {
    name: "Aplicação",
    path: "src/application",
    detail: "Casos de uso e orquestração; depende apenas do domínio.",
  },
  {
    name: "Infraestrutura",
    path: "src/infrastructure",
    detail: "Supabase existente da Market Capital, storage e integrações.",
  },
  {
    name: "Apresentação",
    path: "src/presentation",
    detail: "Componentes, layouts e view-models consumidos pelas rotas.",
  },
];

function Index() {
  return (
    <AppShell>
      <section className="rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-panel)]">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          Fase 1 — Fundação
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Motor Inteligente de Alocação Patrimonial
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Projeto criado apenas com a arquitetura base, sem regras de negócio.
          As camadas abaixo já estão preparadas para receber a documentação
          funcional e as novas tabelas no projeto Supabase existente.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {layers.map((layer) => (
          <article
            key={layer.path}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h2 className="font-display text-base font-semibold">{layer.name}</h2>
            <code className="mt-1 block text-xs text-accent">{layer.path}</code>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {layer.detail}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-dashed border-border p-5">
        <h2 className="font-display text-base font-semibold">
          Integração Supabase conectada
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Projeto vinculado ao Supabase existente da Market Capital:
          <code className="text-accent"> wfafvpsixaotzegvvwkx</code>. Auth,
          banco de dados e storage já apontam para esse projeto. Nenhum banco
          novo foi criado e nenhuma tabela, política ou função existente foi
          alterada.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A camada <code className="text-accent">src/infrastructure/supabase</code>
          foi criada com clientes browser/server, repositório base e verificação
          de saúde. As novas tabelas do Motor de Alocação serão criadas
          exclusivamente neste mesmo projeto.
        </p>
      </section>
    </AppShell>
  );
}
