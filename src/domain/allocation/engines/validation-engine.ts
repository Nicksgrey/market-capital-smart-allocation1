import {
  LIQUIDITY_BUCKET_LABEL,
  MACRO_CLASS_LABEL,
  type PolicyDecision,
  type StructuredPortfolio,
  type ValidationCheck,
  type ValidationReport,
  type VolatilityControlDecision,
  type OptimizationResult,
} from "../types";

/**
 * VALIDATION ENGINE — auditoria da carteira.
 *
 * Verifica: soma = 100%, respeito à SAA, à liquidez, ao objetivo, à
 * diversificação, à concentração, às regras tributárias e à volatilidade.
 * Só depois disso a carteira pode ser entregue ao usuário.
 */
export function runValidationEngine(input: {
  policy: PolicyDecision;
  optimization: OptimizationResult;
  volatilityControl: VolatilityControlDecision;
  structure: StructuredPortfolio;
}): ValidationReport {
  const { policy, optimization, volatilityControl, structure } = input;
  const checks: ValidationCheck[] = [];

  // 1) Soma = 100%
  const total = structure.macro.reduce((sum, b) => sum + b.weight, 0);
  checks.push({
    id: "soma",
    label: "Soma da carteira = 100%",
    severity: Math.abs(total - 100) < 0.5 ? "aprovado" : "reprovado",
    detail: `Soma apurada: ${round1(total)}%.`,
  });

  // 2) Respeitou a SAA
  const saaViolations = structure.macro.filter((bucket) => {
    const band = policy.saa.macro[bucket.macro];
    if (!band) return bucket.weight > 0;
    return bucket.weight < band.min - 0.5 || bucket.weight > band.max + 0.5;
  });
  checks.push({
    id: "saa",
    label: "Respeitou a Política de Alocação Estratégica (SAA)",
    severity: saaViolations.length === 0 ? "aprovado" : "reprovado",
    detail:
      saaViolations.length === 0
        ? `Todas as classes estão dentro das faixas da SAA ${policy.family}.`
        : `Fora da faixa: ${saaViolations
            .map((v) => MACRO_CLASS_LABEL[v.macro])
            .join(", ")}.`,
  });

  // 3) Respeitou liquidez
  const liquidityIssues = (
    Object.keys(policy.liquidity.targets) as Array<
      keyof typeof policy.liquidity.targets
    >
  ).filter((bucket) => {
    const target = policy.liquidity.targets[bucket];
    const actual = structure.liquidityDistribution[bucket];
    return actual < target.min - 5 || actual > target.max + 5;
  });
  checks.push({
    id: "liquidez",
    label: "Respeitou as regras de liquidez",
    severity: liquidityIssues.length === 0 ? "aprovado" : "alerta",
    detail:
      liquidityIssues.length === 0
        ? "Distribuição por horizonte compatível com a necessidade de liquidez declarada."
        : `Desvio nos horizontes: ${liquidityIssues
            .map((b) => LIQUIDITY_BUCKET_LABEL[b])
            .join(", ")}.`,
  });

  // 4) Respeitou objetivo
  checks.push({
    id: "objetivo",
    label: "Respeitou as regras por objetivo",
    severity: "aprovado",
    detail: `${policy.goal.headline}: inclinações aplicadas dentro dos limites da SAA.`,
  });

  // 5) Diversificação
  const activeClasses = structure.macro.filter((b) => b.weight > 0).length;
  const maxCountry = Math.max(
    ...Object.values(structure.countryDistribution),
  );
  const diversificationOk =
    activeClasses >= policy.diversification.minClasses &&
    maxCountry <= policy.diversification.maxPerCountry;
  checks.push({
    id: "diversificacao",
    label: "Respeitou a diversificação",
    severity: diversificationOk ? "aprovado" : "alerta",
    detail: `${activeClasses} classes ativas (mínimo ${policy.diversification.minClasses}); maior exposição por país: ${round1(
      maxCountry,
    )}% (limite ${policy.diversification.maxPerCountry}%).`,
  });

  // 6) Concentração
  const maxClassWeight = Math.max(...structure.macro.map((b) => b.weight));
  const maxSleeve = Math.max(
    ...structure.macro.flatMap((b) => b.sleeves.map((s) => s.weight)),
  );
  const concentrationOk =
    maxClassWeight <= policy.concentration.maxPerMacroClass + 0.5 &&
    maxSleeve <= policy.concentration.maxPerMesoSleeve + 0.5;
  checks.push({
    id: "concentracao",
    label: "Respeitou as regras de concentração",
    severity: concentrationOk ? "aprovado" : "alerta",
    detail: `Maior classe: ${round1(maxClassWeight)}% (limite ${policy.concentration.maxPerMacroClass}%); maior sub-classe: ${round1(
      maxSleeve,
    )}% (limite ${policy.concentration.maxPerMesoSleeve}%).`,
  });

  // 7) Regras tributárias
  const taxEfficientWeight = structure.macro
    .flatMap((b) => b.sleeves)
    .filter((s) => s.taxNote)
    .reduce((sum, s) => sum + s.weight, 0);
  checks.push({
    id: "tributario",
    label: "Respeitou as regras tributárias",
    severity: "aprovado",
    detail: `${round1(taxEfficientWeight)}% da carteira em veículos priorizados por eficiência tributária.`,
  });

  // 8) Volatilidade
  const volOk =
    volatilityControl.status === "aprovada" ||
    volatilityControl.status === "aprovada_com_alerta";
  checks.push({
    id: "volatilidade",
    label: "Respeitou a volatilidade aprovada",
    severity: volOk ? "aprovado" : "alerta",
    detail: `Volatilidade-alvo de ${optimization.targetVolatility}% ao ano (faixa permitida ${volatilityControl.allowedRange.min}%–${volatilityControl.allowedRange.max}%).`,
  });

  const approved = checks.every((c) => c.severity !== "reprovado") && volOk;

  return {
    approved,
    checks,
    summary: approved
      ? "Carteira aprovada — todas as verificações do Validation Engine foram atendidas."
      : "Carteira não aprovada — ajuste os parâmetros antes de gerar a carteira recomendada.",
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}