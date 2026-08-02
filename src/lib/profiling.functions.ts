import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  toDomain,
  toPersistence,
} from "@/infrastructure/profiling/investor-profile.mapper";
import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";

const discoverySchema = z.object({
  age: z.number().int().min(0).max(120).nullable(),
  netWorth: z.number().min(0).nullable(),
  monthlyIncome: z.number().min(0).nullable(),
  monthlyExpenses: z.number().min(0).nullable(),
  emergencyReserve: z
    .enum(["nenhuma", "abaixo_6_meses", "entre_6_e_12_meses", "acima_12_meses"])
    .nullable(),
  isRetired: z.boolean(),
  dependents: z.number().int().min(0).max(20),
  horizonYears: z.number().int().min(0).max(80).nullable(),
  mainGoal: z
    .enum([
      "compra_imovel",
      "reserva_seguranca",
      "geracao_renda",
      "crescimento_patrimonial",
      "aposentadoria",
    ])
    .nullable(),
  liquidityNeed: z.enum(["alta", "media", "baixa"]).nullable(),
});

const profilingInputSchema = z.object({
  behavioralScore: z.number().min(0).max(100),
  discovery: discoverySchema,
  selectedVolatility: z.number().min(0).max(30).optional(),
});

/** Perfilamento mais recente do usuário autenticado (Camada 1). */
export const getMyInvestorProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("map_investor_profiles")
      .select("*")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? toDomain(data) : null;
  });

/**
 * Persiste a consolidação da Camada 1 e registra um snapshot versionado.
 * O cálculo é recomputado no servidor pelo caso de uso do domínio — o cliente
 * nunca envia scores prontos.
 */
export const saveInvestorProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => profilingInputSchema.parse(data))
  .handler(async ({ context, data }) => {
    const consolidation = consolidateInvestorProfile(data);
    const payload = toPersistence(context.userId, consolidation);

    const { data: existing, error: findError } = await context.supabase
      .from("map_investor_profiles")
      .select("id")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (findError) throw new Error(findError.message);

    const saved = existing
      ? await context.supabase
          .from("map_investor_profiles")
          .update(payload)
          .eq("id", existing.id)
          .select("*")
          .single()
      : await context.supabase
          .from("map_investor_profiles")
          .insert(payload)
          .select("*")
          .single();

    if (saved.error) throw new Error(saved.error.message);

    const { count } = await context.supabase
      .from("map_profile_snapshots")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", saved.data.id);

    const { error: snapshotError } = await context.supabase
      .from("map_profile_snapshots")
      .insert({
        profile_id: saved.data.id,
        user_id: context.userId,
        version: (count ?? 0) + 1,
        behavioral_score: consolidation.behavioral.score,
        behavioral_profile: consolidation.behavioral.profile,
        financial_capacity_score: consolidation.financialCapacity.score,
        financial_capacity_label: consolidation.financialCapacity.label,
        risk_budget_score: consolidation.riskBudget.riskBudgetScore,
        final_profile: consolidation.riskBudget.finalProfile,
        recommended_volatility: consolidation.volatility.recommended,
        selected_volatility: consolidation.volatility.selected,
        payload: consolidation as unknown as Record<string, unknown>,
      });

    if (snapshotError) throw new Error(snapshotError.message);

    return { profile: toDomain(saved.data), consolidation };
  });