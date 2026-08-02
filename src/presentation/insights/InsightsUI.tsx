import { Progress } from "@/components/ui/progress";
import {
  INSIGHT_STAGE_LABEL,
  STRESS_DIRECTION_ARROW,
  type InsightStage,
  type StressDirection,
} from "@/domain/insights/types";

export function InsightsStepper({
  stages,
  current,
  onSelect,
}: {
  stages: InsightStage[];
  current: InsightStage;
  onSelect: (stage: InsightStage) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Módulos da Inteligência Pós-Alocação"
      className="flex flex-wrap gap-2"
    >
      {stages.map((stage, index) => (
        <button
          key={stage}
          type="button"
          role="tab"
          aria-selected={stage === current}
          onClick={() => onSelect(stage)}
          className={`rounded-full border px-4 py-1.5 text-xs transition ${
            stage === current
              ? "border-accent bg-accent/10 font-medium text-accent"
              : "border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="tabular-nums">{index + 1}</span>{" "}
          {INSIGHT_STAGE_LABEL[stage]}
        </button>
      ))}
    </div>
  );
}

export function InsightCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

export function ScoreDial({ score, label }: { score: number; label: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
        {score}
        <span className="text-base text-muted-foreground">/100</span>
      </p>
      <Progress value={score} className="mt-3 h-2" />
    </div>
  );
}

export function DirectionBadge({ direction }: { direction: StressDirection }) {
  const tone =
    direction === "forte_queda" || direction === "queda"
      ? "text-destructive"
      : direction === "neutro"
        ? "text-muted-foreground"
        : "text-accent";
  return (
    <span className={`font-display text-sm tabular-nums ${tone}`}>
      {STRESS_DIRECTION_ARROW[direction]}
    </span>
  );
}

export function EducationalNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border/70 bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}