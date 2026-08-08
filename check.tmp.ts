import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";
import { buildStrategicPortfolio, isBlocked } from "@/application/allocation/use-cases/build-strategic-portfolio";
import { presentStrategicPortfolio } from "@/application/portfolio/use-cases/present-strategic-portfolio";
import { EMPTY_DISCOVERY } from "@/application/profiling/dto/investor-profile.dto";

const discoveries = [
  { name: "conservador", behavioralScore: 15, d: { mainGoal: "reserva_seguranca", horizonYears: 3, liquidityNeed: "alta", monthlyIncome: 12000, monthlyExpenses: 8000, netWorth: 300000, dependents: 0, emergencyReserve: "acima_de_seis_meses", age: 40, isRetired: false } },
  { name: "moderado", behavioralScore: 50, d: { mainGoal: "crescimento_patrimonial", horizonYears: 8, liquidityNeed: "media", monthlyIncome: 30000, monthlyExpenses: 15000, netWorth: 900000, dependents: 1, emergencyReserve: "acima_de_seis_meses", age: 40, isRetired: false } },
  { name: "arrojado", behavioralScore: 90, d: { mainGoal: "crescimento_patrimonial", horizonYears: 20, liquidityNeed: "baixa", monthlyIncome: 80000, monthlyExpenses: 25000, netWorth: 4000000, dependents: 2, emergencyReserve: "acima_de_seis_meses", age: 40, isRetired: false } },
];

for (const c of discoveries) {
  const profile = consolidateInvestorProfile({ behavioralScore: c.behavioralScore, discovery: { ...EMPTY_DISCOVERY, ...(c.d as any) } });
  const p = buildStrategicPortfolio({ profile });
  if (isBlocked(p)) { console.log(c.name, "BLOQUEADA"); continue; }
  const w = p.optimization.weights;
  console.log("\n===", c.name, "vol", p.optimization.targetVolatility);
  console.log("weights", w, "soma", Object.values(w).reduce((a, b) => a + b, 0));
  console.log("equity", p.optimization.equity);
  const fiis = p.structure.macro.find((b) => b.macro === "fiis");
  console.log("fiis", fiis?.weight, fiis?.sleeves.map((s) => `${s.label} ${s.shareOfClass}% classe / ${s.weight}% carteira`));
  console.log("rf", p.structure.macro.find((b) => b.macro === "renda_fixa")?.sleeves.map((s) => `${s.label} ${s.weight}`));
  console.log("validation", p.validation.approved, p.validation.checks.filter((x) => x.severity !== "aprovado").map((x) => `${x.id}:${x.severity}:${x.detail}`));
  for (const amount of [100000, 500000, 1000000]) {
    const view = presentStrategicPortfolio({ profile, portfolio: p, investedAmount: amount });
    const sumPct = view.macro.reduce((s, m) => s + m.weight, 0);
    const sumAmt = view.macro.reduce((s, m) => s + (m.amount ?? 0), 0);
    const microAmt = view.micro.flatMap((g) => g.assets).reduce((s, a) => s + (a.amount ?? 0), 0);
    console.log(`  R$${amount}: macro% ${sumPct.toFixed(2)} macroR$ ${sumAmt.toFixed(2)} microR$ ${microAmt.toFixed(2)}`);
  }
  console.log("rationales:", presentStrategicPortfolio({ profile, portfolio: p, investedAmount: 500000 }).rationales.length);
}
