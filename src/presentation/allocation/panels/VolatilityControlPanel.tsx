import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { VolatilityControlDecision } from "@/domain/allocation/types";

import { EnginePanel } from "../AllocationUI";

/**
 * MOTOR DE CONTROLE DA VOLATILIDADE — governança do risco.
 * Ponte entre o Risk Budget e o Optimization Engine.
 */
export function VolatilityControlPanel({
  decision,
  requestedVolatility,
  onRequestVolatility,
  onResetToRecommended,
  onEnableEducational,
  onReviewProfile,
  onNext,
  onBack,
}: {
  decision: VolatilityControlDecision;
  requestedVolatility: number;
  onRequestVolatility: (value: number) => void;
  onResetToRecommended: () => void;
  onEnableEducational: () => void;
  onReviewProfile: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const tone =
    decision.status === "aprovada"
      ? "border-accent/40 bg-accent/5 text-accent"
      : decision.status === "aprovada_com_alerta"
        ? "border-border bg-secondary/40 text-foreground"
        : "border-destructive/40 bg-destructive/5 text-destructive";

  return (
    <EnginePanel
      eyebrow="Etapa 2 · Camada 2"
      title="Controle da Volatilidade"
      description="Responde uma única pergunta: a volatilidade escolhida pode ser utilizada para construir essa carteira? Somente depois de aprovada a volatilidade segue para o Optimization Engine."
      footer={
        <>
          <Button onClick={onNext} disabled={!decision.canOptimize}>
            Avançar para o Optimization Engine
          </Button>
          {decision.status === "acima_do_permitido" ? (
            <>
              <Button variant="outline" onClick={onResetToRecommended}>
                Voltar para a recomendada
              </Button>
              <Button variant="outline" onClick={onEnableEducational}>
                Simular apenas para fins educacionais
              </Button>
            </>
          ) : null}
          {decision.status === "bloqueada" ? (
            <>
              <Button variant="outline" onClick={onResetToRecommended}>
                Voltar para a recomendada
              </Button>
              <Button variant="outline" onClick={onReviewProfile}>
                Revisar meu perfil
              </Button>
            </>
          ) : null}
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Faixa permitida",
              value: `${decision.allowedRange.min}% – ${decision.allowedRange.max}% ao ano`,
            },
            {
              label: "Volatilidade recomendada",
              value: `${decision.recommendedVolatility}% ao ano`,
            },
            {
              label: "Volatilidade solicitada",
              value: `${decision.requestedVolatility}% ao ano`,
            },
            {
              label: "Regra aplicada",
              value: `Regra ${decision.rule}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2"
            >
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div>
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium" htmlFor="vol-control">
              Ajustar volatilidade-alvo
            </label>
            <span className="font-display text-sm tabular-nums text-muted-foreground">
              {requestedVolatility}% ao ano
            </span>
          </div>
          <Slider
            id="vol-control"
            className="mt-4"
            min={2}
            max={18}
            step={1}
            value={[requestedVolatility]}
            onValueChange={(values) => {
              const next = values[0];
              if (next != null) onRequestVolatility(next);
            }}
          />
        </div>

        <div className={`rounded-lg border p-5 ${tone}`}>
          <p className="font-display text-base font-semibold">
            {decision.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{decision.message}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {decision.options.map((option) => (
              <li key={option}>✔ {option}</li>
            ))}
          </ul>
        </div>

        {decision.educationalOnly ? (
          <p className="rounded-lg bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Modo educacional ativado: a carteira calculada a seguir não substitui
            a carteira recomendada pelo Motor Inteligente de Alocação.
          </p>
        ) : null}
      </div>
    </EnginePanel>
  );
}