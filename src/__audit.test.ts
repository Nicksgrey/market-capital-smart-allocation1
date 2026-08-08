import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";
import { buildStrategicPortfolio } from "@/application/allocation/use-cases/build-strategic-portfolio";
import { presentStrategicPortfolio } from "@/application/portfolio/use-cases/present-strategic-portfolio";
import { EMPTY_DISCOVERY } from "@/application/profiling/dto/investor-profile.dto";
import { test } from "vitest";
test("audit", () => {

const cases = [
  { name: "conservador", behavioralScore: 15, horizonYears: 3, mainGoal: "preservacao", liquidityNeed: "alta" },
  { name: "moderado", behavioralScore: 50, horizonYears: 8, mainGoal: "crescimento", liquidityNeed: "media" },
  { name: "arrojado", behavioralScore: 90, horizonYears: 20, mainGoal: "crescimento", liquidityNeed: "baixa" },
] as const;

let fails = 0;
const ck = (label: string, ok: boolean, extra = "") => {
  if (!ok) fails++;
  console.log(`${ok ? "OK  " : "FAIL"} ${label} ${extra}`);
};

for (const c of cases) {
  const profile = consolidateInvestorProfile({
    behavioralScore: c.behavioralScore,
    discovery: {
      ...EMPTY_DISCOVERY,
      age: 35,
      netWorth: 1_000_000,
      monthlyIncome: 30_000,
      monthlyExpenses: 12_000,
      emergencyReserve: 100_000,
      dependents: 1,
      horizonYears: c.horizonYears,
      mainGoal: c.mainGoal as any,
      liquidityNeed: c.liquidityNeed as any,
    },
  });
  const p = buildStrategicPortfolio({ profile });
  if ("blocked" in p) { console.log(`${c.name}: BLOQUEADA`); continue; }
  const w = p.optimization.weights;
  const sum = Object.values(w).reduce((a, b) => a + b, 0);
  console.log(`\n=== ${c.name} (${profile.riskBudget.finalProfile}) vol=${p.optimization.targetVolatility}%`);
  console.log("pesos:", w, "soma=", Math.round(sum * 10) / 10);
  ck(`${c.name} soma macro = 100`, Math.abs(sum - 100) < 0.05, `${sum}`);
  ck(`${c.name} acoes 50/50`, w.acoes_brasil === w.exterior, `${w.acoes_brasil} vs ${w.exterior}`);
  ck(`${c.name} total acoes preservado`, Math.abs(p.optimization.equity.total - (w.acoes_brasil + w.exterior)) < 0.11);
  ck(`${c.name} equity.requestedTotal == total`, p.optimization.equity.requestedTotal === p.optimization.equity.total);
  // SAA bands
  for (const [k, band] of Object.entries(p.optimization.bands)) {
    const v = (w as any)[k];
    ck(`${c.name} banda ${k}`, v >= band!.min - 0.6 && v <= band!.max + 0.6, `${v} in [${band!.min},${band!.max}]`);
  }
  // meso closes macro
  for (const b of p.structure.macro) {
    const s = b.sleeves.reduce((a, x) => a + x.weight, 0);
    ck(`${c.name} meso fecha ${b.macro}`, Math.abs(s - b.weight) < 0.06, `${s} vs ${b.weight}`);
    const shares = b.sleeves.reduce((a, x) => a + x.shareOfClass, 0);
    ck(`${c.name} shareOfClass ~100 ${b.macro}`, Math.abs(shares - 100) < 1.2, `${shares}`);
    for (const sl of b.sleeves) {
      const m = sl.micro.reduce((a, x) => a + x.weight, 0);
      ck(`${c.name} micro fecha ${sl.id}`, Math.abs(m - sl.weight) < 0.11, `${m} vs ${sl.weight}`);
    }
  }
  const fiis = p.structure.macro.find((b) => b.macro === "fiis");
  if (fiis) {
    console.log("FIIs:", fiis.sleeves.map((s) => `${s.id}=${s.shareOfClass}%`).join(" "));
    const expect: Record<string, number> = { "fiis:fii_papel": 40, "fiis:fii_tijolo": 40, "fiis:fii_hibrido": 15, "fiis:fii_infra": 5 };
    for (const [id, exp] of Object.entries(expect)) {
      const s = fiis.sleeves.find((x) => x.id === id);
      ck(`${c.name} FII ${id}=${exp}%`, !!s && Math.abs(s.shareOfClass - exp) <= 1.5, `${s?.shareOfClass}`);
    }
  }
  console.log("validation:", p.validation.approved, p.validation.checks.filter(x => x.severity !== "aprovado").map(x => `${x.id}:${x.severity}`).join(", "));
  ck(`${c.name} validation aprovada`, p.validation.approved);

  for (const amount of [100_000, 500_000, 1_000_000, 12_345.67]) {
    const view = presentStrategicPortfolio({ profile, portfolio: p, investedAmount: amount });
    const macroSum = view.macro.reduce((a, x) => a + (x.amount ?? 0), 0);
    ck(`${c.name} R$ macro fecha ${amount}`, Math.abs(macroSum - amount) < 0.005, `${macroSum}`);
    for (const g of view.meso) {
      const s = g.sleeves.reduce((a, x) => a + (x.amount ?? 0), 0);
      ck(`${c.name} R$ meso fecha ${g.macro}@${amount}`, Math.abs(s - (g.amount ?? 0)) < 0.005, `${s} vs ${g.amount}`);
    }
    for (const g of view.micro) {
      const s = g.assets.reduce((a, x) => a + (x.amount ?? 0), 0);
      ck(`${c.name} R$ micro fecha ${g.sleeveId}@${amount}`, Math.abs(s - (g.amount ?? 0)) < 0.005, `${s} vs ${g.amount}`);
    }
  }
}
console.log(`\nFALHAS: ${fails}`);
});
