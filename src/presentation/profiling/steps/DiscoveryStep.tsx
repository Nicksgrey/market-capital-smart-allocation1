import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DiscoveryAnswers } from "@/domain/profiling/types";

import { StepShell } from "../ProfilingUI";

const RESERVE_OPTIONS: Array<{
  value: NonNullable<DiscoveryAnswers["emergencyReserve"]>;
  label: string;
}> = [
  { value: "nenhuma", label: "Não possui reserva" },
  { value: "abaixo_6_meses", label: "Inferior a 6 meses" },
  { value: "entre_6_e_12_meses", label: "Entre 6 e 12 meses" },
  { value: "acima_12_meses", label: "Superior a 12 meses" },
];

const GOAL_OPTIONS: Array<{
  value: NonNullable<DiscoveryAnswers["mainGoal"]>;
  label: string;
}> = [
  { value: "compra_imovel", label: "Compra de imóvel" },
  { value: "reserva_seguranca", label: "Reserva de segurança" },
  { value: "geracao_renda", label: "Geração de renda" },
  { value: "crescimento_patrimonial", label: "Crescimento patrimonial" },
  { value: "aposentadoria", label: "Aposentadoria" },
];

const LIQUIDITY_OPTIONS: Array<{
  value: NonNullable<DiscoveryAnswers["liquidityNeed"]>;
  label: string;
}> = [
  { value: "alta", label: "Alta — pode precisar do dinheiro logo" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa — não precisa do dinheiro no curto prazo" },
];

function numberOrNull(value: string) {
  return value === "" ? null : Number(value);
}

/**
 * DESCOBERTA DO INVESTIDOR
 * Vai além do suitability e alimenta o Financial Capacity Score.
 */
export function DiscoveryStep({
  discovery,
  onChange,
  onNext,
  onBack,
  complete,
}: {
  discovery: DiscoveryAnswers;
  onChange: (patch: Partial<DiscoveryAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
  complete: boolean;
}) {
  return (
    <StepShell
      eyebrow="Etapa 2 · Camada 1"
      title="Descoberta do Investidor"
      description="Estas informações vão além do suitability e são utilizadas no cálculo da Capacidade Financeira."
      footer={
        <>
          <Button onClick={onNext} disabled={!complete}>
            Calcular Capacidade Financeira
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="age">Idade</Label>
          <Input
            id="age"
            type="number"
            min={0}
            value={discovery.age ?? ""}
            onChange={(e) => onChange({ age: numberOrNull(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="net-worth">Patrimônio total (R$)</Label>
          <Input
            id="net-worth"
            type="number"
            min={0}
            value={discovery.netWorth ?? ""}
            onChange={(e) => onChange({ netWorth: numberOrNull(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="income">Renda mensal (R$)</Label>
          <Input
            id="income"
            type="number"
            min={0}
            value={discovery.monthlyIncome ?? ""}
            onChange={(e) =>
              onChange({ monthlyIncome: numberOrNull(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expenses">Despesas mensais (R$)</Label>
          <Input
            id="expenses"
            type="number"
            min={0}
            value={discovery.monthlyExpenses ?? ""}
            onChange={(e) =>
              onChange({ monthlyExpenses: numberOrNull(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reserve">Reserva de emergência</Label>
          <Select
            value={discovery.emergencyReserve ?? ""}
            onValueChange={(value) =>
              onChange({
                emergencyReserve:
                  value as NonNullable<DiscoveryAnswers["emergencyReserve"]>,
              })
            }
          >
            <SelectTrigger id="reserve">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {RESERVE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dependents">Dependentes</Label>
          <Input
            id="dependents"
            type="number"
            min={0}
            value={discovery.dependents}
            onChange={(e) =>
              onChange({ dependents: Number(e.target.value || 0) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horizon">Horizonte de investimento (anos)</Label>
          <Input
            id="horizon"
            type="number"
            min={0}
            value={discovery.horizonYears ?? ""}
            onChange={(e) =>
              onChange({ horizonYears: numberOrNull(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Objetivo principal</Label>
          <Select
            value={discovery.mainGoal ?? ""}
            onValueChange={(value) =>
              onChange({
                mainGoal: value as NonNullable<DiscoveryAnswers["mainGoal"]>,
              })
            }
          >
            <SelectTrigger id="goal">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {GOAL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="liquidity">Necessidade de liquidez</Label>
          <Select
            value={discovery.liquidityNeed ?? ""}
            onValueChange={(value) =>
              onChange({
                liquidityNeed:
                  value as NonNullable<DiscoveryAnswers["liquidityNeed"]>,
              })
            }
          >
            <SelectTrigger id="liquidity">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {LIQUIDITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-md border border-border/70 px-3 py-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="retired" className="font-normal">
            É aposentado?
          </Label>
          <Switch
            id="retired"
            checked={discovery.isRetired}
            onCheckedChange={(checked) => onChange({ isRetired: checked })}
          />
        </div>
      </div>
    </StepShell>
  );
}