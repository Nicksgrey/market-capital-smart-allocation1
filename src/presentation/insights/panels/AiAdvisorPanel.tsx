import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { StrategicPortfolio } from "@/domain/allocation/types";
import {
  AI_ADVISOR_CAPABILITIES,
  AI_ADVISOR_RULES,
  AI_SUGGESTED_QUESTIONS,
} from "@/domain/insights/ai-rules";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";
import { askFinancialAi } from "@/lib/insights.functions";

import { EducationalNotice, InsightCard } from "../InsightsUI";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Módulo 3 da Camada 4 — IA Financeira. */
export function AiAdvisorPanel({
  profile,
  portfolio,
  onQuestionAsked,
}: {
  profile: InvestorProfileConsolidation;
  portfolio: StrategicPortfolio;
  onQuestionAsked: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (trimmed.length < 3 || loading) return;
    setLoading(true);
    setError(null);
    const previous = history;
    setHistory([...previous, { role: "user", content: trimmed }]);
    setQuestion("");
    onQuestionAsked();

    try {
      const result = await askFinancialAi({
        data: {
          profile,
          portfolio,
          question: trimmed,
          history: previous.slice(-8),
        },
      });
      setHistory((current) => [
        ...current,
        { role: "assistant", content: result.answer },
      ]);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "A IA Financeira não pôde responder agora.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <InsightCard
      eyebrow="Módulo 3 · Camada 4"
      title="IA Financeira"
      description="A IA possui acesso ao contexto completo do investidor — perfil, objetivo, horizonte, volatilidade, Risk Budget, carteira, classes, setores e ativos — e explica cada decisão do Motor Paramétrico."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            O que a IA faz
          </p>
          <ul className="mt-2 space-y-1">
            {AI_ADVISOR_CAPABILITIES.map((item) => (
              <li key={item} className="text-xs text-muted-foreground">
                · {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Regras da IA
          </p>
          <ul className="mt-2 space-y-1">
            {AI_ADVISOR_RULES.map((item) => (
              <li key={item} className="text-xs text-muted-foreground">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {AI_SUGGESTED_QUESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={loading}
            onClick={() => void ask(suggestion)}
            className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {history.length > 0 ? (
        <ul className="space-y-3">
          {history.map((message, index) => (
            <li
              key={`${message.role}-${index}`}
              className={`rounded-lg border p-4 text-sm leading-relaxed ${
                message.role === "user"
                  ? "border-border/60 bg-secondary/30"
                  : "border-accent/40 bg-accent/5"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {message.role === "user" ? "Você" : "IA Financeira"}
              </p>
              <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">
          A IA Financeira está analisando sua carteira…
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
      >
        <Textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Pergunte sobre a sua carteira. Ex.: por que tenho essa participação em Renda Fixa?"
          rows={3}
          aria-label="Pergunta para a IA Financeira"
        />
        <Button type="submit" disabled={loading || question.trim().length < 3}>
          Perguntar à IA Financeira
        </Button>
      </form>

      <EducationalNotice>
        A IA explica o funcionamento do motor de alocação com finalidade
        educacional. Ela não promete rentabilidade, não garante resultados
        futuros e sinaliza sempre que uma resposta representa hipótese ou
        cenário.
      </EducationalNotice>
    </InsightCard>
  );
}