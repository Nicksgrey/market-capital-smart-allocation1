import { runPolicyEngine } from "@/domain/allocation/engines/policy-engine";
import { runVolatilityControl } from "@/domain/allocation/engines/volatility-control-engine";
import { runOptimizationEngine } from "@/domain/allocation/engines/optimization-engine";
import { runAllocationEngine } from "@/domain/allocation/engines/allocation-engine";
import { runValidationEngine } from "@/domain/allocation/engines/validation-engine";
import type { StrategicPortfolio } from "@/domain/allocation/types";

import type {
  BuildStrategicPortfolioInput,
} from "../dto/strategic-portfolio.dto";

/**
 * CAMADA 2 — orquestração oficial do Motor Paramétrico:
 * Policy Engine → Controle da Volatilidade → Optimization Engine →
 * Allocation Engine → Validation Engine.
 *
 * Quando o Controle da Volatilidade não autoriza o cálculo (Regras 3 e 4), a
 * carteira não é calculada: retorna-se somente a política e a decisão de
 * volatilidade para que a interface explique ao usuário.
 */
export function buildStrategicPortfolio(
  input: BuildStrategicPortfolioInput,
): StrategicPortfolio | { policy: ReturnType<typeof runPolicyEngine>; volatilityControl: ReturnType<typeof runVolatilityControl>; blocked: true } {
  const policy = runPolicyEngine(input.profile);

  const requested =
    input.requestedVolatility ?? input.profile.volatility.selected;

  const volatilityControl = runVolatilityControl({
    policyFamily: policy.family,
    recommendedVolatility: input.profile.volatility.recommended,
    requestedVolatility: requested,
    ...(input.educationalSimulation != null
      ? { educationalSimulation: input.educationalSimulation }
      : {}),
  });

  if (!volatilityControl.canOptimize) {
    return { policy, volatilityControl, blocked: true };
  }

  const optimization = runOptimizationEngine({
    policy,
    approvedVolatility: volatilityControl.approvedVolatility,
  });

  const structure = runAllocationEngine({ policy, optimization });

  const validation = runValidationEngine({
    policy,
    optimization,
    volatilityControl,
    structure,
  });

  return {
    policy,
    volatilityControl,
    optimization,
    structure,
    validation,
    educationalOnly: volatilityControl.educationalOnly,
  };
}

export function isBlocked(
  result: ReturnType<typeof buildStrategicPortfolio>,
): result is {
  policy: ReturnType<typeof runPolicyEngine>;
  volatilityControl: ReturnType<typeof runVolatilityControl>;
  blocked: true;
} {
  return "blocked" in result;
}