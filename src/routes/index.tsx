import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/presentation/layout/AppShell";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Globe, Zap, Lock } from "lucide-react";

const title = "Visão Geral do Patrimônio | Market Capital";
const description =
  "Dashboard inicial do Motor Inteligente de Alocação Patrimonial da Market Capital. Acompanhe a evolução do patrimônio, alocação estratégica e ações recomendadas.";

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

const allocationCards = [
  {
    icon: TrendingUp,
    label: "Renda Variável",
    value: "R$ 737.000,00",
    percent: "40%",
    color: "bg-primary",
  },
  {
    icon: Shield,
    label: "Renda Fixa",
    value: "R$ 460.625,00",
    percent: "25%",
    color: "bg-chart-2",
  },
  {
    icon: Globe,
    label: "Global",
    value: "R$ 368.500,00",
    percent: "20%",
    color: "bg-chart-5",
  },
  {
    icon: Zap,
    label: "Oportunidades",
    value: "R$ 276.375,00",
    percent: "15%",
    color: "bg-chart-4",
  },
];

function WealthChart() {
  const bars = [
    { label: "Jan", value: 42 },
    { label: "Fev", value: 58 },
    { label: "Mar", value: 51 },
    { label: "Abr", value: 69 },
    { label: "Mai", value: 64 },
    { label: "Jun", value: 78 },
    { label: "Jul", value: 92 },
    { label: "Ago", value: 88 },
    { label: "Set", value: 100 },
  ];
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <div className="h-48 w-full">
      <svg viewBox="0 0 100 48" className="h-full w-full overflow-visible">
        {bars.map((bar, i) => {
          const x = (i / bars.length) * 100 + 100 / bars.length / 2;
          const width = 6;
          const height = (bar.value / max) * 38;
          const y = 46 - height;
          return (
            <g key={bar.label}>
              <rect
                x={x - width / 2}
                y={y}
                width={width}
                height={height}
                rx="2"
                className="fill-primary/80"
              />
              <text
                x={x}
                y="45"
                textAnchor="middle"
                className="fill-muted-foreground text-[3.5px] font-medium"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RiskGauge() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative flex size-32 items-center justify-center rounded-full border-8 border-primary/20">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="220"
            strokeDashoffset="120"
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
        <div className="text-center">
          <p className="font-display text-2xl font-extrabold text-foreground">
            12%
          </p>
          <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Volatilidade
          </p>
        </div>
      </div>
      <p className="mt-4 text-center text-xs font-medium text-muted-foreground">
        Risco do Motor: <span className="text-primary">Moderado</span>
      </p>
    </div>
  );
}

function Index() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-1 flex flex-col justify-between rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">
                Patrimônio Total
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                R$ 1.842.500,00
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-primary">+8,4%</span> no último trimestre
              </p>
            </div>
            <div className="mt-6">
              <WealthChart />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <RiskGauge />
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Lock className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">
                  Investidor PRO
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold">
                  Libere Análises Exclusivas
                </h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Acesse relatórios avançados, cenários de stress test e
                  recomendações personalizadas do motor de alocação.
                </p>
              </div>
            </div>
            <Button
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                // TODO: configurar destino quando a página de assinatura estiver pronta
              }}
            >
              Acessar Conteúdo
            </Button>
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-display text-lg font-bold tracking-tight">
            Alocação por Classe de Ativo
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allocationCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`grid size-10 place-items-center rounded-xl ${card.color} text-primary-foreground`}>
                    <card.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {card.label}
                    </p>
                    <p className="font-display text-lg font-extrabold">
                      {card.value}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-1.5 flex-1 rounded-full bg-muted">
                    <div
                      className={`h-1.5 rounded-full ${card.color}`}
                      style={{ width: card.percent }}
                    />
                  </div>
                  <span className="ml-3 text-xs font-bold text-primary">
                    {card.percent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              Iniciar jornada de alocação
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece pelo perfilamento para construir uma carteira alinhada ao
              seu perfil.
            </p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/perfilamento">Iniciar Perfilamento</Link>
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
