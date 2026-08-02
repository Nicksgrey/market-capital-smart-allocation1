import { Button } from "@/components/ui/button";
import type { PortfolioPresentation } from "@/domain/portfolio/types";

/** Conclusão da Camada 3 e transição para a Camada 4. */
export function PortfolioConclusion({
  presentation,
  onAnalyze,
  message,
}: {
  presentation: PortfolioPresentation;
  onAnalyze: () => void;
  message?: string;
}) {
  return (
    <section className="rounded-xl border border-accent/40 bg-accent/5 p-6">
      <h2 className="font-display text-lg font-semibold text-accent">
        {presentation.conclusion.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {presentation.conclusion.message}
      </p>
      <div className="mt-6">
        <Button onClick={onAnalyze}>{presentation.conclusion.ctaLabel}</Button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      ) : null}
    </section>
  );
}