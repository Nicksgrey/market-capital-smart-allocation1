import { Button } from "@/components/ui/button";
import type { NextStepAction } from "@/domain/insights/types";

import { InsightsStepper } from "./InsightsUI";
import { DiagnosticPanel } from "./panels/DiagnosticPanel";
import { NextStepsPanel } from "./panels/NextStepsPanel";
import { StressTestPanel } from "./panels/StressTestPanel";
import { useInsightsFlow } from "./useInsightsFlow";

/**
 * CAMADA 4 — INTELIGÊNCIA PÓS-ALOCAÇÃO.
 * Diagnóstico Inteligente → Stress Test → Próximos Passos.
 */
export function InsightsView({
  onBackToPortfolio,
  onNextStep,
}: {
  onBackToPortfolio: () => void;
  onNextStep: (action: NextStepAction) => void;
}) {
  const flow = useInsightsFlow();

  if (!flow.hydrated) {
    return <p className="text-sm text-muted-foreground">Carregando sua análise…</p>;
  }

  if (!flow.profile || !flow.portfolio || !flow.analysis) {
    return (
      <section className="rounded-xl border border-border/60 bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Nenhuma carteira aprovada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A Inteligência Pós-Alocação consome exclusivamente a carteira aprovada pelo Validation
          Engine. Conclua a Camada 3 para analisar sua carteira.
        </p>
        <Button className="mt-5" variant="outline" onClick={onBackToPortfolio}>
          Voltar para a Carteira Estratégica
        </Button>
      </section>
    );
  }

  const { analysis } = flow;

  return (
    <div className="space-y-6">
      <InsightsStepper stages={flow.stages} current={flow.stage} onSelect={flow.setStage} />

      {flow.stage === "diagnostico" ? <DiagnosticPanel report={analysis.diagnostic} /> : null}

      {flow.stage === "stress_test" ? <StressTestPanel report={analysis.stressTest} /> : null}

      {flow.stage === "proximos_passos" ? (
        <NextStepsPanel
          steps={analysis.nextSteps}
          escalation={analysis.escalation}
          onAction={onNextStep}
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={flow.isFirstStage ? onBackToPortfolio : flow.goBack}>
          {flow.isFirstStage ? "Voltar para a Carteira" : "Voltar"}
        </Button>
        {!flow.isLastStage ? <Button onClick={flow.goNext}>Avançar</Button> : null}
      </div>
    </div>
  );
}
