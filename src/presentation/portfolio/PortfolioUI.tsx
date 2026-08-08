import { Progress } from "@/components/ui/progress";
import {
  PORTFOLIO_LEVEL_LABEL,
  type PortfolioLevel,
} from "@/domain/portfolio/types";
import {
  LIQUIDITY_BUCKET_LABEL,
  type Country,
  type LiquidityBucket,
} from "@/domain/allocation/types";

import { formatCurrency, formatPercent } from "./format";

export const COUNTRY_LABEL: Record<Country, string> = {
  brasil: "Brasil",
  estados_unidos: "Estados Unidos",
  europa: "Europa",
  emergentes: "Emergentes",
};

export function LevelTabs({
  levels,
  current,
  onSelect,
}: {
  levels: PortfolioLevel[];
  current: PortfolioLevel;
  onSelect: (level: PortfolioLevel) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Níveis da carteira estratégica"
      className="flex flex-wrap gap-2"
    >
      {levels.map((level, index) => (
        <button
          key={level}
          type="button"
          role="tab"
          aria-selected={level === current}
          onClick={() => onSelect(level)}
          className={`rounded-full border px-4 py-1.5 text-xs transition ${
            level === current
              ? "border-accent bg-accent/10 font-medium text-accent"
              : "border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="tabular-nums">{index + 1}</span>{" "}
          {PORTFOLIO_LEVEL_LABEL[level]}
        </button>
      ))}
    </div>
  );
}

export function PortfolioWeightRow({
  label,
  weight,
  caption,
  emphasis,
  amount,
}: {
  label: string;
  weight: number;
  caption?: string;
  emphasis?: boolean;
  amount?: number | null;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={
            emphasis ? "font-display text-sm font-semibold" : "text-sm"
          }
        >
          {label}
        </span>
        <span className="flex items-baseline gap-3">
          <span className="font-display text-sm tabular-nums text-muted-foreground">
            {formatPercent(weight)}
          </span>
          {amount != null ? (
            <span className="text-sm tabular-nums text-foreground">
              {formatCurrency(amount)}
            </span>
          ) : null}
        </span>
      </div>
      <Progress value={Math.min(weight, 100)} className="mt-2 h-2" />
      {caption ? (
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

/** Justificativas automáticas geradas com os dados reais da carteira. */
export function RationaleCard({ rationales }: { rationales: string[] }) {
  if (rationales.length === 0) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Por que a carteira ficou assim
      </p>
      <ul className="mt-3 space-y-2">
        {rationales.map((item) => (
          <li key={item} className="text-xs leading-relaxed text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DistributionCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="tabular-nums">{row.value}%</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function liquidityRows(
  distribution: Record<LiquidityBucket, number>,
): Array<{ label: string; value: number }> {
  return (Object.keys(distribution) as LiquidityBucket[]).map((bucket) => ({
    label: LIQUIDITY_BUCKET_LABEL[bucket],
    value: distribution[bucket],
  }));
}

export function countryRows(
  distribution: Record<Country, number>,
): Array<{ label: string; value: number }> {
  return (Object.keys(distribution) as Country[]).map((country) => ({
    label: COUNTRY_LABEL[country],
    value: distribution[country],
  }));
}