import { Button } from "@/components/ui/button";
import type { ValidationReport } from "@/domain/allocation/types";

import { EnginePanel } from "../AllocationUI";

/** VALIDATION ENGINE — auditoria da carteira. */
export function ValidationPanel({
  validation,
  educationalOnly,
  onGeneratePortfolio,
  onSimulateOtherVolatility,
  onBack,
  message,
}: {
  validation: ValidationReport;
  educationalOnly: boolean;
  onGeneratePortfolio: () => void;
  onSimulateOtherVolatility: () => void;
  onBack: () => void;
  message?: string;
}) {
  return (
    <EnginePanel
      eyebrow="Etapa 5 · Camada 2"
      title="Validation Engine — auditoria da carteira"
      description="Antes de a carteira ser entregue ao usuário, o motor confere soma, SAA, liquidez, objetivo, diversificação, concentração, regras tributárias e volatilidade."
      footer={
        <>
          <Button
            onClick={onGeneratePortfolio}
            disabled={!validation.approved || educationalOnly}
          >
            Gerar Carteira Recomendada
          </Button>
          <Button variant="outline" onClick={onSimulateOtherVolatility}>
            Simular outra volatilidade
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <ul className="space-y-3">
          {validation.checks.map((check) => (
            <li
              key={check.id}
              className="flex gap-3 border-b border-border/50 pb-3"
            >
              <span
                aria-hidden
                className={
                  check.severity === "aprovado"
                    ? "text-accent"
                    : check.severity === "alerta"
                      ? "text-muted-foreground"
                      : "text-destructive"
                }
              >
                {check.severity === "aprovado"
                  ? "✔"
                  : check.severity === "alerta"
                    ? "!"
                    : "✖"}
              </span>
              <div>
                <p className="text-sm font-medium">{check.label}</p>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <p
          className={`rounded-lg border p-4 text-sm ${
            validation.approved
              ? "border-accent/40 bg-accent/5 text-accent"
              : "border-destructive/40 bg-destructive/5 text-destructive"
          }`}
        >
          {validation.summary}
        </p>

        {educationalOnly ? (
          <p className="rounded-lg bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Esta carteira foi calculada em modo educacional e não pode ser
            entregue como carteira recomendada.
          </p>
        ) : null}

        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </EnginePanel>
  );
}