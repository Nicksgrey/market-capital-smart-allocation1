import type { DiagnosticReport } from "@/domain/insights/types";

import { InsightCard, ScoreDial } from "../InsightsUI";

/** Módulo 1 da Camada 4 — Diagnóstico Inteligente. */
export function DiagnosticPanel({ report }: { report: DiagnosticReport }) {
  return (
    <InsightCard
      eyebrow="Módulo 1 · Camada 4"
      title="Diagnóstico Inteligente"
      description="Leitura completa da carteira construída, comparada contra todas as políticas utilizadas pelo Motor Paramétrico. Este módulo não altera a alocação."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <ScoreDial score={report.overallScore} label="Pontuação Geral" />
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Pontos Fortes
          </p>
          <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-accent">
            {report.strengths.length}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Pontos de Atenção
          </p>
          <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
            {report.attentionPoints.length}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {report.summary}
      </p>

      <ul className="space-y-3">
        {report.findings.map((finding) => (
          <li
            key={finding.dimension}
            className="rounded-lg border border-border/60 p-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium">
                <span
                  aria-hidden
                  className={
                    finding.status === "forte" ? "text-accent" : "text-foreground"
                  }
                >
                  {finding.status === "forte" ? "✔" : "⚠"}
                </span>{" "}
                {finding.headline}
              </p>
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {finding.label}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {finding.detail}
            </p>
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}