import type { Database } from "@/integrations/supabase/types";
import type { InvestorProfile } from "@/domain/profiling/repositories/investor-profile-repository";
import type {
  DiscoveryAnswers,
  InvestorProfileConsolidation,
  ProfilingStep,
} from "@/domain/profiling/types";

export type InvestorProfileRow =
  Database["public"]["Tables"]["map_investor_profiles"]["Row"];
export type InvestorProfileInsert =
  Database["public"]["Tables"]["map_investor_profiles"]["Insert"];

/** Row do Supabase → agregado de domínio. */
export function toDomain(row: InvestorProfileRow): InvestorProfile {
  const discovery: DiscoveryAnswers = {
    age: row.age,
    netWorth: row.net_worth,
    monthlyIncome: row.monthly_income,
    monthlyExpenses: row.monthly_expenses,
    emergencyReserve:
      (row.emergency_reserve_months as DiscoveryAnswers["emergencyReserve"]) ??
      null,
    isRetired: row.is_retired,
    dependents: row.dependents,
    horizonYears: row.horizon_years,
    mainGoal: (row.main_goal as DiscoveryAnswers["mainGoal"]) ?? null,
    liquidityNeed:
      (row.liquidity_need as DiscoveryAnswers["liquidityNeed"]) ?? null,
  };

  return {
    id: row.id,
    userId: row.user_id,
    discovery,
    behavioralScore: row.behavioral_score,
    behavioralProfile: row.behavioral_profile,
    financialCapacityScore: row.financial_capacity_score,
    financialCapacityLabel: row.financial_capacity_label,
    riskBudgetScore: row.risk_budget_score,
    finalProfile: row.final_profile,
    recommendedVolatility: row.recommended_volatility,
    selectedVolatility: row.selected_volatility,
    volatilityRangeMin: row.volatility_range_min,
    volatilityRangeMax: row.volatility_range_max,
    volatilityStatus: row.volatility_status,
    status: (row.status as InvestorProfile["status"]) ?? "em_andamento",
    currentStep: (row.current_step as ProfilingStep) ?? "suitability",
    diagnosis: row.diagnosis,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Consolidação da Camada 1 → payload de persistência. */
export function toPersistence(
  userId: string,
  consolidation: InvestorProfileConsolidation,
): InvestorProfileInsert {
  const { discovery, behavioral, financialCapacity, riskBudget, volatility } =
    consolidation;

  return {
    user_id: userId,
    age: discovery.age,
    net_worth: discovery.netWorth,
    monthly_income: discovery.monthlyIncome,
    monthly_expenses: discovery.monthlyExpenses,
    emergency_reserve_months: discovery.emergencyReserve,
    is_retired: discovery.isRetired,
    dependents: discovery.dependents,
    horizon_years: discovery.horizonYears,
    main_goal: discovery.mainGoal,
    liquidity_need: discovery.liquidityNeed,
    behavioral_score: behavioral.score,
    behavioral_profile: behavioral.profile,
    financial_capacity_score: financialCapacity.score,
    financial_capacity_label: financialCapacity.label,
    risk_budget_score: riskBudget.riskBudgetScore,
    final_profile: riskBudget.finalProfile,
    recommended_volatility: volatility.recommended,
    selected_volatility: volatility.selected,
    volatility_range_min: volatility.min,
    volatility_range_max: volatility.max,
    volatility_status: volatility.status,
    diagnosis: consolidation.diagnosis,
    status: volatility.status === "acima_do_permitido" ? "em_andamento" : "validado",
    current_step: "consolidacao",
    completed_at:
      volatility.status === "acima_do_permitido" ? null : new Date().toISOString(),
  };
}