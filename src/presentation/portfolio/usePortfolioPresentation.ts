import { useEffect, useMemo, useState } from "react";

import {
  buildStrategicPortfolio,
  isBlocked,
} from "@/application/allocation/use-cases/build-strategic-portfolio";
import { consolidateInvestorProfile } from "@/application/profiling/use-cases/consolidate-investor-profile";
import { presentStrategicPortfolio } from "@/application/portfolio/use-cases/present-strategic-portfolio";
import { PORTFOLIO_LEVELS, type PortfolioLevel } from "@/domain/portfolio/types";
import { loadAllocationHandoff } from "@/presentation/shared/allocation-handoff";
import {
  loadInvestedAmount,
  saveInvestedAmount,
} from "@/presentation/shared/invested-amount";
import {
  loadProfilingHandoff,
  type ProfilingHandoff,
} from "@/presentation/shared/profiling-handoff";

/**
 * View-model da Camada 3. Nenhum cálculo próprio: reconstrói a carteira pelos
 * motores da Camada 2 e apenas organiza os níveis de exibição.
 */
export function usePortfolioPresentation() {
  const [hydrated, setHydrated] = useState(false);
  const [profilingHandoff, setProfilingHandoff] =
    useState<ProfilingHandoff | null>(null);
  const [requestedVolatility, setRequestedVolatility] = useState<number | null>(
    null,
  );
  const [educationalSimulation, setEducationalSimulation] = useState(false);
  const [level, setLevel] = useState<PortfolioLevel>("macro");
  const [investedAmount, setInvestedAmountState] = useState<number | null>(null);
  const [amountConfirmed, setAmountConfirmed] = useState(false);

  useEffect(() => {
    setProfilingHandoff(loadProfilingHandoff());
    const allocation = loadAllocationHandoff();
    if (allocation) {
      setRequestedVolatility(allocation.requestedVolatility);
      setEducationalSimulation(allocation.educationalSimulation);
    }
    const stored = loadInvestedAmount();
    if (stored != null) {
      setInvestedAmountState(stored);
      setAmountConfirmed(true);
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

  const presentation = useMemo(() => {
    if (!profile || !portfolio) return null;
    return presentStrategicPortfolio({ profile, portfolio, investedAmount });
  }, [profile, portfolio, investedAmount]);

  const levelIndex = PORTFOLIO_LEVELS.indexOf(level);

  return {
    hydrated,
    profile,
    presentation,
    investedAmount,
    amountConfirmed,
    setInvestedAmount: (value: number | null) => {
      setInvestedAmountState(value);
      saveInvestedAmount(value);
    },
    confirmAmount: () => setAmountConfirmed(true),
    level,
    levels: PORTFOLIO_LEVELS,
    setLevel,
    goNext: () => {
      const next = PORTFOLIO_LEVELS[levelIndex + 1];
      if (next) setLevel(next);
    },
    goBack: () => {
      const previous = PORTFOLIO_LEVELS[levelIndex - 1];
      if (previous) setLevel(previous);
    },
    isLastLevel: levelIndex === PORTFOLIO_LEVELS.length - 1,
  };
}