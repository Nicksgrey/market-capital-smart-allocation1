import { Button } from "@/components/ui/button";

import { AllocationStepper } from "./AllocationUI";
import { PolicyPanel } from "./panels/PolicyPanel";
import { VolatilityControlPanel } from "./panels/VolatilityControlPanel";
import { OptimizationPanel } from "./panels/OptimizationPanel";
import { AllocationTreePanel } from "./panels/AllocationTreePanel";
import { ValidationPanel } from "./panels/ValidationPanel";
import { VolatilitySimulationPanel } from "./panels/VolatilitySimulationPanel";
import { useAllocationFlow } from "./useAllocationFlow";

/**
 * CAMADA 2 — INTELIGÊNCIA DE ALOCAÇÃO (Motor Paramétrico)
 * Sequência oficial: Policy Engine → Controle da Volatilidade →
 * Optimization Engine → Allocation Engine → Validation Engine.
 */
export function AllocationFlow({
  onReviewProfile,
  onGeneratePortfolio,
  portfolioMessage,
}: {
  onReviewProfile: () => void;
  onGeneratePortfolio: () => void;
  portfolioMessage?: string;
}) {
  const flow = useAllocationFlow();

  if (!flow.hydrated) {
    return (
      <p className="text-sm text-muted-foreground">
        Carregando os motores de alocação...
      </p>
    );
  }

  if (!flow.profile) {
    return (
      <section className="rounded-xl border border-border/70 bg-card p-6">
        <h2 className="font-display text-lg font-semibold">
          Perfilamento necessário
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A Camada 2 depende integralmente do Perfil Final e do Risk Budget
          gerados na Camada 1. Conclua o perfilamento para liberar o Motor
          Paramétrico.
        </p>
        <div className="mt-6">
          <Button onClick={onReviewProfile}>Ir para o Perfilamento</Button>
        </div>
      </section>
    );
  }

  const { policy, volatilityControl, portfolio } = flow;

  return (
    <div className="space-y-6">
      <AllocationStepper stages={flow.stages} current={flow.stage} />

      {flow.stage === "policy" && policy ? (
        <PolicyPanel policy={policy} onNext={flow.goNext} />
      ) : null}

      {flow.stage === "controle_volatilidade" && volatilityControl ? (
        <VolatilityControlPanel
          decision={volatilityControl}
          requestedVolatility={
            flow.requestedVolatility ?? volatilityControl.requestedVolatility
          }
          onRequestVolatility={flow.setRequestedVolatility}
          onResetToRecommended={flow.resetVolatility}
          onEnableEducational={flow.enableEducationalSimulation}
          onReviewProfile={onReviewProfile}
          onNext={flow.goNext}
          onBack={flow.goBack}
        />
      ) : null}

      {flow.blocked && flow.stage !== "controle_volatilidade" ? (
        <section className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
          <h2 className="font-display text-lg font-semibold text-destructive">
            Carteira não calculada
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-destructive">
            {volatilityControl?.message}
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => flow.goTo("controle_volatilidade")}
            >
              Rever o controle de volatilidade
            </Button>
          </div>
        </section>
      ) : null}

      {flow.stage === "optimization" && portfolio ? (
        <OptimizationPanel
          optimization={portfolio.optimization}
          onNext={flow.goNext}
          onBack={flow.goBack}
        />
      ) : null}

      {flow.stage === "allocation" && portfolio ? (
        <AllocationTreePanel
          structure={portfolio.structure}
          onNext={flow.goNext}
          onBack={flow.goBack}
        />
      ) : null}

      {flow.stage === "validation" && portfolio ? (
        <ValidationPanel
          validation={portfolio.validation}
          educationalOnly={portfolio.educationalOnly}
          onGeneratePortfolio={onGeneratePortfolio}
          onSimulateOtherVolatility={() =>
            flow.setSimulatedVolatility(
              flow.profile?.volatility.recommended ?? 8,
            )
          }
          onBack={flow.goBack}
          {...(portfolioMessage ? { message: portfolioMessage } : {})}
        />
      ) : null}

      {flow.simulatedVolatility != null ? (
        <VolatilitySimulationPanel
          value={flow.simulatedVolatility}
          onChange={flow.setSimulatedVolatility}
          simulation={flow.simulation}
          onClose={() => flow.setSimulatedVolatility(null)}
        />
      ) : null}
    </div>
  );
}