import { useMemo, useState } from "react";

import {
  EMPTY_DISCOVERY,
  isDiscoveryComplete,
} from "@/application/profiling/dto/investor-profile.dto";
import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";
import { PROFILING_STEPS } from "@/domain/profiling/types";
import type {
  DiscoveryAnswers,
  ProfilingStep,
} from "@/domain/profiling/types";

/**
 * View-model do fluxo da Camada 1. Mantém o estado das etapas e delega
 * todo o cálculo ao caso de uso do domínio.
 */
export function useProfilingFlow() {
  const [step, setStep] = useState<ProfilingStep>("suitability");
  const [behavioralScore, setBehavioralScore] = useState<number | null>(null);
  const [discovery, setDiscovery] = useState<DiscoveryAnswers>(EMPTY_DISCOVERY);
  const [selectedVolatility, setSelectedVolatility] = useState<number | null>(
    null,
  );

  const discoveryComplete = isDiscoveryComplete(discovery);

  const consolidation = useMemo(() => {
    if (behavioralScore == null || !discoveryComplete) return null;
    return consolidateInvestorProfile({
      behavioralScore,
      discovery,
      ...(selectedVolatility != null
        ? { selectedVolatility }
        : {}),
    });
  }, [behavioralScore, discovery, discoveryComplete, selectedVolatility]);

  const stepIndex = PROFILING_STEPS.indexOf(step);

  function goTo(next: ProfilingStep) {
    setStep(next);
  }

  function goNext() {
    const next = PROFILING_STEPS[stepIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const previous = PROFILING_STEPS[stepIndex - 1];
    if (previous) setStep(previous);
  }

  function updateDiscovery(patch: Partial<DiscoveryAnswers>) {
    setDiscovery((current) => ({ ...current, ...patch }));
  }

  function reset() {
    setStep("suitability");
    setBehavioralScore(null);
    setDiscovery(EMPTY_DISCOVERY);
    setSelectedVolatility(null);
  }

  return {
    step,
    stepIndex,
    steps: PROFILING_STEPS,
    behavioralScore,
    setBehavioralScore,
    discovery,
    updateDiscovery,
    discoveryComplete,
    selectedVolatility,
    setSelectedVolatility,
    consolidation,
    goTo,
    goNext,
    goBack,
    reset,
  };
}