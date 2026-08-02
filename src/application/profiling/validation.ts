import { z } from "zod";

export const discoverySchema = z.object({
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

export const profilingInputSchema = z.object({
  behavioralScore: z.number().min(0).max(100),
  discovery: discoverySchema,
  selectedVolatility: z.number().min(0).max(30).optional(),
});

export type ValidatedProfilingInput = z.infer<typeof profilingInputSchema>;