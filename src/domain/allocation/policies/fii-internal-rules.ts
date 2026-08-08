/**
 * REGRA DE FIIs — POLÍTICA INTERNA DA CLASSE.
 *
 * Quando a carteira possuir Fundos Imobiliários, o Allocation Engine distribui
 * o peso da classe (definido pelo Optimization Engine) internamente:
 * 40% Papel · 40% Tijolo · 15% Híbridos · 5% Agro.
 * Os percentuais são relativos à CLASSE de FIIs, nunca ao patrimônio total.
 */
export const FII_INTERNAL_POLICY: Array<{ id: string; label: string; shareOfClass: number }> = [
  { id: "fii_papel", label: "Papel", shareOfClass: 40 },
  { id: "fii_tijolo", label: "Tijolo", shareOfClass: 40 },
  { id: "fii_hibrido", label: "Híbridos", shareOfClass: 15 },
  { id: "fii_agro", label: "Agro", shareOfClass: 5 },
];

export const FII_INTERNAL_RATIONALE =
  "A exposição em FIIs foi distribuída entre Papel, Tijolo, Híbridos e Agro para diversificar as fontes de risco e retorno dentro da própria classe.";

export const FI_INFRA_RATIONALE =
  "FI-Infra considerado como alternativa de exposição à infraestrutura e crédito incentivado, respeitando o perfil de risco, horizonte, liquidez e demais restrições da carteira. Não é equivalente a LCI/LCA: possui características próprias de risco, liquidez e marcação a mercado.";
