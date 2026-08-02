import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  MACRO_CLASS_LABEL,
  MACRO_CLASS_ORDER,
  type MacroClass,
} from "@/domain/allocation/types";
import type { VolatilitySimulationOutput } from "@/application/allocation/dto/strategic-portfolio.dto";

/**
 * "Simular outra volatilidade" — modo de comparação. NÃO altera a carteira
 * oficial recomendada pelo Motor Inteligente de Alocação.
 */
export function VolatilitySimulationPanel({
  value,
  onChange,
  simulation,
  onClose,
}: {
  value: number;
  onChange: (value: number) => void;
  simulation: VolatilitySimulationOutput | null;
  onClose: () => void;
}) {
  const recommended = simulation?.recommended ?? null;
  const simulated = simulation?.simulated ?? null;

  return (
    <section className="rounded-xl border border-border/70 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        Modo comparação
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">
        Simular outra volatilidade
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Compare a carteira recomendada com uma carteira simulada. A carteira
        oficial permanece inalterada.
      </p>

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium" htmlFor="vol-sim">
            Volatilidade simulada
          </label>
          <span className="font-display text-sm tabular-nums text-muted-foreground">
            {value}% ao ano
          </span>
        </div>
        <Slider
          id="vol-sim"
          className="mt-4"
          min={2}
          max={18}
          step={1}
          value={[value]}
          onValueChange={(values) => {
            const next = values[0];
            if (next != null) onChange(next);
          }}
        />
      </div>

      {recommended ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <th className="pb-2">Classe</th>
                <th className="pb-2 text-right">
                  Recomendada ({recommended.optimization.targetVolatility}%)
                </th>
                <th className="pb-2 text-right">
                  Simulada
                  {simulated
                    ? ` (${simulated.optimization.targetVolatility}%)`
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {MACRO_CLASS_ORDER.filter(
                (macro: MacroClass) =>
                  recommended.optimization.weights[macro] > 0 ||
                  (simulated?.optimization.weights[macro] ?? 0) > 0,
              ).map((macro) => (
                <tr key={macro} className="border-t border-border/50">
                  <td className="py-2 text-muted-foreground">
                    {MACRO_CLASS_LABEL[macro]}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {recommended.optimization.weights[macro]}%
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {simulated ? `${simulated.optimization.weights[macro]}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {simulation && !simulated ? (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          A volatilidade simulada é incompatível com os dados do seu perfil e não
          pode ser calculada nem para fins educacionais.
        </p>
      ) : null}

      {simulation ? (
        <p className="mt-4 rounded-lg bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
          {simulation.disclaimer}
        </p>
      ) : null}

      <div className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Fechar comparação
        </Button>
      </div>
    </section>
  );
}