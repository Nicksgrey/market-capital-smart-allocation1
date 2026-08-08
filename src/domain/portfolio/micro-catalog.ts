/**
 * CAMADA 3 — catálogo de exemplos do nível MICRO.
 *
 * Sugestões educacionais baseadas na metodologia do curso, conforme a
 * documentação oficial. Não influenciam pesos nem cálculos: apenas ilustram,
 * por sub-classe (meso), quais ativos representam aquela posição.
 */

/** Exemplos por identificador de sleeve (`<macro>:<sleeve>`). */
export const MICRO_EXAMPLES: Record<string, string[]> = {
  "renda_fixa:tesouro_selic": ["Tesouro Selic 2031"],
  "renda_fixa:tesouro_ipca": ["Tesouro IPCA+ 2035"],
  "renda_fixa:debentures_incentivadas": ["Debêntures incentivadas de infraestrutura"],
  "renda_fixa:lci_lca": ["LCI/LCA de bancos de primeira linha"],
  "renda_fixa:fi_infra": ["FI-Infra / fundos de debêntures incentivadas"],
  "renda_fixa:credito_privado": ["CDB de liquidez diária"],

  "acoes_brasil:dividendos": ["BBAS3", "TAEE11"],
  "acoes_brasil:valor": ["Ações de valor com múltiplos descontados"],
  "acoes_brasil:growth": ["WEGE3"],
  "acoes_brasil:small_caps": ["Cesta de small caps"],

  "exterior:etf_eua": ["IVVB11"],
  "exterior:etf_global": ["WRLD11"],
  "exterior:reits": ["ETF de REITs"],
  "exterior:emergentes": ["ETF de mercados emergentes"],

  "fiis:fii_papel": ["KNSC11", "RBRR11"],
  "fiis:fii_tijolo": ["HGLG11", "BTLG11"],
  "fiis:fii_hibrido": ["FIIs híbridos"],
  "fiis:fii_infra": ["FI-Infra de crédito incentivado de infraestrutura"],

  "alternativos:multiestrategia": ["Fundos multiestratégia"],
  "alternativos:ouro_cambio": ["ETF de ouro"],
  "alternativos:ativos_reais": ["Fundos de ativos reais"],

  "caixa:caixa_d0": ["Tesouro Selic", "CDB de liquidez diária"],
};

export function microExamplesFor(sleeveId: string): string[] {
  return MICRO_EXAMPLES[sleeveId] ?? [];
}