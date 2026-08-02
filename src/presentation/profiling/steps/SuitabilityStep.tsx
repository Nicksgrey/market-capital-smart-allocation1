import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  RISK_PROFILE_BANDS,
  classifyRiskProfile,
  riskProfileLabel,
} from "@/domain/profiling/value-objects/risk-profile";

import { StepShell } from "../ProfilingUI";

/**
 * SUITABILITY / PERFIL COMPORTAMENTAL
 *
 * O investidor informa o resultado do suitability realizado no site da
 * Market Capital. A classificação segue as bandas oficiais.
 */
export function SuitabilityStep({
  score,
  onChange,
  onNext,
}: {
  score: number | null;
  onChange: (score: number | null) => void;
  onNext: () => void;
}) {
  const profile = score != null ? classifyRiskProfile(score) : null;

  return (
    <StepShell
      eyebrow="Etapa 1 · Camada 1"
      title="Suitability e Perfil Comportamental"
      description="Informe a pontuação obtida no suitability realizado no site da Market Capital. Este score representa quanto risco você suporta psicologicamente."
      footer={
        <Button onClick={onNext} disabled={score == null}>
          Continuar para a Descoberta
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          <Label htmlFor="behavioral-score">Score do suitability (0–100)</Label>
          <Input
            id="behavioral-score"
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            value={score ?? ""}
            onChange={(e) =>
              onChange(e.target.value === "" ? null : Number(e.target.value))
            }
          />
          {profile ? (
            <p className="text-sm text-muted-foreground">
              Classificação:{" "}
              <span className="font-medium text-foreground">
                {riskProfileLabel(profile)}
              </span>
            </p>
          ) : null}
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">
            Ou selecione a faixa informada no resultado
          </legend>
          <RadioGroup
            value={profile ?? ""}
            onValueChange={(value) => {
              const band = RISK_PROFILE_BANDS.find((b) => b.profile === value);
              if (band) onChange(Math.round((band.min + band.max) / 2));
            }}
            className="grid gap-2 sm:grid-cols-2"
          >
            {RISK_PROFILE_BANDS.map((band) => (
              <div
                key={band.profile}
                className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2"
              >
                <RadioGroupItem value={band.profile} id={band.profile} />
                <Label htmlFor={band.profile} className="font-normal">
                  {band.min}–{band.max} · {band.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
      </div>
    </StepShell>
  );
}