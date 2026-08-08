import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { formatCurrency, maskCurrencyInput, parseCurrencyInput } from "./format";

/**
 * Entrada da Camada 3 — "Quanto deseja investir?".
 * O valor é usado exclusivamente para converter percentuais em reais.
 */
export function InvestedAmountStep({
  initialValue,
  onConfirm,
}: {
  initialValue: number | null;
  onConfirm: (value: number) => void;
}) {
  const [text, setText] = useState(
    initialValue != null ? formatCurrency(initialValue) : "",
  );
  const value = parseCurrencyInput(text);

  return (
    <section className="rounded-xl border border-border/70 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">
        Entrada · Camada 3
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold">
        Quanto deseja investir?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Esse valor será utilizado para demonstrar quanto corresponde a cada
        percentual da estratégia de alocação. Ele não altera o perfil, o Risk
        Budget, a volatilidade-alvo nem qualquer cálculo do Motor Paramétrico.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Valor da simulação
          </span>
          <Input
            inputMode="numeric"
            value={text}
            onChange={(event) => setText(maskCurrencyInput(event.target.value))}
            placeholder="R$ 0,00"
            className="mt-2 w-56 tabular-nums"
            aria-label="Quanto deseja investir"
          />
        </label>
        <Button
          disabled={value == null || value <= 0}
          onClick={() => value && onConfirm(value)}
        >
          Continuar
        </Button>
      </div>
    </section>
  );
}

/** Campo compacto disponível durante toda a navegação Macro → Meso → Micro. */
export function InvestedAmountBar({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [text, setText] = useState(value != null ? formatCurrency(value) : "");

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-card px-5 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Valor investido na simulação
        </p>
        <p className="mt-1 font-display text-base font-semibold tabular-nums">
          {formatCurrency(value)}
        </p>
      </div>
      <div className="flex items-end gap-2">
        <Input
          inputMode="numeric"
          value={text}
          onChange={(event) => setText(maskCurrencyInput(event.target.value))}
          className="w-44 tabular-nums"
          aria-label="Alterar valor investido"
        />
        <Button
          variant="secondary"
          onClick={() => onChange(parseCurrencyInput(text))}
        >
          Atualizar valores
        </Button>
      </div>
    </section>
  );
}
