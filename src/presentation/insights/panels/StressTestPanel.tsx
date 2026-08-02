import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { StressTestReport } from "@/domain/insights/types";

import { DirectionBadge, EducationalNotice, InsightCard } from "../InsightsUI";

/** Módulo 2 da Camada 4 — Stress Test. */
export function StressTestPanel({ report }: { report: StressTestReport }) {
  const first = report.results[0];
  const [selected, setSelected] = useState<string>(first ? first.id : "");
  const current =
    report.results.find((result) => result.id === selected) ?? first;

  return (
    <InsightCard
      eyebrow="Módulo 2 · Camada 4"
      title="Stress Test"
      description="Como essa carteira provavelmente teria se comportado em determinados cenários históricos. O módulo não muda a carteira e possui finalidade exclusivamente educacional."
    >
      <div className="flex flex-wrap gap-2">
        {report.results.map((result) => (
          <button
            key={result.id}
            type="button"
            aria-pressed={result.id === current?.id}
            onClick={() => setSelected(result.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              result.id === current?.id
                ? "border-accent bg-accent/10 font-medium text-accent"
                : "border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {result.label}
          </button>
        ))}
      </div>

      {current ? (
        <div className="space-y-4 rounded-lg border border-border/60 p-5">
          <div>
            <p className="font-display text-lg font-semibold">
              {current.label}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {current.period}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {current.context}
            </p>
          </div>

          <ul className="space-y-2">
            {current.classImpacts.map((impact) => (
              <li
                key={impact.macro}
                className="flex items-center justify-between gap-4 border-b border-border/40 pb-2 text-sm last:border-0"
              >
                <span>
                  {impact.label}
                  <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                    {impact.weight}% da carteira
                  </span>
                </span>
                <DirectionBadge direction={impact.direction} />
              </li>
            ))}
          </ul>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Classes que tenderiam a sofrer mais
              </p>
              <p className="mt-1 text-sm">
                {current.mostAffected.length
                  ? current.mostAffected.join(", ")
                  : "Nenhuma classe com pressão negativa relevante."}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Classes que tenderiam a proteger o patrimônio
              </p>
              <p className="mt-1 text-sm">
                {current.protectors.length
                  ? current.protectors.join(", ")
                  : "Nenhuma classe com comportamento protetivo neste cenário."}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Resultado
            </p>
            <p className="mt-1 text-sm leading-relaxed">{current.reading}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Principais aprendizados
            </p>
            <ul className="mt-2 space-y-1">
              {current.learnings.map((learning) => (
                <li key={learning} className="text-sm text-muted-foreground">
                  · {learning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-accent">
          Resiliência nos cenários simulados
        </p>
        <p className="mt-1 font-display text-lg font-semibold capitalize">
          {report.resilience}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{report.summary}</p>
      </div>

      <EducationalNotice>
        Os comportamentos apresentados são referências educacionais de como cada
        classe tende a reagir em ambientes de mercado semelhantes. Não são
        projeções de rentabilidade e resultados passados não garantem resultados
        futuros.
      </EducationalNotice>

      <div className="hidden">
        <Button variant="outline">placeholder</Button>
      </div>
    </InsightCard>
  );
}