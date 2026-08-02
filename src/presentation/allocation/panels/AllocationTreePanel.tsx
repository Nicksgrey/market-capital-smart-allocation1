import { Button } from "@/components/ui/button";
import {
  LIQUIDITY_BUCKET_LABEL,
  type Country,
  type LiquidityBucket,
  type StructuredPortfolio,
} from "@/domain/allocation/types";

import { EnginePanel, WeightRow } from "../AllocationUI";

const COUNTRY_LABEL: Record<Country, string> = {
  brasil: "Brasil",
  estados_unidos: "Estados Unidos",
  europa: "Europa",
  emergentes: "Emergentes",
};

/** ALLOCATION ENGINE — Macro → Meso → Micro. */
export function AllocationTreePanel({
  structure,
  onNext,
  onBack,
}: {
  structure: StructuredPortfolio;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <EnginePanel
      eyebrow="Etapa 4 · Camada 2"
      title="Allocation Engine — Macro → Meso → Micro"
      description="Transforma os pesos calculados em uma carteira estruturada: cada classe macro é dividida em sub-classes (meso) conforme liquidez e eficiência tributária, e depois nos ativos representativos (micro)."
      footer={
        <>
          <Button onClick={onNext}>Avançar para o Validation Engine</Button>
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        <div className="space-y-6">
          {structure.macro.map((bucket) => (
            <div
              key={bucket.macro}
              className="rounded-lg border border-border/60 p-5"
            >
              <WeightRow label={bucket.label} weight={bucket.weight} emphasis />
              <ul className="mt-4 space-y-3">
                {bucket.sleeves.map((sleeve) => (
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
                    <ul className="mt-2 space-y-1">
                      {sleeve.micro.map((asset) => (
                        <li
                          key={asset.name}
                          className="flex items-baseline justify-between gap-4 text-xs text-muted-foreground"
                        >
                          <span>
                            {asset.name} — {asset.description}
                          </span>
                          <span className="tabular-nums">{asset.weight}%</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Distribuição por horizonte de liquidez
            </p>
            <dl className="mt-3 space-y-2">
              {(
                Object.keys(structure.liquidityDistribution) as LiquidityBucket[]
              ).map((bucket) => (
                <div key={bucket} className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">
                    {LIQUIDITY_BUCKET_LABEL[bucket]}
                  </dt>
                  <dd className="tabular-nums">
                    {structure.liquidityDistribution[bucket]}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Distribuição geográfica
            </p>
            <dl className="mt-3 space-y-2">
              {(Object.keys(structure.countryDistribution) as Country[]).map(
                (country) => (
                  <div
                    key={country}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <dt className="text-muted-foreground">
                      {COUNTRY_LABEL[country]}
                    </dt>
                    <dd className="tabular-nums">
                      {structure.countryDistribution[country]}%
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </div>
        </div>
      </div>
    </EnginePanel>
  );
}