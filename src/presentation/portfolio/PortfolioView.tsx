import { Button } from "@/components/ui/button";

import { LevelTabs } from "./PortfolioUI";
import { PortfolioConclusion } from "./PortfolioConclusion";
import {
  InvestedAmountBar,
  InvestedAmountStep,
} from "./InvestedAmountPanel";
import { MacroLevel } from "./levels/MacroLevel";
import { MesoLevel } from "./levels/MesoLevel";
import { MicroLevel } from "./levels/MicroLevel";
import { usePortfolioPresentation } from "./usePortfolioPresentation";

/**
 * CAMADA 3 — CARTEIRA ESTRATÉGICA (Macro → Meso → Micro).
 * Apenas apresentação da carteira aprovada pelo Validation Engine.
 */
export function PortfolioView({
  onBackToAllocation,
  onAnalyze,
  analysisMessage,
}: {
  onBackToAllocation: () => void;
  onAnalyze: () => void;
  analysisMessage?: string;
}) {
  const view = usePortfolioPresentation();

  if (!view.hydrated) {
    return (
      <p className="text-sm text-muted-foreground">
        Organizando a apresentação da sua carteira...
      </p>
    );
  }

  const { presentation } = view;

  if (!presentation) {
    return (
      <section className="rounded-xl border border-border/70 bg-card p-6">
        <h2 className="font-display text-lg font-semibold">
          Nenhuma carteira aprovada
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A Camada 3 apenas apresenta a carteira aprovada pelo Validation
          Engine. Conclua o perfilamento e execute os motores da Camada 2 para
          liberar a Carteira Estratégica.
        </p>
        <div className="mt-6">
          <Button onClick={onBackToAllocation}>
            Ir para a Inteligência de Alocação
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border/70 bg-card p-6">
        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Perfil Final", value: presentation.header.finalProfile },
            {
              label: "Volatilidade-alvo",
              value: `${presentation.header.targetVolatility}% ao ano`,
            },
            {
              label: "Validation Engine",
              value: presentation.header.approvedByValidationEngine
                ? "Carteira aprovada"
                : "Carteira com ressalvas",
            },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-1 font-display text-base font-semibold">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        {presentation.header.educationalOnly ? (
          <p className="mt-4 rounded-lg bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Esta carteira foi construída em modo educacional e não substitui a
            carteira recomendada pelo Motor Inteligente de Alocação.
          </p>
        ) : null}
      </section>

      {!view.amountConfirmed ? (
        <InvestedAmountStep
          initialValue={view.investedAmount}
          onConfirm={(value) => {
            view.setInvestedAmount(value);
            view.confirmAmount();
          }}
        />
      ) : (
        <InvestedAmountBar
          value={view.investedAmount}
          onChange={view.setInvestedAmount}
        />
      )}

      {view.amountConfirmed ? (
        <>
      <LevelTabs
        levels={view.levels}
        current={view.level}
        onSelect={view.setLevel}
      />

      {view.level === "macro" ? (
        <MacroLevel presentation={presentation} onNext={view.goNext} />
      ) : null}

      {view.level === "meso" ? (
        <MesoLevel
          presentation={presentation}
          onNext={view.goNext}
          onBack={view.goBack}
        />
      ) : null}

      {view.level === "micro" ? (
        <MicroLevel presentation={presentation} onBack={view.goBack} />
      ) : null}

      <PortfolioConclusion
        presentation={presentation}
        onAnalyze={onAnalyze}
        {...(analysisMessage ? { message: analysisMessage } : {})}
      />
        </>
      ) : null}
    </div>
  );
}