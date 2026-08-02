import { z } from "zod";

import type { StrategicPortfolio } from "@/domain/allocation/types";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";

/**
 * Validação da requisição da IA Financeira.
 *
 * Perfil e carteira são estruturas já produzidas pelas Camadas 1 e 2 e são
 * aceitas como objetos tipados; o que precisa de validação estrita é a
 * interação do usuário (pergunta e histórico).
 */
const objectOf = <T>() =>
  z.custom<T>((value) => typeof value === "object" && value !== null, {
    message: "Estrutura inválida.",
  });

export const aiAdvisorMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const aiAdvisorRequestSchema = z.object({
  profile: objectOf<InvestorProfileConsolidation>(),
  portfolio: objectOf<StrategicPortfolio>(),
  question: z.string().min(3).max(1000),
  history: z.array(aiAdvisorMessageSchema).max(12).default([]),
});

export type AiAdvisorRequest = z.infer<typeof aiAdvisorRequestSchema>;
export type AiAdvisorMessage = z.infer<typeof aiAdvisorMessageSchema>;