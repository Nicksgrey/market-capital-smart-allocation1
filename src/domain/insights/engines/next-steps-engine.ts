/**
 * CAMADA 4 — PRÓXIMOS PASSOS / Próximo Passo da Sua Estratégia.
 *
 * "Ele não é um módulo de vendas. Ele é um módulo de transição entre a
 * plataforma educacional e a consultoria personalizada."
 *
 * Identifica situações de complexidade que justificam orientação especializada
 * e devolve uma sugestão CONTEXTUAL, cuja mensagem depende do momento em que o
 * investidor está (diagnóstico ou stress test).
 */
import type { StrategicPortfolio } from "@/domain/allocation/types";
import type { InvestorProfileConsolidation } from "@/domain/profiling/types";

import {
  CONSULTING_SCHEDULING_URL,
  type DiagnosticReport,
  type EscalationOrigin,
  type EscalationSuggestion,
  type EscalationTrigger,
  type InteractionSignals,
  type NextStep,
  type StressTestReport,
} from "../types";

/** Opções de navegação oficiais do módulo. */
export const NEXT_STEPS: NextStep[] = [
  {
    action: "revisar_carteira",
    label: "Quero revisar minha carteira",
    description:
      "Retorna ao perfilamento para revisar suitability, descoberta, capacidade financeira e Risk Budget.",
    destination: "Camada 1 — Perfilamento",
  },
  {
    action: "alterar_volatilidade",
    label: "Quero alterar minha volatilidade",
    description:
      "Retorna ao Painel de Consolidação do Perfil para escolher outra volatilidade-alvo dentro do Risk Budget.",
    destination: "Painel de Consolidação do Perfil",
  },
  {
    action: "gerar_outra_estrategia",
    label: "Quero gerar outra estratégia",
    description: "Reconstrói toda a carteira percorrendo novamente os motores da Camada 2.",
    destination: "Camada 2 — Inteligência de Alocação",
  },
  {
    action: "analise_personalizada",
    label: "Quero uma análise personalizada",
    description:
      "Agenda uma conversa com a equipe da Market Capital para aprofundar a estratégia patrimonial.",
    destination: CONSULTING_SCHEDULING_URL,
  },
];

const MESSAGES: Record<EscalationOrigin, { message: string; ctaLabel: string }> = {
  diagnostico: {
    message:
      "Sua carteira está alinhada ao seu perfil e aos dados informados. Caso você queira validar essa estratégia considerando aspectos que uma plataforma educacional não consegue avaliar integralmente — como patrimônio completo, planejamento tributário, fluxo de caixa, sucessão patrimonial ou decisões familiares — você pode conversar com um especialista da Market Capital. Uma análise personalizada permite adaptar a estratégia às suas necessidades específicas.",
    ctaLabel: "Agendar uma Análise Estratégica",
  },
  stress_test: {
    message:
      "Sua carteira apresentou boa resiliência nos cenários simulados. Se você deseja construir um planejamento patrimonial mais completo — incluindo aposentadoria, sucessão, otimização tributária e acompanhamento contínuo — a Market Capital oferece um processo consultivo personalizado.",
    ctaLabel: "Conhecer a Consultoria",
  },
};

export function runNextStepsEngine(input: {
  profile: InvestorProfileConsolidation;
  portfolio: StrategicPortfolio;
  diagnostic: DiagnosticReport;
  stressTest: StressTestReport;
  signals: InteractionSignals;
  origin?: EscalationOrigin;
}): EscalationSuggestion {
  const { profile, portfolio, diagnostic, signals } = input;
  const triggers: EscalationTrigger[] = [];

  const netWorth = profile.discovery.netWorth ?? 0;
  if (netWorth >= 1_000_000) {
    triggers.push({
      id: "patrimonio_elevado",
      label: "Patrimônio elevado",
      reason:
        "Patrimônios relevantes envolvem decisões tributárias, societárias e sucessórias que extrapolam uma ferramenta parametrizada.",
    });
  }

  if (profile.discovery.mainGoal === "aposentadoria") {
    triggers.push({
      id: "aposentadoria",
      label: "Planejamento para aposentadoria",
      reason:
        "Planejar aposentadoria exige projeção de fluxo de caixa futuro e estratégia de retirada ao longo de décadas.",
    });
  }

  if (profile.discovery.mainGoal === "geracao_renda") {
    triggers.push({
      id: "geracao_de_renda",
      label: "Necessidade de geração de renda",
      reason:
        "Estratégias de renda dependem de calendário de pagamentos, tributação e necessidade real de caixa.",
    });
  }

  if (profile.discovery.dependents > 0 && (profile.discovery.horizonYears ?? 0) >= 10) {
    triggers.push({
      id: "objetivo_complexo",
      label: "Objetivos financeiros complexos",
      reason:
        "A combinação de dependentes e horizonte longo envolve decisões familiares e de sucessão patrimonial.",
    });
  }

  if ((portfolio.optimization.weights.exterior ?? 0) >= 20) {
    triggers.push({
      id: "investimentos_internacionais",
      label: "Investimentos internacionais",
      reason:
        "Exposição internacional relevante envolve custódia, câmbio e tributação específicos.",
    });
  }

  const sleeves = portfolio.structure.macro.reduce((n, bucket) => n + bucket.sleeves.length, 0);
  if (sleeves >= 10) {
    triggers.push({
      id: "carteira_sofisticada",
      label: "Carteira mais sofisticada",
      reason: `A carteira possui ${sleeves} sub-classes, o que exige acompanhamento e rebalanceamento disciplinado.`,
    });
  }

  if (signals.volatilityChanges >= 3) {
    triggers.push({
      id: "indecisao_de_volatilidade",
      label: "Indecisão quanto à volatilidade",
      reason:
        "Alterar a volatilidade diversas vezes sem decidir sugere insegurança sobre a tolerância real ao risco.",
    });
  }

  if (signals.goalSimulations >= 2) {
    triggers.push({
      id: "multiplas_simulacoes",
      label: "Múltiplas simulações de objetivo",
      reason: "Simular vários objetivos indica que a estratégia de vida ainda está sendo definida.",
    });
  }

  if (diagnostic.attentionPoints.length >= 3) {
    triggers.push({
      id: "pontos_de_atencao",
      label: "Pontos de atenção no diagnóstico",
      reason:
        "Vários pontos de atenção simultâneos costumam exigir análise individual do contexto completo.",
    });
  }

  const origin: EscalationOrigin = input.origin ?? "diagnostico";

  return {
    origin,
    message: MESSAGES[origin].message,
    ctaLabel: MESSAGES[origin].ctaLabel,
    ctaUrl: CONSULTING_SCHEDULING_URL,
    triggers,
  };
}

export function escalationMessageFor(origin: EscalationOrigin): {
  message: string;
  ctaLabel: string;
  ctaUrl: string;
} {
  return { ...MESSAGES[origin], ctaUrl: CONSULTING_SCHEDULING_URL };
}
