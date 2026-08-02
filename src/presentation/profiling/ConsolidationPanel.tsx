import { Button } from "@/components/ui/button";
import { capacityLabelText } from "@/domain/profiling/value-objects/capacity-label";
import { riskProfileLabel } from "@/domain/profiling/value-objects/risk-profile";
import {
  goalText,
  liquidityNeedText,
  reserveText,
} from "@/domain/profiling/engines/profile-diagnosis";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";

import { ScoreBar } from "./ProfilingUI";

/**
 * PAINEL DE CONSOLIDAÇÃO DO PERFIL
 *
 * Tela de transição entre a Camada 1 e a Camada 2. Não calcula nada:
 * apenas consolida e apresenta o que a Camada 1 produziu.
 */
export function ConsolidationPanel({
  consolidation,
  onReview,
  onBuildPortfolio,
  onSave,
  saveState,
}: {
  consolidation: InvestorProfileConsolidation;
  onReview: () => void;
  onBuildPortfolio: () => void;
  onSave: () => void;
  saveState: { status: "idle" | "saving" | "saved" | "error"; message?: string };
}) {
  const { behavioral, financialCapacity, riskBudget, volatility, discovery } =
    consolidation;

  const summary = [
    { label: "Perfil Final", value: riskProfileLabel(riskBudget.finalProfile) },
    {
      label: "Volatilidade Recomendada",
      value: `${volatility.recommended}% ao ano`,
    },
    {
      label: "Volatilidade Escolhida",
      value: `${volatility.selected}% ao ano`,
    },
    {
      label: "Horizonte",
      value:
        discovery.horizonYears != null
          ? `${discovery.horizonYears} anos`
          : "Não informado",
    },
    { label: "Objetivo Principal", value: goalText(discovery.mainGoal) },
    {
      label: "Necessidade de Liquidez",
      value: liquidityNeedText(discovery.liquidityNeed),
    },
    {
      label: "Reserva de Emergência",
      value: reserveText(discovery.emergencyReserve),
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-border/70 bg-card p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">
          Etapa 6 · Camada 1
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold">
          Análise do seu perfil
        </h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <ScoreBar
              label="Perfil Comportamental"
              score={behavioral.score}
              caption={riskProfileLabel(behavioral.profile)}
            />
            <ScoreBar
              label="Capacidade Financeira"
              score={financialCapacity.score}
              caption={capacityLabelText(financialCapacity.label)}
            />
            <ScoreBar
              label="Risk Budget"
              score={riskBudget.riskBudgetScore}
              caption="Sempre prevalece o menor risco"
            />
          </div>

          <div className="rounded-lg border border-accent/40 bg-accent/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Resultado da sua avaliação
            </p>
            <p className="mt-2 font-display text-2xl font-semibold uppercase text-accent">
              {riskProfileLabel(riskBudget.finalProfile)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Volatilidade-alvo de {volatility.selected}% ao ano
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-6">
        <h3 className="font-display text-lg font-semibold">
          Seu perfil foi validado com sucesso
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Sua carteira será construída considerando:
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {summary.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2"
            >
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 rounded-lg bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
          {consolidation.diagnosis}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={onBuildPortfolio}>
            Construir Carteira Estratégica
          </Button>
          <Button variant="outline" onClick={onReview}>
            Revisar meu Perfil
          </Button>
          <Button
            variant="ghost"
            onClick={onSave}
            disabled={saveState.status === "saving"}
          >
            {saveState.status === "saving"
              ? "Salvando..."
              : "Salvar perfilamento"}
          </Button>
        </div>

        {saveState.message ? (
          <p
            className={`mt-3 text-sm ${
              saveState.status === "error"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {saveState.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}