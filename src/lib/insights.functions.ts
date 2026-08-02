/**
 * CAMADA 4 — IA FINANCEIRA (server function).
 *
 * A IA recebe o contexto completo do investidor e responde de forma didática,
 * respeitando integralmente as Regras da IA do documento oficial. Ela nunca
 * altera a carteira — apenas explica as decisões do Motor Paramétrico.
 */
import { createServerFn } from "@tanstack/react-start";

import { AI_SYSTEM_RULES } from "@/domain/insights/ai-rules";
import { aiAdvisorRequestSchema } from "@/application/insights/validation";
import { buildAiAdvisorContext } from "@/application/insights/use-cases/build-ai-context";

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash";

export const askFinancialAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => aiAdvisorRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("LOVABLE_API_KEY não está configurada.");

    const context = buildAiAdvisorContext({
      profile: data.profile,
      portfolio: data.portfolio,
    });

    const messages = [
      { role: "system", content: AI_SYSTEM_RULES },
      {
        role: "system",
        content: `Contexto completo do investidor e da carteira aprovada (JSON):\n${JSON.stringify(context)}`,
      },
      ...data.history.map((item) => ({
        role: item.role,
        content: item.content,
      })),
      { role: "user", content: data.question },
    ];

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, messages }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`IA Financeira falhou [${response.status}]: ${errorBody}`);
      if (response.status === 429) {
        throw new Error(
          "Muitas perguntas em sequência. Aguarde alguns instantes e tente novamente.",
        );
      }
      if (response.status === 402) {
        throw new Error(
          "Os créditos de IA do workspace foram esgotados. Recarregue para continuar usando a IA Financeira.",
        );
      }
      throw new Error(`A IA Financeira não pôde responder [${response.status}].`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = payload.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("A IA Financeira retornou uma resposta vazia.");

    return { answer };
  });