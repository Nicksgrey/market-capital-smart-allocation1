import { Button } from "@/components/ui/button";
import { capacityLabelText } from "@/domain/profiling/value-objects/capacity-label";
import { riskProfileLabel } from "@/domain/profiling/value-objects/risk-profile";
import { volatilityRangeOf } from "@/domain/profiling/value-objects/volatility";
import type {
  BehavioralResult,
  FinancialCapacityResult,
  RiskBudgetResult,
} from "@/domain/profiling/types";

import { ScoreBar, StepShell } from "../ProfilingUI";

/**
 * RISK BUDGET + PERFIL FINAL
 * Sempre prevalece o menor risco entre comportamental e financeiro.
 */
export function RiskBudgetStep({
  behavioral,
  capacity,
  riskBudget,
  onNext,
  onBack,
}: {
  behavioral: BehavioralResult;
  capacity: FinancialCapacityResult;
  riskBudget: RiskBudgetResult;
  onNext: () => void;
  onBack: () => void;
}) {
  const range = volatilityRangeOf(riskBudget.policyFamily);

  const limitedText =
    riskBudget.limitedBy === "comportamental"
      ? "Você pode assumir mais risco do que deseja: a restrição vem do seu perfil comportamental."
      : riskBudget.limitedBy === "financeira"
        ? "Você deseja mais risco do que pode assumir: a restrição vem da sua capacidade financeira."
        : "Perfil comportamental e capacidade financeira estão equilibrados.";

  return (
    <StepShell
      eyebrow="Etapa 4 · Camada 1"
      title="Risk Budget e Perfil Final"
      description="O sistema cruza quanto risco você suporta psicologicamente com quanto risco você realmente pode assumir. O Perfil Final é sempre o menor dos dois."
      footer={
        <>
          <Button onClick={onNext}>Definir Volatilidade-Alvo</Button>
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <ScoreBar
            label="Perfil Comportamental"
            score={behavioral.score}
            caption={riskProfileLabel(behavioral.profile)}
          />
          <ScoreBar
            label="Capacidade Financeira"
            score={capacity.score}
            caption={capacityLabelText(capacity.label)}
          />
          <ScoreBar
            label="Risk Budget"
            score={riskBudget.riskBudgetScore}
            caption="Menor risco entre os dois indicadores"
          />
        </div>

        <div className="rounded-lg border border-accent/40 bg-accent/5 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Perfil de risco final
          </p>
          <p className="mt-2 font-display text-2xl font-semibold uppercase text-accent">
            {riskProfileLabel(riskBudget.finalProfile)}
          </p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Política de alocação</dt>
              <dd className="font-medium">{range.objective}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Faixa de volatilidade</dt>
              <dd className="font-medium tabular-nums">
                {range.min}% a {range.max}% ao ano
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {limitedText}
          </p>
        </div>
      </div>
    </StepShell>
  );
}