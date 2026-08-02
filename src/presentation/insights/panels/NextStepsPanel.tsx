import { Button } from "@/components/ui/button";
import type {
  EscalationSuggestion,
  NextStep,
  NextStepAction,
} from "@/domain/insights/types";

import { InsightCard } from "../InsightsUI";

/** Módulo 4 da Camada 4 — Próximos Passos / Próximo Passo da Sua Estratégia. */
export function NextStepsPanel({
  steps,
  escalation,
  onAction,
}: {
  steps: NextStep[];
  escalation: EscalationSuggestion;
  onAction: (action: NextStepAction) => void;
}) {
  return (
    <InsightCard
      eyebrow="Módulo 4 · Camada 4"
      title="Próximos Passos"
      description="Transição entre a plataforma educacional e a consultoria personalizada da Market Capital. A plataforma entrega uma metodologia estruturada; algumas decisões dependem de análise individual."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.action}
            className="flex flex-col justify-between gap-3 rounded-lg border border-border/60 p-4"
          >
            <div>
              <p className="text-sm font-medium">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/80">
                Destino: {step.destination}
              </p>
            </div>
            <Button
              variant={
                step.action === "analise_personalizada" ? "default" : "outline"
              }
              onClick={() => onAction(step.action)}
            >
              {step.action === "analise_personalizada"
                ? "Agendar Consultoria Estratégica"
                : "Seguir"}
            </Button>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-accent/40 bg-accent/5 p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-accent">
          Próximo Passo da Sua Estratégia
        </p>
        <p className="mt-3 text-sm leading-relaxed">{escalation.message}</p>

        {escalation.triggers.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Situações identificadas no seu contexto
            </p>
            <ul className="mt-2 space-y-1">
              {escalation.triggers.map((trigger) => (
                <li key={trigger.id} className="text-xs text-muted-foreground">
                  · <span className="text-foreground">{trigger.label}</span> —{" "}
                  {trigger.reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Button className="mt-6" asChild>
          <a href={escalation.ctaUrl} target="_blank" rel="noreferrer">
            {escalation.ctaLabel}
          </a>
        </Button>
      </div>
    </InsightCard>
  );
}