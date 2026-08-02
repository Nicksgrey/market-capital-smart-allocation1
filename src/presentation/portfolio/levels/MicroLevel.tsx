import { Button } from "@/components/ui/button";
import type { PortfolioPresentation } from "@/domain/portfolio/types";

/** MICRO — apresenta os ativos específicos (sugestão educacional). */
export function MicroLevel({
  presentation,
  onBack,
}: {
  presentation: PortfolioPresentation;
  onBack: () => void;
}) {
  const groupsByMacro = presentation.micro.reduce<
    Record<string, typeof presentation.micro>
  >((acc, group) => {
    const list = acc[group.macroLabel] ?? [];
    list.push(group);
    acc[group.macroLabel] = list;
    return acc;
  }, {});

  return (
    <section className="rounded-xl border border-border/70 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        Nível 3 · Camada 3
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">
        Micro — ativos específicos
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Fechamento da carteira com os ativos que representam cada sub-classe.
      </p>

      <div className="mt-6 space-y-8">
        {Object.entries(groupsByMacro).map(([macroLabel, groups]) => (
          <div key={macroLabel}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {macroLabel}
            </h3>
            <div className="mt-3 space-y-4">
              {groups.map((group) => (
                <div
                  key={group.sleeveId}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium uppercase tracking-[0.08em]">
                      {group.sleeveLabel}
                    </span>
                    <span className="font-display text-sm tabular-nums text-muted-foreground">
                      {group.weight}%
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {group.assets.map((asset) => (
                      <li
                        key={asset.name}
                        className="flex items-baseline justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.description}
                          </p>
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {asset.weight}%
                        </span>
                      </li>
                    ))}
                  </ul>
                  {group.assets[0]?.examples.length ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Exemplos educacionais:{" "}
                      {group.assets[0].examples.join(", ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-lg bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
        {presentation.microDisclaimer}
      </p>

      <div className="mt-8">
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
      </div>
    </section>
  );
}