import { Button } from "@/components/ui/button";
import { capacityLabelText } from "@/domain/profiling/value-objects/capacity-label";
import type { FinancialCapacityResult } from "@/domain/profiling/types";

import { ScoreBar, StepShell } from "../ProfilingUI";

/**
 * CAPACIDADE FINANCEIRA — Financial Capacity Score (FCS)
 * "Mesmo que essa pessoa goste de risco, ela pode assumir esse risco?"
 */
export function FinancialCapacityStep({
  capacity,
  onNext,
  onBack,
}: {
  capacity: FinancialCapacityResult;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <StepShell
      eyebrow="Etapa 3 · Camada 1"
      title="Capacidade Financeira"
      description="O Financial Capacity Score (FCS) mede quanto risco você realmente pode assumir. Cada variável da Descoberta possui um peso específico."
      footer={
        <>
          <Button onClick={onNext}>Cruzar no Risk Budget</Button>
          <Button variant="ghost" onClick={onBack}>
            Revisar Descoberta
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="max-w-md">
          <ScoreBar
            label="Financial Capacity Score"
            score={capacity.score}
            caption={`Capacidade Financeira → ${capacityLabelText(capacity.label)}`}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Variável</th>
                <th className="px-4 py-2 font-medium">Peso</th>
                <th className="px-4 py-2 font-medium">Nota</th>
                <th className="px-4 py-2 font-medium">Contribuição</th>
                <th className="px-4 py-2 font-medium">Leitura</th>
              </tr>
            </thead>
            <tbody>
              {capacity.breakdown.map((factor) => (
                <tr key={factor.key} className="border-t border-border/60">
                  <td className="px-4 py-2">{factor.label}</td>
                  <td className="px-4 py-2 tabular-nums text-muted-foreground">
                    {factor.weight}%
                  </td>
                  <td className="px-4 py-2 tabular-nums">{factor.rawScore}</td>
                  <td className="px-4 py-2 tabular-nums">
                    {factor.weightedScore.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {factor.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StepShell>
  );
}