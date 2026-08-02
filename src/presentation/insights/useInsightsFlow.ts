import { useEffect, useMemo, useState } from "react";

import {
  buildStrategicPortfolio,
  isBlocked,
} from "@/application/allocation/use-cases/build-strategic-portfolio";
import { analyzePortfolio } from "@/application/insights/use-cases/analyze-portfolio";
import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";
import {
  INSIGHT_STAGES,
  type EscalationOrigin,
  type InsightStage,
  type InteractionSignals,
} from "@/domain/insights/types";
import { loadAllocationHandoff } from "@/presentation/shared/allocation-handoff";
import {
  loadProfilingHandoff,
  type ProfilingHandoff,
} from "@/presentation/shared/profiling-handoff";

/**
 * View-model da Camada 4. Não altera a alocação: reconstrói a carteira
 * aprovada pelos motores da Camada 2 e a submete aos módulos de diagnóstico,
 * stress test e próximos passos.
 */
export function useInsightsFlow() {
  const [hydrated, setHydrated] = useState(false);
  const [profilingHandoff, setProfilingHandoff] =
    useState<ProfilingHandoff | null>(null);
  const [requestedVolatility, setRequestedVolatility] = useState<number | null>(
    null,
  );
  const [educationalSimulation, setEducationalSimulation] = useState(false);
  const [stage, setStage] = useState<InsightStage>("diagnostico");
  const [signals, setSignals] = useState<InteractionSignals>({
    aiQuestions: 0,
    volatilityChanges: 0,
    goalSimulations: 0,
  });

  useEffect(() => {
    setProfilingHandoff(loadProfilingHandoff());
    const allocation = loadAllocationHandoff();
    if (allocation) {
      setRequestedVolatility(allocation.requestedVolatility);
      setEducationalSimulation(allocation.educationalSimulation);
    }
    setHydrated(true);
  }, []);

  const profile = useMemo(() => {
    if (!profilingHandoff) return null;
    return consolidateInvestorProfile({
      behavioralScore: profilingHandoff.behavioralScore,
      discovery: profilingHandoff.discovery,
      selectedVolatility: profilingHandoff.selectedVolatility,
    });
  }, [profilingHandoff]);

  const portfolio = useMemo(() => {
    if (!profile) return null;
    const result = buildStrategicPortfolio({
      profile,
      ...(requestedVolatility != null ? { requestedVolatility } : {}),
      educationalSimulation,
    });
    return isBlocked(result) ? null : result;
  }, [profile, requestedVolatility, educationalSimulation]);

  const escalationOrigin: EscalationOrigin =
    stage === "stress_test"
      ? "stress_test"
      : stage === "ia_financeira" || signals.aiQuestions > 0
        ? "ia_financeira"
        : "diagnostico";

  const analysis = useMemo(() => {
    if (!profile || !portfolio) return null;
    return analyzePortfolio({ profile, portfolio, signals, escalationOrigin });
  }, [profile, portfolio, signals, escalationOrigin]);

  const stageIndex = INSIGHT_STAGES.indexOf(stage);

  return {
    hydrated,
    profile,
    portfolio,
    analysis,
    stage,
    stages: INSIGHT_STAGES,
    setStage,
    signals,
    registerAiQuestion: () =>
      setSignals((current) => ({
        ...current,
        aiQuestions: current.aiQuestions + 1,
      })),
    goNext: () => {
      const next = INSIGHT_STAGES[stageIndex + 1];
      if (next) setStage(next);
    },
    goBack: () => {
      const previous = INSIGHT_STAGES[stageIndex - 1];
      if (previous) setStage(previous);
    },
    isFirstStage: stageIndex === 0,
    isLastStage: stageIndex === INSIGHT_STAGES.length - 1,
  };
}