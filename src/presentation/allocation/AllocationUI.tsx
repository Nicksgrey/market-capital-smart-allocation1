import type { ReactNode } from "react";

import { Progress } from "@/components/ui/progress";
import type { AllocationStage } from "@/domain/allocation/types";

export const STAGE_LABELS: Record<AllocationStage, string> = {
  policy: "Policy Engine",
  controle_volatilidade: "Controle da Volatilidade",
  optimization: "Optimization Engine",
  allocation: "Allocation Engine",
  validation: "Validation Engine",
};

export function AllocationStepper({
  stages,
  current,
}: {
  stages: AllocationStage[];
  current: AllocationStage;
}) {
  const currentIndex = stages.indexOf(current);
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
      {stages.map((stage, index) => {
        const state =
          index < currentIndex
            ? "done"
            : index === currentIndex
              ? "current"
              : "next";
        return (
          <li key={stage} className="flex items-center gap-2">
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
              {STAGE_LABELS[stage]}
            </span>
            {index < stages.length - 1 ? (
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

export function EnginePanel({
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

export function WeightRow({
  label,
  weight,
  caption,
  emphasis,
}: {
  label: string;
  weight: number;
  caption?: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className={`text-sm ${emphasis ? "font-medium" : ""}`}>
          {label}
        </span>
        <span className="font-display text-sm tabular-nums text-muted-foreground">
          {weight}%
        </span>
      </div>
      <Progress value={Math.min(weight, 100)} className="mt-2 h-2" />
      {caption ? (
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

export function RuleList({
  title,
  items,
}: {
  title: string;
  items: Array<string | ReactNode>;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span aria-hidden className="text-accent">
              •
            </span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}