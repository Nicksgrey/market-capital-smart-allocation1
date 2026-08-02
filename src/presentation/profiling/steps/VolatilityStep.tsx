import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VOLATILITY_SLIDER } from "@/domain/profiling/value-objects/volatility";
import type { VolatilityResult } from "@/domain/profiling/types";

import { StepShell } from "../ProfilingUI";

/**
 * VOLATILIDADE-ALVO
 * Barra deslizante atrelada à faixa do perfil final.
 */
export function VolatilityStep({
  volatility,
  onSelect,
  onNext,
  onBack,
}: {
  volatility: VolatilityResult;
  onSelect: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const aboveLimit = volatility.status === "acima_do_permitido";

  return (
    <StepShell
      eyebrow="Etapa 5 · Camada 1"
      title="Volatilidade-Alvo"
      description="Dentro do mesmo perfil, diferentes níveis de volatilidade geram carteiras completamente diferentes. Escolha a oscilação anual que você aceita."
      footer={
        <>
          <Button onClick={onNext} disabled={aboveLimit}>
            Ver Painel de Consolidação
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
          {aboveLimit ? (
            <Button
              variant="outline"
              onClick={() => onSelect(volatility.recommended)}
            >
              Usar volatilidade recomendada ({volatility.recommended}%)
            </Button>
          ) : null}
        </>
      }
    >
      <div className="max-w-2xl space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Volatilidade desejada</span>
            <span className="font-display text-2xl tabular-nums text-accent">
              {volatility.selected}%
            </span>
          </div>
          <Slider
            className="mt-4"
            value={[volatility.selected]}
            min={VOLATILITY_SLIDER.min}
            max={VOLATILITY_SLIDER.max}
            step={VOLATILITY_SLIDER.step}
            onValueChange={(values) => {
              const next = values[0];
              if (next != null) onSelect(next);
            }}
            aria-label="Volatilidade anual desejada"
          />
          <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{VOLATILITY_SLIDER.min}%</span>
            <span>
              Faixa do seu perfil: {volatility.min}% – {volatility.max}%
            </span>
            <span>{VOLATILITY_SLIDER.max}%</span>
          </div>
        </div>

        <div
          className={`rounded-lg border p-4 text-sm leading-relaxed ${
            aboveLimit
              ? "border-destructive/50 bg-destructive/10 text-foreground"
              : "border-border/70 bg-secondary/40 text-muted-foreground"
          }`}
        >
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Status:{" "}
            {volatility.status === "dentro_da_faixa"
              ? "Aprovada"
              : volatility.status === "abaixo_da_faixa"
                ? "Permitida com ressalva"
                : "Acima do permitido"}
          </p>
          <p>{volatility.message}</p>
          {aboveLimit ? (
            <p className="mt-2">
              A validação definitiva da volatilidade pertence ao Motor de
              Controle da Volatilidade, na Camada 2.
            </p>
          ) : null}
        </div>
      </div>
    </StepShell>
  );
}