/**
 * CAMADA 4 — Catálogo de cenários do STRESS TEST.
 *
 * "Esse módulo não muda a carteira. Ele responde: como essa carteira
 * provavelmente teria se comportado em determinados cenários históricos?"
 *
 * As sensibilidades abaixo são referências EDUCACIONAIS de comportamento
 * típico de cada classe no ambiente descrito. Não são projeções, não
 * representam rentabilidade e não garantem repetição futura.
 */
import type { StressScenario } from "./types";

export const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: "covid_19",
    label: "COVID-19",
    period: "2020",
    context:
      "Choque global simultâneo de oferta e demanda, forte aversão a risco e disparada do dólar.",
    sensitivity: {
      renda_fixa: 2,
      acoes_brasil: -30,
      exterior: 8,
      fiis: -18,
      alternativos: 4,
      caixa: 1,
    },
    learnings: [
      "A diversificação entre classes reduziu a intensidade da queda.",
      "A exposição internacional funcionou como amortecedor pela valorização do câmbio.",
      "Classes de risco recuperaram-se ao longo do tempo, reforçando a importância do horizonte.",
    ],
  },
  {
    id: "crise_2008",
    label: "Crise Financeira Global de 2008",
    period: "2008",
    context:
      "Crise de crédito originada no sistema financeiro americano com contágio global.",
    sensitivity: {
      renda_fixa: 3,
      acoes_brasil: -41,
      exterior: -12,
      fiis: -20,
      alternativos: -6,
      caixa: 1,
    },
    learnings: [
      "Em crises sistêmicas, as correlações entre ativos de risco aumentam.",
      "Títulos públicos e caixa preservaram capital enquanto as bolsas caíam.",
      "Carteiras concentradas em um único mercado sofreram mais.",
    ],
  },
  {
    id: "joesley_day",
    label: "Joesley Day",
    period: "2017",
    context:
      "Choque político doméstico com forte impacto pontual no risco-país.",
    sensitivity: {
      renda_fixa: -2,
      acoes_brasil: -9,
      exterior: 7,
      fiis: -4,
      alternativos: 1,
      caixa: 0,
    },
    learnings: [
      "Riscos domésticos afetam principalmente ativos brasileiros.",
      "A diversificação geográfica reduz o risco específico do Brasil.",
    ],
  },
  {
    id: "greve_caminhoneiros",
    label: "Greve dos Caminhoneiros",
    period: "2018",
    context:
      "Paralisação logística nacional com pressão sobre inflação e atividade.",
    sensitivity: {
      renda_fixa: -1,
      acoes_brasil: -8,
      exterior: 5,
      fiis: -3,
      alternativos: 1,
      caixa: 0,
    },
    learnings: [
      "Eventos locais tendem a ter efeito temporário sobre a carteira.",
      "Ativos indexados à inflação ajudam em choques de preços.",
    ],
  },
  {
    id: "alta_selic",
    label: "Período de forte alta da Selic",
    period: "2021–2022",
    context:
      "Ciclo de aperto monetário, juros reais em elevação e desconto nos ativos de risco.",
    sensitivity: {
      renda_fixa: 5,
      acoes_brasil: -12,
      exterior: -2,
      fiis: -14,
      alternativos: -4,
      caixa: 4,
    },
    learnings: [
      "Pós-fixados e caixa se beneficiam diretamente da alta dos juros.",
      "Ativos de duration longa e FIIs sofrem mais nesse ambiente.",
    ],
  },
  {
    id: "queda_selic",
    label: "Período de queda da Selic",
    period: "2016–2019",
    context:
      "Ciclo de afrouxamento monetário com reprecificação positiva dos ativos de risco.",
    sensitivity: {
      renda_fixa: 7,
      acoes_brasil: 18,
      exterior: 4,
      fiis: 16,
      alternativos: 5,
      caixa: -1,
    },
    learnings: [
      "Prefixados e IPCA+ longos tendem a se valorizar na queda de juros.",
      "FIIs e ações costumam liderar a recuperação nesse ambiente.",
    ],
  },
  {
    id: "inflacao_elevada",
    label: "Inflação elevada",
    period: "2021–2022",
    context: "Pressão persistente de preços e corrosão do poder de compra.",
    sensitivity: {
      renda_fixa: 3,
      acoes_brasil: -7,
      exterior: 3,
      fiis: -5,
      alternativos: 6,
      caixa: -3,
    },
    learnings: [
      "Ativos indexados ao IPCA protegem o poder de compra.",
      "Caixa nominal perde valor real em ambientes inflacionários.",
    ],
  },
  {
    id: "crise_bancaria_americana",
    label: "Crise bancária americana",
    period: "2023",
    context:
      "Quebra de bancos regionais nos Estados Unidos e aumento momentâneo do risco de crédito.",
    sensitivity: {
      renda_fixa: 2,
      acoes_brasil: -5,
      exterior: -6,
      fiis: -3,
      alternativos: 3,
      caixa: 1,
    },
    learnings: [
      "Diversificação por emissor e por país reduz o risco de crédito específico.",
      "Títulos soberanos costumam atuar como refúgio nesses episódios.",
    ],
  },
  {
    id: "cenarios_geopoliticos",
    label: "Conflitos geopolíticos",
    period: "Diversos",
    context:
      "Conflitos e tensões internacionais com impacto em energia, commodities e câmbio.",
    sensitivity: {
      renda_fixa: 1,
      acoes_brasil: -6,
      exterior: -4,
      fiis: -2,
      alternativos: 8,
      caixa: 1,
    },
    learnings: [
      "Alternativos e commodities podem descorrelacionar em choques geopolíticos.",
      "Nenhuma classe protege em todos os cenários — o conjunto é que protege.",
    ],
  },
];

export function scenarioById(id: StressScenario["id"]): StressScenario {
  const scenario = STRESS_SCENARIOS.find((item) => item.id === id);
  if (!scenario) throw new Error(`Cenário desconhecido: ${id}`);
  return scenario;
}