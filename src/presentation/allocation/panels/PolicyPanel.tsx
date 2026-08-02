import { Button } from "@/components/ui/button";
import {
  LIQUIDITY_BUCKET_LABEL,
  MACRO_CLASS_LABEL,
  MACRO_CLASS_ORDER,
  type LiquidityBucket,
  type MacroClass,
  type PolicyDecision,
} from "@/domain/allocation/types";
import { DIVERSIFICATION_DIMENSIONS } from "@/domain/allocation/policies/diversification-rules";
import { policyFamilyLabel } from "@/domain/profiling/value-objects/risk-profile";

import { EnginePanel, RuleList } from "../AllocationUI";

/** POLICY ENGINE — define o que é permitido. */
export function PolicyPanel({
  policy,
  onNext,
}: {
  policy: PolicyDecision;
  onNext: () => void;
}) {
  return (
    <EnginePanel
      eyebrow="Etapa 1 · Camada 2"
      title="Policy Engine — biblioteca de regras"
      description={`Política de Alocação Estratégica (SAA) da família ${policyFamilyLabel(
        policy.family,
      )}, regras de diversificação, liquidez, tributação, concentração e objetivo. O Policy Engine define o que é permitido antes de qualquer cálculo.`}
      footer={
        <Button onClick={onNext}>Avançar para o Controle da Volatilidade</Button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-accent/40 bg-accent/5 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Objetivo da política
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-accent">
            {policy.saa.objective}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Volatilidade permitida: {policy.saa.volatility.min}% a{" "}
            {policy.saa.volatility.max}% ao ano
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Distribuição macro permitida (SAA)
          </h3>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {MACRO_CLASS_ORDER.filter(
              (macro): macro is MacroClass => policy.saa.macro[macro] != null,
            ).map((macro) => {
              const band = policy.saa.macro[macro]!;
              return (
                <div
                  key={macro}
                  className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2"
                >
                  <dt className="text-sm text-muted-foreground">
                    {MACRO_CLASS_LABEL[macro]}
                  </dt>
                  <dd className="text-sm font-medium tabular-nums">
                    {band.min}% – {band.max}%
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <RuleList
            title="Regras de diversificação"
            items={[
              ...DIVERSIFICATION_DIMENSIONS,
              `Máximo por ativo: ${policy.diversification.maxPerAsset}%`,
              `Máximo por emissor: ${policy.diversification.maxPerIssuer}%`,
              `Máximo por setor: ${policy.diversification.maxPerSector}%`,
              `Máximo por país: ${policy.diversification.maxPerCountry}%`,
              `Mínimo de classes: ${policy.diversification.minClasses}`,
            ]}
          />
          <RuleList
            title="Regras de concentração"
            items={[
              `Classe macro: até ${policy.concentration.maxPerMacroClass}%`,
              `País: até ${policy.concentration.maxPerCountry}%`,
              `Emissor: até ${policy.concentration.maxPerIssuer}%`,
              `Uma única empresa: até ${policy.concentration.maxPerSingleCompany}%`,
              `Sub-classe (meso): até ${policy.concentration.maxPerMesoSleeve}%`,
            ]}
          />
          <RuleList
            title="Regras de liquidez"
            items={[
              policy.liquidity.rationale,
              ...(
                Object.keys(policy.liquidity.targets) as LiquidityBucket[]
              ).map(
                (bucket) =>
                  `${LIQUIDITY_BUCKET_LABEL[bucket]}: ${policy.liquidity.targets[bucket].min}% – ${policy.liquidity.targets[bucket].max}%`,
              ),
            ]}
          />
          <RuleList
            title="Regras tributárias"
            items={[policy.tax.rationale, ...policy.tax.preferenceOrder]}
          />
          <RuleList
            title={`Regras por objetivo — ${policy.goal.headline}`}
            items={policy.goal.directives}
          />
        </div>
      </div>
    </EnginePanel>
  );
}