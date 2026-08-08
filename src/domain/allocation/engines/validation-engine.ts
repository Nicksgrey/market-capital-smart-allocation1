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
import { FII_INTERNAL_POLICY } from "../policies/fii-internal-rules";

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
    mandatory: true,
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
    mandatory: true,
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
    mandatory: false,
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
    mandatory: false,
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
    mandatory: false,
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
  // Limite obrigatório de concentração (com tolerância de arredondamento):
  // violação = erro bloqueante. Aproximação do limite (>=95% do teto) é
  // apenas concentração justificável → warning.
  const macroBreach = maxClassWeight > policy.concentration.maxPerMacroClass + 0.5;
  const sleeveBreach = maxSleeve > policy.concentration.maxPerMesoSleeve + 0.5;
  const concentrationBreach = macroBreach || sleeveBreach;
  const concentrationTight =
    !concentrationBreach &&
    (maxClassWeight >= policy.concentration.maxPerMacroClass * 0.95 ||
      maxSleeve >= policy.concentration.maxPerMesoSleeve * 0.95);
  const concentrationDetail = `Maior classe: ${round1(maxClassWeight)}% (limite ${policy.concentration.maxPerMacroClass}%); maior sub-classe: ${round1(
    maxSleeve,
  )}% (limite ${policy.concentration.maxPerMesoSleeve}%).`;
  checks.push({
    id: "concentracao",
    label: "Respeitou as regras obrigatórias de concentração",
    mandatory: true,
    severity: concentrationBreach ? "reprovado" : "aprovado",
    detail: concentrationBreach
      ? `Limite obrigatório de concentração violado. ${concentrationDetail}`
      : concentrationDetail,
  });
  if (concentrationTight) {
    checks.push({
      id: "concentracao_justificavel",
      label: "Concentração próxima do limite (justificável)",
      mandatory: false,
      severity: "alerta",
      detail: `A carteira opera próxima do teto permitido de concentração, o que é aceitável para este perfil, mas merece acompanhamento. ${concentrationDetail}`,
    });
  }

  // 7) Regras tributárias
  const taxEfficientWeight = structure.macro
    .flatMap((b) => b.sleeves)
    .filter((s) => s.taxNote)
    .reduce((sum, s) => sum + s.weight, 0);
  checks.push({
    id: "tributario",
    label: "Respeitou as regras tributárias",
    mandatory: false,
    severity: taxEfficientWeight > 0 ? "aprovado" : "alerta",
    detail: `${round1(taxEfficientWeight)}% da carteira em veículos priorizados por eficiência tributária.`,
  });

  // 8) Volatilidade máxima permitida — regra obrigatória.
  const volBlocking =
    volatilityControl.status === "acima_do_permitido" ||
    volatilityControl.status === "bloqueada";
  checks.push({
    id: "volatilidade",
    label: "Respeitou a volatilidade máxima permitida",
    mandatory: true,
    severity: volBlocking ? "reprovado" : "aprovado",
    detail: `Volatilidade-alvo de ${optimization.targetVolatility}% ao ano (faixa permitida ${volatilityControl.allowedRange.min}%–${volatilityControl.allowedRange.max}%).`,
  });
  if (volatilityControl.status === "aprovada_com_alerta") {
    checks.push({
      id: "volatilidade_tradeoff",
      label: "Trade-off entre volatilidade e diversificação",
      mandatory: false,
      severity: "alerta",
      detail: `A volatilidade escolhida (${volatilityControl.approvedVolatility}%) está dentro da faixa permitida, mas distante da recomendada (${volatilityControl.recommendedVolatility}%), o que altera o equilíbrio entre risco e diversificação.`,
    });
  }

  // 9) Classe Ações: Brasil = 50% e Exterior = 50% do peso total da classe.
  const brasil = weightOf(structure, "acoes_brasil");
  const exterior = weightOf(structure, "exterior");
  const equityTotal = round1(brasil + exterior);
  const equitySplitOk =
    equityTotal === 0
      ? true
      : optimization.equity.feasible &&
        Math.abs(brasil - equityTotal / 2) <= 0.55 &&
        Math.abs(exterior - equityTotal / 2) <= 0.55;
  checks.push({
    id: "acoes_50_50",
    label: "Classe Ações dividida 50% Brasil / 50% Exterior",
    mandatory: true,
    severity: equitySplitOk ? "aprovado" : "reprovado",
    detail:
      equityTotal === 0
        ? "A carteira não possui exposição à classe Ações e nenhuma exposição foi criada artificialmente."
        : `Classe Ações: ${round1(equityTotal)}% da carteira — Ações Brasil ${round1(brasil)}% e Ações Exterior ${round1(exterior)}%. FIIs e FI-Infra não entram neste cálculo.${
            optimization.equity.feasible ? "" : " " + optimization.equity.note
          }`,
  });

  // 10) Política interna da classe de FIIs (40 Papel / 40 Tijolo / 15 Híbridos / 5 FI-Infra).
  const fiis = structure.macro.find((bucket) => bucket.macro === "fiis");
  const fiiDeviations = fiis
    ? FII_INTERNAL_POLICY.filter((rule) => {
        const sleeve = fiis.sleeves.find((s) => s.id === `fiis:${rule.id}`);
        if (!sleeve) return true;
        return Math.abs(sleeve.shareOfClass - rule.shareOfClass) > 1.5;
      })
    : [];
  checks.push({
    id: "fiis_distribuicao",
    label: "Distribuição interna de FIIs (40 Papel / 40 Tijolo / 15 Híbridos / 5 FI-Infra)",
    mandatory: true,
    severity: !fiis || fiiDeviations.length === 0 ? "aprovado" : "reprovado",
    detail: !fiis
      ? "A carteira não possui Fundos Imobiliários e nenhuma exposição foi criada artificialmente."
      : fiiDeviations.length === 0
        ? `FIIs em ${round1(fiis.weight)}% da carteira, distribuídos em ${fiis.sleeves
            .map((s) => `${s.label} ${round1(s.shareOfClass)}% da classe (${round1(s.weight)}% da carteira)`)
            .join(", ")}.`
        : `Desvio na política interna de FIIs: ${fiiDeviations
            .map((rule) => `${rule.label} deveria representar ${rule.shareOfClass}% da classe`)
            .join("; ")}.`,
  });

  // ERRO BLOQUEANTE = violação de regra obrigatória. WARNING = ponto de
  // atenção não bloqueante, que não reprova a carteira.
  const blockingErrors = checks.filter(
    (c) => c.mandatory && c.severity === "reprovado",
  );
  const warnings = checks.filter(
    (c) => !c.mandatory && c.severity === "alerta",
  );
  const approved = blockingErrors.length === 0;

  return {
    approved,
    checks,
    blockingErrors,
    warnings,
    summary: approved
      ? warnings.length === 0
        ? "Carteira aprovada — todas as regras obrigatórias e de qualidade foram atendidas."
        : `Carteira aprovada — nenhuma regra obrigatória foi violada. Há ${warnings.length} ponto(s) de atenção não bloqueante(s), tratados pelo Diagnóstico Inteligente.`
      : `Carteira reprovada — ${blockingErrors.length} erro(s) bloqueante(s) por violação de regra obrigatória. Ajuste os parâmetros antes de gerar a carteira recomendada.`,
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function weightOf(
  structure: StructuredPortfolio,
  macro: "acoes_brasil" | "exterior",
): number {
  return structure.macro.find((bucket) => bucket.macro === macro)?.weight ?? 0;
}