import type { VolatilityControlDecision } from "../types";
import { saaPolicyOf } from "../policies/saa-policy";
import type { PolicyFamily } from "@/domain/profiling/types";

/**
 * MOTOR DE CONTROLE DA VOLATILIDADE — governança do risco.
 *
 * Responde: "A volatilidade escolhida pelo usuário pode ser utilizada para
 * construir essa carteira?" Faz a ponte entre o Risk Budget e o Optimization
 * Engine, aplicando as quatro regras oficiais:
 *
 * Regra 1 — dentro da faixa → prosseguir.
 * Regra 2 — próximo do limite → prosseguir com alerta.
 * Regra 3 — acima da faixa → não calcula imediatamente; explica e oferece opções.
 * Regra 4 — muito acima → bloquear e exigir nova avaliação de perfil.
 */

/** Margem (p.p.) a partir do topo da faixa considerada "próxima do limite". */
const NEAR_LIMIT_MARGIN = 1;
/** Excesso (p.p.) acima do topo que caracteriza "muito acima". */
const HARD_BLOCK_EXCESS = 4;

export function runVolatilityControl(input: {
  policyFamily: PolicyFamily;
  recommendedVolatility: number;
  requestedVolatility: number;
  /** Quando true, permite calcular a carteira apenas para fins educacionais. */
  educationalSimulation?: boolean;
}): VolatilityControlDecision {
  const allowedRange = saaPolicyOf(input.policyFamily).volatility;
  const requested = round1(input.requestedVolatility);
  const recommended = round1(input.recommendedVolatility);
  const educational = input.educationalSimulation === true;

  // Regra 4 — muito acima do permitido: bloqueia.
  if (requested > allowedRange.max + HARD_BLOCK_EXCESS) {
    return {
      rule: 4,
      status: "bloqueada",
      canOptimize: false,
      educationalOnly: false,
      requestedVolatility: requested,
      approvedVolatility: recommended,
      recommendedVolatility: recommended,
      allowedRange,
      title: "Configuração incompatível com o seu perfil",
      message:
        "Essa configuração não é compatível com os dados informados no seu perfil. Para acessar esse nível de volatilidade será necessário atualizar seu perfil e realizar uma nova avaliação.",
      options: ["Revisar meu perfil", "Voltar para a volatilidade recomendada"],
    };
  }

  // Regra 3 — acima da faixa: explica antes de calcular.
  if (requested > allowedRange.max) {
    return {
      rule: 3,
      status: "acima_do_permitido",
      canOptimize: educational,
      educationalOnly: educational,
      requestedVolatility: requested,
      approvedVolatility: requested,
      recommendedVolatility: recommended,
      allowedRange,
      title: "Volatilidade acima da recomendação",
      message:
        "A volatilidade escolhida ultrapassa a recomendação calculada pelo seu Perfil Final e pelo seu Risk Budget.",
      options: [
        "Voltar para a recomendada",
        "Revisar seu perfil",
        "Simular essa carteira apenas para fins educacionais",
      ],
    };
  }

  // Regra 2 — próximo do limite: alerta, mas prossegue.
  if (requested >= allowedRange.max - NEAR_LIMIT_MARGIN) {
    return {
      rule: 2,
      status: "aprovada_com_alerta",
      canOptimize: true,
      educationalOnly: false,
      requestedVolatility: requested,
      approvedVolatility: requested,
      recommendedVolatility: recommended,
      allowedRange,
      title: "Volatilidade próxima do limite do seu perfil",
      message:
        "Você está escolhendo uma volatilidade próxima ao limite recomendado para seu perfil. Essa configuração aumenta a participação em ativos de maior risco e poderá gerar oscilações mais intensas na carteira.",
      options: ["Prosseguir com a construção", "Voltar para a recomendada"],
    };
  }

  // Regra 1 — dentro da faixa (inclui abaixo do piso, que é elevado ao mínimo).
  const approved = Math.max(requested, allowedRange.min);
  return {
    rule: 1,
    status: "aprovada",
    canOptimize: true,
    educationalOnly: false,
    requestedVolatility: requested,
    approvedVolatility: round1(approved),
    recommendedVolatility: recommended,
    allowedRange,
    title: "Volatilidade aprovada",
    message:
      approved === requested
        ? `A volatilidade de ${requested}% ao ano está dentro da faixa permitida para o seu Perfil Final (${allowedRange.min}%–${allowedRange.max}%). O Optimization Engine pode calcular a carteira.`
        : `A volatilidade informada está abaixo do piso da faixa do seu perfil e foi ajustada para ${approved}% ao ano, o mínimo previsto na Política de Alocação Estratégica.`,
    options: ["Prosseguir com a construção", "Simular outra volatilidade"],
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}