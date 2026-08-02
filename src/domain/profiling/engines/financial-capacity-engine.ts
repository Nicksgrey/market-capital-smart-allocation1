import { classifyCapacity } from "../value-objects/capacity-label";
import type {
  DiscoveryAnswers,
  FinancialCapacityFactor,
  FinancialCapacityResult,
} from "../types";

/**
 * CAPACIDADE FINANCEIRA — Financial Capacity Score (FCS), 0 a 100.
 *
 * Responde à pergunta oficial: "Mesmo que essa pessoa goste de risco, ela
 * pode assumir esse risco?". Cada variável coletada na Descoberta do
 * Investidor possui um peso; o score é a soma ponderada das notas.
 */
export const FCS_WEIGHTS = {
  horizonte: 20,
  reserva: 18,
  liquidez: 14,
  objetivo: 12,
  fluxo_de_caixa: 12,
  patrimonio: 10,
  dependentes: 6,
  idade: 5,
  aposentado: 3,
} as const;

type Scored = { raw: number; note: string };

function scoreHorizon(years: number | null): Scored {
  if (years == null) return { raw: 0, note: "Horizonte não informado." };
  if (years <= 2) return { raw: 10, note: "Até 2 anos — muito abaixo." };
  if (years <= 5) return { raw: 30, note: "3 a 5 anos — baixo." };
  if (years <= 10) return { raw: 55, note: "5 a 10 anos — médio." };
  if (years <= 20) return { raw: 80, note: "10 a 20 anos — alto." };
  return { raw: 100, note: "Acima de 20 anos — muito alto." };
}

function scoreReserve(reserve: DiscoveryAnswers["emergencyReserve"]): Scored {
  switch (reserve) {
    case "nenhuma":
      return { raw: 0, note: "Não possui reserva — reduz muito a capacidade." };
    case "abaixo_6_meses":
      return { raw: 35, note: "Reserva inferior a 6 meses — reduz." };
    case "entre_6_e_12_meses":
      return { raw: 70, note: "Reserva entre 6 e 12 meses — adequada." };
    case "acima_12_meses":
      return { raw: 100, note: "Reserva superior a 12 meses — aumenta." };
    default:
      return { raw: 0, note: "Reserva não informada." };
  }
}

function scoreLiquidity(need: DiscoveryAnswers["liquidityNeed"]): Scored {
  switch (need) {
    case "alta":
      return { raw: 15, note: "Precisa do dinheiro logo — menor capacidade." };
    case "media":
      return { raw: 55, note: "Necessidade de liquidez intermediária." };
    case "baixa":
      return { raw: 100, note: "Baixa necessidade de liquidez." };
    default:
      return { raw: 0, note: "Necessidade de liquidez não informada." };
  }
}

function scoreGoal(goal: DiscoveryAnswers["mainGoal"]): Scored {
  switch (goal) {
    case "compra_imovel":
      return { raw: 20, note: "Compra de imóvel — baixa capacidade." };
    case "reserva_seguranca":
      return { raw: 30, note: "Reserva de segurança — baixa capacidade." };
    case "geracao_renda":
      return { raw: 55, note: "Geração de renda — capacidade intermediária." };
    case "crescimento_patrimonial":
      return { raw: 85, note: "Crescimento patrimonial — alta capacidade." };
    case "aposentadoria":
      return {
        raw: 100,
        note: "Aposentadoria de longo prazo — alta capacidade.",
      };
    default:
      return { raw: 0, note: "Objetivo não informado." };
  }
}

function scoreCashFlow(income: number | null, expenses: number | null): Scored {
  if (income == null || expenses == null || income <= 0) {
    return { raw: 0, note: "Renda ou despesas não informadas." };
  }
  const surplus = (income - expenses) / income;
  if (surplus <= 0)
    return { raw: 0, note: "Despesas iguais ou superiores à renda." };
  if (surplus < 0.1) return { raw: 25, note: "Sobra mensal inferior a 10%." };
  if (surplus < 0.25) return { raw: 55, note: "Sobra mensal entre 10% e 25%." };
  if (surplus < 0.4) return { raw: 80, note: "Sobra mensal entre 25% e 40%." };
  return { raw: 100, note: "Sobra mensal superior a 40% da renda." };
}

function scoreNetWorth(netWorth: number | null, expenses: number | null): Scored {
  if (netWorth == null || netWorth <= 0)
    return { raw: 0, note: "Patrimônio não informado." };
  const annualExpenses = (expenses ?? 0) * 12;
  if (annualExpenses <= 0)
    return { raw: 50, note: "Patrimônio informado sem base de despesas." };
  const years = netWorth / annualExpenses;
  if (years < 1)
    return { raw: 15, note: "Patrimônio cobre menos de 1 ano de despesas." };
  if (years < 3)
    return { raw: 40, note: "Patrimônio cobre de 1 a 3 anos de despesas." };
  if (years < 7)
    return { raw: 65, note: "Patrimônio cobre de 3 a 7 anos de despesas." };
  if (years < 15)
    return { raw: 85, note: "Patrimônio cobre de 7 a 15 anos de despesas." };
  return { raw: 100, note: "Patrimônio cobre mais de 15 anos de despesas." };
}

function scoreDependents(dependents: number): Scored {
  if (dependents <= 0) return { raw: 100, note: "Sem dependentes." };
  if (dependents === 1) return { raw: 70, note: "1 dependente." };
  if (dependents === 2) return { raw: 45, note: "2 dependentes." };
  if (dependents === 3) return { raw: 25, note: "3 dependentes." };
  return { raw: 10, note: "4 ou mais dependentes." };
}

function scoreAge(age: number | null): Scored {
  if (age == null) return { raw: 0, note: "Idade não informada." };
  if (age < 30) return { raw: 100, note: "Menos de 30 anos." };
  if (age < 40) return { raw: 85, note: "Entre 30 e 39 anos." };
  if (age < 50) return { raw: 65, note: "Entre 40 e 49 anos." };
  if (age < 60) return { raw: 45, note: "Entre 50 e 59 anos." };
  if (age < 70) return { raw: 25, note: "Entre 60 e 69 anos." };
  return { raw: 10, note: "70 anos ou mais." };
}

function scoreRetired(isRetired: boolean): Scored {
  return isRetired
    ? { raw: 20, note: "Aposentado — depende do patrimônio para consumo." }
    : { raw: 100, note: "Em fase de acumulação." };
}

/** Calcula o Financial Capacity Score a partir da Descoberta do Investidor. */
export function calculateFinancialCapacity(
  answers: DiscoveryAnswers,
): FinancialCapacityResult {
  const entries: Array<{
    key: FinancialCapacityFactor["key"];
    label: string;
    weight: number;
    result: Scored;
  }> = [
    {
      key: "horizonYears",
      label: "Horizonte",
      weight: FCS_WEIGHTS.horizonte,
      result: scoreHorizon(answers.horizonYears),
    },
    {
      key: "emergencyReserve",
      label: "Reserva de emergência",
      weight: FCS_WEIGHTS.reserva,
      result: scoreReserve(answers.emergencyReserve),
    },
    {
      key: "liquidityNeed",
      label: "Necessidade de liquidez",
      weight: FCS_WEIGHTS.liquidez,
      result: scoreLiquidity(answers.liquidityNeed),
    },
    {
      key: "mainGoal",
      label: "Objetivo",
      weight: FCS_WEIGHTS.objetivo,
      result: scoreGoal(answers.mainGoal),
    },
    {
      key: "fluxo_de_caixa",
      label: "Renda x despesas",
      weight: FCS_WEIGHTS.fluxo_de_caixa,
      result: scoreCashFlow(answers.monthlyIncome, answers.monthlyExpenses),
    },
    {
      key: "netWorth",
      label: "Patrimônio",
      weight: FCS_WEIGHTS.patrimonio,
      result: scoreNetWorth(answers.netWorth, answers.monthlyExpenses),
    },
    {
      key: "dependents",
      label: "Dependentes",
      weight: FCS_WEIGHTS.dependentes,
      result: scoreDependents(answers.dependents),
    },
    {
      key: "age",
      label: "Idade",
      weight: FCS_WEIGHTS.idade,
      result: scoreAge(answers.age),
    },
    {
      key: "isRetired",
      label: "Aposentado",
      weight: FCS_WEIGHTS.aposentado,
      result: scoreRetired(answers.isRetired),
    },
  ];

  const breakdown: FinancialCapacityFactor[] = entries.map((e) => ({
    key: e.key,
    label: e.label,
    weight: e.weight,
    rawScore: e.result.raw,
    weightedScore: (e.result.raw * e.weight) / 100,
    note: e.result.note,
  }));

  const score = Math.round(
    breakdown.reduce((total, f) => total + f.weightedScore, 0),
  );

  return { score, label: classifyCapacity(score), breakdown };
}