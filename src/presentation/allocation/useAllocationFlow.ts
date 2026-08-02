import { useEffect, useMemo, useState } from "react";

import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";
import {
  buildStrategicPortfolio,
  isBlocked,
} from "@/application/allocation/use-cases/build-strategic-portfolio";
import { simulateVolatility } from "@/application/allocation/use-cases/simulate-volatility";
import { ALLOCATION_STAGES, type AllocationStage } from "@/domain/allocation/types";
import {
  loadProfilingHandoff,
  type ProfilingHandoff,
} from "@/presentation/shared/profiling-handoff";

/**
 * View-model da Camada 2. Não contém regra de negócio: apenas estado de
 * navegação entre os motores e delegação aos casos de uso.
 */
export function useAllocationFlow() {
  const [handoff, setHandoff] = useState<ProfilingHandoff | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<AllocationStage>("policy");
  const [requestedVolatility, setRequestedVolatility] = useState<number | null>(
    null,
  );
  const [educationalSimulation, setEducationalSimulation] = useState(false);
  const [simulatedVolatility, setSimulatedVolatility] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setHandoff(loadProfilingHandoff());
    setHydrated(true);
  }, []);

  const profile = useMemo(() => {
    if (!handoff) return null;
    return consolidateInvestorProfile({
      behavioralScore: handoff.behavioralScore,
      discovery: handoff.discovery,
      selectedVolatility: handoff.selectedVolatility,
    });
  }, [handoff]);

  const result = useMemo(() => {
    if (!profile) return null;
    return buildStrategicPortfolio({
      profile,
      ...(requestedVolatility != null ? { requestedVolatility } : {}),
      educationalSimulation,
    });
  }, [profile, requestedVolatility, educationalSimulation]);

  const blocked = result != null && isBlocked(result);
  const portfolio = result != null && !isBlocked(result) ? result : null;
  const policy = result?.policy ?? null;
  const volatilityControl = result?.volatilityControl ?? null;

  const simulation = useMemo(() => {
    if (!profile || simulatedVolatility == null) return null;
    return simulateVolatility({ profile, simulatedVolatility });
  }, [profile, simulatedVolatility]);

  const stageIndex = ALLOCATION_STAGES.indexOf(stage);

  return {
    hydrated,
    handoff,
    profile,
    stage,
    stageIndex,
    stages: ALLOCATION_STAGES,
    goTo: setStage,
    goNext: () => {
      const next = ALLOCATION_STAGES[stageIndex + 1];
      if (next) setStage(next);
    },
    goBack: () => {
      const previous = ALLOCATION_STAGES[stageIndex - 1];
      if (previous) setStage(previous);
    },
    requestedVolatility:
      requestedVolatility ?? profile?.volatility.selected ?? null,
    setRequestedVolatility,
    resetVolatility: () => {
      setRequestedVolatility(null);
      setEducationalSimulation(false);
    },
    educationalSimulation,
    enableEducationalSimulation: () => setEducationalSimulation(true),
    simulatedVolatility,
    setSimulatedVolatility,
    simulation,
    blocked,
    policy,
    volatilityControl,
    portfolio,
  };
}