import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Calculator,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { AppShell } from "@/presentation/layout/AppShell";
import { Button } from "@/components/ui/button";

const title = "Rebalanceamento de Carteira | Market Capital";
const description =
  "Rebalanceamento com a Regra 5/25 de Larry Swedroe: venda o que subiu demais, compre o que ficou barato e mantenha a proporção correta da carteira com aportes calculados automaticamente.";

const REBALANCE_APP_URL = "https://five-twenty-five-flow.lovable.app/auth";

export const Route = createFileRoute("/rebalanceamento")({
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
  component: RebalancePage,
});

const pillars = [
  {
    icon: Target,
    title: "Regra 5/25 (Larry Swedroe)",
    text: "Tolerância de ±5% para classes de ativos e ±25% relativo para ativos individuais. Você rebalanceia quando faz sentido — não por impulso nem por calendário.",
  },
  {
    icon: ArrowLeftRight,
    title: "Vender o que está caro, comprar o que está barato",
    text: "O movimento mais lógico do mercado é também o mais difícil de executar. O rebalanceamento transforma essa decisão emocional em uma regra objetiva.",
  },
  {
    icon: Calculator,
    title: "Aporte automatizado por ativo",
    text: "Informe o valor do aporte e a plataforma calcula exatamente quanto investir em cada ativo para restaurar a proporção-alvo do patrimônio.",
  },
  {
    icon: LineChart,
    title: "Cotações e múltiplas classes",
    text: "FIIs, Ações BR, ETFs BR, Ações Exterior e ETFs Exterior em um só lugar, com cotação atualizada — sem planilhas manuais e desatualizadas.",
  },
];

function RebalancePage() {
  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <header>
          <p className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">
            Disciplina de longo prazo
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Rebalanceamento de Carteira
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Rebalancear é devolver a carteira à proporção definida na sua
            estratégia. Com o tempo, o que sobe demais aumenta o risco da
            carteira sem você perceber — e o que caiu deixa de contribuir para o
            retorno futuro. O rebalanceamento corrige isso de forma
            metodológica, controlando risco e capturando o prêmio da
            reversão entre classes de ativos.
          </p>
        </header>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">
                  Plataforma exclusiva
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold">
                  Rebalanceie com Método, Não com Planilha
                </h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Não existe nada igual no Brasil: cotação automática, Regra
                  5/25 aplicada por classe e por ativo, e o cálculo exato do
                  aporte para manter a proporção do seu patrimônio.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a
                href={REBALANCE_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar Conteúdo
              </a>
            </Button>
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-display text-lg font-bold tracking-tight">
            Por que isso muda o resultado da sua carteira
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                    <p.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold">{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sem rebalanceamento, até investidores experientes acabam com
              carteiras muito mais arriscadas do que planejaram — normalmente
              controladas em planilhas manuais, sem cotação automática e sem o
              cálculo correto de proporção. O rebalanceamento é a base sólida
              das decisões: menos improviso, mais consistência ao longo dos anos.
            </p>
          </div>
          <div className="mt-6">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a
                href={REBALANCE_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar Conteúdo
              </a>
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
