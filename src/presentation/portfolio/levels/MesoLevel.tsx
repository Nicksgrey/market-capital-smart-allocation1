import { Button } from "@/components/ui/button";
import { LIQUIDITY_BUCKET_LABEL } from "@/domain/allocation/types";
import type { PortfolioPresentation } from "@/domain/portfolio/types";

import { COUNTRY_LABEL, PortfolioWeightRow } from "../PortfolioUI";

/** MESO — detalha cada classe macro em sub-classes. */
export function MesoLevel({
  presentation,
  onNext,
  onBack,
}: {
  presentation: PortfolioPresentation;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <section className="rounded-xl border border-border/70 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        Nível 2 · Camada 3
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">
        Meso — detalhamento de cada classe
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Cada grande classe é aberta em suas sub-classes, com o horizonte de
        liquidez, a região e a observação tributária que justificam a posição.
      </p>

      <div className="mt-6 space-y-6">
        {presentation.meso.map((group) => (
          <div
            key={group.macro}
            className="rounded-lg border border-border/60 p-5"
          >
            <PortfolioWeightRow
              label={`${group.label} (${group.weight}%)`}
              weight={group.weight}
              emphasis
            />
            <ul className="mt-4 space-y-3">
              {group.sleeves.map((sleeve) => (
                <li key={sleeve.id} className="border-l border-border pl-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium">{sleeve.label}</span>
                    <span className="font-display text-sm tabular-nums text-muted-foreground">
                      {sleeve.weight}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {LIQUIDITY_BUCKET_LABEL[sleeve.liquidityBucket]} ·{" "}
                    {COUNTRY_LABEL[sleeve.country]}
                    {sleeve.taxNote ? ` · ${sleeve.taxNote}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button onClick={onNext}>Ver ativos específicos (Micro)</Button>
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
      </div>
    </section>
  );
}