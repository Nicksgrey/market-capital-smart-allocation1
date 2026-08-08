import { Button } from "@/components/ui/button";
import type { PortfolioPresentation } from "@/domain/portfolio/types";

import {
  DistributionCard,
  PortfolioWeightRow,
  RationaleCard,
  countryRows,
  liquidityRows,
} from "../PortfolioUI";
import { formatCurrency, formatPercent } from "../format";

/** MACRO — exibe as grandes classes e seus percentuais. */
export function MacroLevel({
  presentation,
  onNext,
}: {
  presentation: PortfolioPresentation;
  onNext: () => void;
}) {
  return (
    <section className="rounded-xl border border-border/70 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        Nível 1 · Camada 3
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">
        Macro — grandes classes de ativos
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Distribuição do patrimônio entre Renda Fixa, Ações Brasil, Ações Exterior,
        Fundos Imobiliários, Alternativos e Caixa, exatamente como aprovada pelo
        Validation Engine.
      </p>

      <div className="mt-6 space-y-5">
        {presentation.macro.map((item) => (
          <PortfolioWeightRow
            key={item.macro}
            label={item.label}
            weight={item.weight}
            amount={item.amount}
            emphasis
          />
        ))}
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-border/60 pt-4">
        <span className="text-sm font-medium">Total alocado</span>
        <span className="flex items-baseline gap-3">
          <span className="font-display text-sm tabular-nums">
            {formatPercent(presentation.totalWeight)}
          </span>
          {presentation.totalAmount != null ? (
            <span className="font-display text-sm tabular-nums">
              {formatCurrency(presentation.totalAmount)}
            </span>
          ) : null}
        </span>
      </div>

      {presentation.equity ? (
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/5 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-accent">
            Renda variável total: {formatPercent(presentation.equity.total)}
            {presentation.equity.totalAmount != null
              ? ` · ${formatCurrency(presentation.equity.totalAmount)}`
              : ""}
          </p>
          <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <span>
              Brasil: {formatPercent(presentation.equity.brasil)}
              {presentation.equity.brasilAmount != null
                ? ` · ${formatCurrency(presentation.equity.brasilAmount)}`
                : ""}
            </span>
            <span>
              Exterior: {formatPercent(presentation.equity.exterior)}
              {presentation.equity.exteriorAmount != null
                ? ` · ${formatCurrency(presentation.equity.exteriorAmount)}`
                : ""}
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DistributionCard
          title="Distribuição por liquidez"
          rows={liquidityRows(presentation.liquidityDistribution)}
        />
        <DistributionCard
          title="Distribuição geográfica"
          rows={countryRows(presentation.countryDistribution)}
        />
      </div>

      <div className="mt-6">
        <RationaleCard rationales={presentation.rationales} />
      </div>

      <div className="mt-8">
        <Button onClick={onNext}>Detalhar por sub-classe (Meso)</Button>
      </div>
    </section>
  );
}