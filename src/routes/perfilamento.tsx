import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { AppShell } from "@/presentation/layout/AppShell";
import { ProfilingStepper } from "@/presentation/profiling/ProfilingUI";
import { useProfilingFlow } from "@/presentation/profiling/useProfilingFlow";
import { SuitabilityStep } from "@/presentation/profiling/steps/SuitabilityStep";
import { DiscoveryStep } from "@/presentation/profiling/steps/DiscoveryStep";
import { FinancialCapacityStep } from "@/presentation/profiling/steps/FinancialCapacityStep";
import { RiskBudgetStep } from "@/presentation/profiling/steps/RiskBudgetStep";
import { VolatilityStep } from "@/presentation/profiling/steps/VolatilityStep";
import { ConsolidationPanel } from "@/presentation/profiling/ConsolidationPanel";
import { saveInvestorProfile } from "@/lib/profiling.functions";
import { saveProfilingHandoff } from "@/presentation/shared/profiling-handoff";

const title = "Perfilamento do Investidor | Motor Inteligente de Alocação";
const description =
  "Camada 1 do Motor Inteligente de Alocação Patrimonial: suitability, descoberta do investidor, capacidade financeira, risk budget e volatilidade-alvo.";

export const Route = createFileRoute("/perfilamento")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilingPage,
});

function ProfilingPage() {
  const flow = useProfilingFlow();
  const navigate = useNavigate();
  const save = useServerFn(saveInvestorProfile);
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (flow.behavioralScore == null || !flow.consolidation) {
        throw new Error("Complete as etapas anteriores antes de salvar.");
      }
      return save({
        data: {
          behavioralScore: flow.behavioralScore,
          discovery: flow.discovery,
          selectedVolatility: flow.consolidation.volatility.selected,
        },
      });
    },
    onSuccess: () => setMessage("Perfilamento salvo no seu histórico."),
    onError: (error: unknown) =>
      setMessage(
        error instanceof Error && error.message.includes("Unauthorized")
          ? "Faça login com sua conta Market Capital para salvar o perfilamento."
          : "Não foi possível salvar o perfilamento agora.",
      ),
  });

  const saveStatus = mutation.isPending
    ? "saving"
    : mutation.isError
      ? "error"
      : mutation.isSuccess
        ? "saved"
        : "idle";

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Camada 1
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Perfilamento do Investidor
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Suitability → Descoberta do Investidor → Perfil Comportamental →
            Capacidade Financeira → Risk Budget → Volatilidade-Alvo → Perfil
            Final.
          </p>
        </header>

        <ProfilingStepper steps={flow.steps} current={flow.step} />

        {flow.step === "suitability" ? (
          <SuitabilityStep
            score={flow.behavioralScore}
            onChange={flow.setBehavioralScore}
            onNext={flow.goNext}
          />
        ) : null}

        {flow.step === "descoberta" ? (
          <DiscoveryStep
            discovery={flow.discovery}
            onChange={flow.updateDiscovery}
            complete={flow.discoveryComplete}
            onNext={flow.goNext}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === "capacidade_financeira" && flow.consolidation ? (
          <FinancialCapacityStep
            capacity={flow.consolidation.financialCapacity}
            onNext={flow.goNext}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === "risk_budget" && flow.consolidation ? (
          <RiskBudgetStep
            behavioral={flow.consolidation.behavioral}
            capacity={flow.consolidation.financialCapacity}
            riskBudget={flow.consolidation.riskBudget}
            onNext={flow.goNext}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === "volatilidade_alvo" && flow.consolidation ? (
          <VolatilityStep
            volatility={flow.consolidation.volatility}
            onSelect={flow.setSelectedVolatility}
            onNext={flow.goNext}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === "consolidacao" && flow.consolidation ? (
          <ConsolidationPanel
            consolidation={flow.consolidation}
            onReview={() => flow.goTo("suitability")}
            onBuildPortfolio={() => {
              if (flow.behavioralScore == null || !flow.consolidation) return;
              saveProfilingHandoff({
                behavioralScore: flow.behavioralScore,
                discovery: flow.discovery,
                selectedVolatility: flow.consolidation.volatility.selected,
              });
              void navigate({ to: "/alocacao" });
            }}
            onSave={() => {
              setMessage(null);
              mutation.mutate();
            }}
            saveState={{
              status: saveStatus,
              ...(message ? { message } : {}),
            }}
          />
        ) : null}

        {flow.step !== "consolidacao" && message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </AppShell>
  );
}