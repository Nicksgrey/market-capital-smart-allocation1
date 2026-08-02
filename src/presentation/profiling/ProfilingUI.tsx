import type { ReactNode } from "react";

import { Progress } from "@/components/ui/progress";
import type { ProfilingStep } from "@/domain/profiling/types";

export const STEP_LABELS: Record<ProfilingStep, string> = {
  suitability: "Suitability",
  descoberta: "Descoberta do Investidor",
  capacidade_financeira: "Capacidade Financeira",
  risk_budget: "Risk Budget",
  volatilidade_alvo: "Volatilidade-Alvo",
  consolidacao: "Painel de Consolidação",
};

export function ProfilingStepper({
  steps,
  current,
}: {
  steps: ProfilingStep[];
  current: ProfilingStep;
}) {
  const currentIndex = steps.indexOf(current);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
      {steps.map((step, index) => {
        const state =
          index < currentIndex
            ? "done"
            : index === currentIndex
              ? "current"
              : "next";
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
                state === "current"
                  ? "border-accent bg-accent/10 font-medium text-accent"
                  : state === "done"
                    ? "border-border text-foreground"
                    : "border-border/60 text-muted-foreground"
              }`}
            >
              <span className="tabular-nums">{index + 1}</span>
              {STEP_LABELS[step]}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden className="text-muted-foreground">
                ›
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function StepShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/70 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-6">{children}</div>
      {footer ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">{footer}</div>
      ) : null}
    </section>
  );
}

export function ScoreBar({
  label,
  score,
  caption,
}: {
  label: string;
  score: number;
  caption?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-display text-sm tabular-nums text-muted-foreground">
          {score}/100
        </span>
      </div>
      <Progress value={score} className="mt-2 h-2" />
      {caption ? (
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}