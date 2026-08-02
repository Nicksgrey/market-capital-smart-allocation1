import {
  LIQUIDITY_BUCKET_LABEL,
  MACRO_CLASS_LABEL,
  MACRO_CLASS_ORDER,
  type Country,
  type LiquidityBucket,
  type MacroBucket,
  type MacroClass,
  type MesoSleeve,
  type MicroAsset,
  type OptimizationResult,
  type PolicyDecision,
  type StructuredPortfolio,
} from "../types";

/**
 * ALLOCATION ENGINE — Macro → Meso → Micro.
 *
 * Recebe os pesos macro do Optimization Engine e os transforma em uma carteira
 * estruturada, distribuindo cada classe entre sleeves (meso) conforme as
 * regras de liquidez e de eficiência tributária, e por fim indicando os ativos
 * representativos (micro).
 */

interface SleeveTemplate {
  id: string;
  label: string;
  liquidityBucket: LiquidityBucket;
  country: Country;
  /** Peso relativo base dentro da classe macro. */
  base: number;
  /** Ajuste relativo quando a necessidade de liquidez é alta. */
  shortTermBias: number;
  /** Ajuste relativo quando a eficiência tributária é priorizada. */
  taxBias: number;
  taxNote?: string;
  micro: Array<{ name: string; description: string }>;
}

const TEMPLATES: Record<MacroClass, SleeveTemplate[]> = {
  renda_fixa: [
    {
      id: "tesouro_selic",
      label: "Tesouro Selic",
      liquidityBucket: "d0",
      country: "brasil",
      base: 26,
      shortTermBias: 14,
      taxBias: -2,
      micro: [
        { name: "Tesouro Selic 2029", description: "Liquidez diária, pós-fixado" },
        { name: "Tesouro Selic 2031", description: "Colchão de liquidez" },
      ],
    },
    {
      id: "tesouro_ipca",
      label: "Tesouro IPCA+",
      liquidityBucket: "acima_cinco_anos",
      country: "brasil",
      base: 30,
      shortTermBias: -12,
      taxBias: 4,
      taxNote: "Proteção inflacionária de longo prazo",
      micro: [
        { name: "Tesouro IPCA+ 2035", description: "Juro real de longo prazo" },
        { name: "Tesouro IPCA+ 2029", description: "Juro real intermediário" },
      ],
    },
    {
      id: "debentures_incentivadas",
      label: "Debêntures Incentivadas",
      liquidityBucket: "acima_cinco_anos",
      country: "brasil",
      base: 16,
      shortTermBias: -8,
      taxBias: 8,
      taxNote: "Isenta de IR na pessoa física",
      micro: [
        { name: "Debêntures de infraestrutura", description: "Crédito isento" },
        { name: "Fundos de infraestrutura", description: "Renda isenta" },
      ],
    },
    {
      id: "lci_lca",
      label: "LCI / LCA",
      liquidityBucket: "um_a_cinco_anos",
      country: "brasil",
      base: 14,
      shortTermBias: 4,
      taxBias: 6,
      taxNote: "Isenta de IR na pessoa física",
      micro: [
        { name: "LCI indexada ao CDI", description: "Crédito bancário isento" },
        { name: "LCA prefixada", description: "Travamento de taxa" },
      ],
    },
    {
      id: "credito_privado",
      label: "Crédito Privado / CDB",
      liquidityBucket: "um_a_cinco_anos",
      country: "brasil",
      base: 14,
      shortTermBias: 2,
      taxBias: -6,
      taxNote: "Tributado — usado como complemento",
      micro: [
        { name: "CDB de liquidez diária", description: "Caixa remunerado" },
        { name: "Crédito privado high grade", description: "Spread adicional" },
      ],
    },
  ],
  acoes_brasil: [
    {
      id: "dividendos",
      label: "Dividendos",
      liquidityBucket: "d1_d30",
      country: "brasil",
      base: 34,
      shortTermBias: 6,
      taxBias: 4,
      micro: [
        { name: "Cesta de dividendos", description: "Empresas maduras pagadoras" },
      ],
    },
    {
      id: "valor",
      label: "Valor",
      liquidityBucket: "d1_d30",
      country: "brasil",
      base: 28,
      shortTermBias: 2,
      taxBias: 0,
      micro: [{ name: "Cesta de valor", description: "Múltiplos descontados" }],
    },
    {
      id: "growth",
      label: "Growth",
      liquidityBucket: "acima_cinco_anos",
      country: "brasil",
      base: 24,
      shortTermBias: -6,
      taxBias: 0,
      micro: [{ name: "Cesta de crescimento", description: "Alta expansão de receita" }],
    },
    {
      id: "small_caps",
      label: "Small Caps",
      liquidityBucket: "acima_cinco_anos",
      country: "brasil",
      base: 14,
      shortTermBias: -8,
      taxBias: 0,
      micro: [{ name: "Cesta de small caps", description: "Menor capitalização" }],
    },
  ],
  exterior: [
    {
      id: "etf_eua",
      label: "ETF EUA",
      liquidityBucket: "d1_d30",
      country: "estados_unidos",
      base: 40,
      shortTermBias: 4,
      taxBias: 4,
      taxNote: "ETF de acumulação quando aplicável",
      micro: [{ name: "ETF de índice amplo EUA", description: "Núcleo global" }],
    },
    {
      id: "etf_global",
      label: "ETF Global",
      liquidityBucket: "d1_d30",
      country: "europa",
      base: 28,
      shortTermBias: 2,
      taxBias: 4,
      micro: [{ name: "ETF global desenvolvido", description: "Diversificação geográfica" }],
    },
    {
      id: "reits",
      label: "REITs",
      liquidityBucket: "um_a_cinco_anos",
      country: "estados_unidos",
      base: 18,
      shortTermBias: -2,
      taxBias: -2,
      micro: [{ name: "ETF de REITs", description: "Imobiliário internacional" }],
    },
    {
      id: "emergentes",
      label: "Mercados Emergentes",
      liquidityBucket: "acima_cinco_anos",
      country: "emergentes",
      base: 14,
      shortTermBias: -4,
      taxBias: 0,
      micro: [{ name: "ETF de emergentes", description: "Prêmio de risco adicional" }],
    },
  ],
  fiis: [
    {
      id: "fii_papel",
      label: "Papel",
      liquidityBucket: "d1_d30",
      country: "brasil",
      base: 32,
      shortTermBias: 6,
      taxBias: 4,
      taxNote: "Rendimento isento na pessoa física",
      micro: [{ name: "FIIs de CRI", description: "Renda indexada" }],
    },
    {
      id: "fii_tijolo",
      label: "Tijolo",
      liquidityBucket: "um_a_cinco_anos",
      country: "brasil",
      base: 38,
      shortTermBias: -2,
      taxBias: 2,
      micro: [{ name: "FIIs de lajes e logística", description: "Renda de aluguel" }],
    },
    {
      id: "fii_infra",
      label: "Infraestrutura",
      liquidityBucket: "acima_cinco_anos",
      country: "brasil",
      base: 16,
      shortTermBias: -4,
      taxBias: 6,
      taxNote: "Debêntures incentivadas via FI-Infra",
      micro: [{ name: "FI-Infra", description: "Crédito isento indexado" }],
    },
    {
      id: "fii_hibrido",
      label: "Híbridos",
      liquidityBucket: "um_a_cinco_anos",
      country: "brasil",
      base: 14,
      shortTermBias: 0,
      taxBias: 0,
      micro: [{ name: "FIIs híbridos", description: "Papel e tijolo combinados" }],
    },
  ],
  alternativos: [
    {
      id: "multiestrategia",
      label: "Multiestratégia",
      liquidityBucket: "um_a_cinco_anos",
      country: "brasil",
      base: 45,
      shortTermBias: 4,
      taxBias: 0,
      micro: [{ name: "Fundos multiestratégia", description: "Baixa correlação" }],
    },
    {
      id: "ouro_cambio",
      label: "Ouro e Câmbio",
      liquidityBucket: "d1_d30",
      country: "estados_unidos",
      base: 30,
      shortTermBias: 6,
      taxBias: 0,
      micro: [{ name: "ETF de ouro", description: "Proteção cambial e sistêmica" }],
    },
    {
      id: "ativos_reais",
      label: "Ativos Reais",
      liquidityBucket: "acima_cinco_anos",
      country: "brasil",
      base: 25,
      shortTermBias: -6,
      taxBias: 4,
      micro: [{ name: "Fundos de ativos reais", description: "Proteção inflacionária" }],
    },
  ],
  caixa: [
    {
      id: "caixa_d0",
      label: "Caixa D+0",
      liquidityBucket: "d0",
      country: "brasil",
      base: 100,
      shortTermBias: 0,
      taxBias: 0,
      micro: [
        { name: "Tesouro Selic / CDB D+0", description: "Liquidez imediata" },
      ],
    },
  ],
};

export function runAllocationEngine(input: {
  policy: PolicyDecision;
  optimization: OptimizationResult;
}): StructuredPortfolio {
  const { policy, optimization } = input;
  const shortTerm = policy.liquidityNeed === "alta";
  const longTerm = policy.liquidityNeed === "baixa";
  const taxPriority = true; // Regras tributárias sempre ativas no motor.

  const macro: MacroBucket[] = [];

  for (const macroClass of MACRO_CLASS_ORDER) {
    const weight = optimization.weights[macroClass];
    if (weight <= 0) continue;

    const templates = TEMPLATES[macroClass];
    const scores = templates.map((template) => {
      let score = template.base;
      if (shortTerm) score += template.shortTermBias;
      if (longTerm) score -= template.shortTermBias;
      if (taxPriority) score += template.taxBias;
      return Math.max(score, 1);
    });
    const totalScore = scores.reduce((sum, s) => sum + s, 0);

    const sleeves: MesoSleeve[] = templates.map((template, index) => {
      const sleeveWeight = round1((weight * (scores[index] ?? 0)) / totalScore);
      return {
        id: `${macroClass}:${template.id}`,
        label: template.label,
        weight: sleeveWeight,
        liquidityBucket: template.liquidityBucket,
        country: template.country,
        ...(template.taxNote ? { taxNote: template.taxNote } : {}),
        micro: buildMicro(template.micro, sleeveWeight),
      };
    });

    macro.push({
      macro: macroClass,
      label: MACRO_CLASS_LABEL[macroClass],
      weight,
      sleeves: reconcile(sleeves, weight),
    });
  }

  return {
    macro,
    liquidityDistribution: liquidityDistribution(macro),
    countryDistribution: countryDistribution(macro),
  };
}

function buildMicro(
  assets: Array<{ name: string; description: string }>,
  sleeveWeight: number,
): MicroAsset[] {
  if (assets.length === 0) return [];
  const share = sleeveWeight / assets.length;
  return assets.map((asset) => ({
    ...asset,
    weight: round1(share),
  }));
}

/** Garante que a soma dos sleeves feche exatamente o peso da classe macro. */
function reconcile(sleeves: MesoSleeve[], target: number): MesoSleeve[] {
  const total = sleeves.reduce((sum, s) => sum + s.weight, 0);
  const diff = round1(target - total);
  if (diff === 0 || sleeves.length === 0) return sleeves;
  const largest = sleeves.reduce((a, b) => (a.weight >= b.weight ? a : b));
  largest.weight = round1(largest.weight + diff);
  largest.micro = buildMicro(
    largest.micro.map((m) => ({ name: m.name, description: m.description })),
    largest.weight,
  );
  return sleeves;
}

function liquidityDistribution(
  macro: MacroBucket[],
): Record<LiquidityBucket, number> {
  const dist: Record<LiquidityBucket, number> = {
    d0: 0,
    d1_d30: 0,
    um_a_cinco_anos: 0,
    acima_cinco_anos: 0,
  };
  for (const bucket of macro) {
    for (const sleeve of bucket.sleeves) {
      dist[sleeve.liquidityBucket] += sleeve.weight;
    }
  }
  for (const key of Object.keys(dist) as LiquidityBucket[]) {
    dist[key] = round1(dist[key]);
  }
  return dist;
}

function countryDistribution(macro: MacroBucket[]): Record<Country, number> {
  const dist: Record<Country, number> = {
    brasil: 0,
    estados_unidos: 0,
    europa: 0,
    emergentes: 0,
  };
  for (const bucket of macro) {
    for (const sleeve of bucket.sleeves) {
      dist[sleeve.country] += sleeve.weight;
    }
  }
  for (const key of Object.keys(dist) as Country[]) {
    dist[key] = round1(dist[key]);
  }
  return dist;
}

export const LIQUIDITY_LABELS = LIQUIDITY_BUCKET_LABEL;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}