import { Button } from "@/components/ui/button";
import {
  MACRO_CLASS_LABEL,
  MACRO_CLASS_ORDER,
  type OptimizationResult,
} from "@/domain/allocation/types";

import { EnginePanel, RuleList, WeightRow } from "../AllocationUI";

/** OPTIMIZATION ENGINE — cálculo dos pesos. */
export function OptimizationPanel({
  optimization,
  onNext,
  onBack,
}: {
  optimization: OptimizationResult;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <EnginePanel
      eyebrow="Etapa 3 · Camada 2"
      title="Optimization Engine — cálculo dos pesos"
      description="Com a volatilidade aprovada, o motor responde qual deve ser exatamente a carteira. Os pesos não vêm da SAA: a SAA apenas delimita as faixas permitidas."
      footer={
        <>
          <Button onClick={onNext}>Avançar para o Allocation Engine</Button>
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Volatilidade-alvo utilizada no cálculo:{" "}
          <span className="font-medium text-foreground">
            {optimization.targetVolatility}% ao ano
          </span>
        </p>

        <div className="space-y-4">
          {MACRO_CLASS_ORDER.filter(
            (macro) => optimization.weights[macro] > 0,
          ).map((macro) => {
            const band = optimization.bands[macro];
            return (
              <WeightRow
                key={macro}
                label={MACRO_CLASS_LABEL[macro]}
                weight={optimization.weights[macro]}
                emphasis
                {...(band
                  ? { caption: `Faixa SAA: ${band.min}% – ${band.max}%` }
                  : {})}
              />
            );
          })}
        </div>

        <RuleList
          title="Fatores considerados no cálculo"
          items={optimization.factors.map(
            (factor) => `${factor.label}: ${factor.detail}`,
          )}
        />
      </div>
    </EnginePanel>
  );
}