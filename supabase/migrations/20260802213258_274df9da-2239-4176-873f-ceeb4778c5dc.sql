-- ============================================================
-- Camada 1 - Perfilamento do Investidor
-- Motor Inteligente de Alocação Patrimonial (Market Capital)
-- Prefixo map_ para não colidir com estruturas existentes.
-- ============================================================

CREATE TABLE public.map_investor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,

  -- Descoberta do Investidor
  age integer,
  net_worth numeric,
  monthly_income numeric,
  monthly_expenses numeric,
  emergency_reserve_months text,
  is_retired boolean NOT NULL DEFAULT false,
  dependents integer NOT NULL DEFAULT 0,
  horizon_years integer,
  main_goal text,
  liquidity_need text,

  -- Perfil Comportamental (suitability do site Market Capital)
  behavioral_score integer,
  behavioral_profile text,

  -- Capacidade Financeira
  financial_capacity_score integer,
  financial_capacity_label text,

  -- Risk Budget e Perfil Final
  risk_budget_score integer,
  final_profile text,

  -- Volatilidade
  recommended_volatility numeric,
  selected_volatility numeric,
  volatility_range_min numeric,
  volatility_range_max numeric,
  volatility_status text,

  -- Fluxo
  status text NOT NULL DEFAULT 'em_andamento',
  current_step text NOT NULL DEFAULT 'suitability',
  diagnosis text,
  completed_at timestamp with time zone,

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX map_investor_profiles_user_id_idx ON public.map_investor_profiles (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.map_investor_profiles TO authenticated;
GRANT ALL ON public.map_investor_profiles TO service_role;

ALTER TABLE public.map_investor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "map_investor_profiles_select_own"
  ON public.map_investor_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "map_investor_profiles_insert_own"
  ON public.map_investor_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "map_investor_profiles_update_own"
  ON public.map_investor_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "map_investor_profiles_delete_own"
  ON public.map_investor_profiles FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_map_investor_profiles_updated_at
  BEFORE UPDATE ON public.map_investor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Histórico versionado das consolidações de perfil
-- ============================================================

CREATE TABLE public.map_profile_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.map_investor_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  version integer NOT NULL DEFAULT 1,

  behavioral_score integer,
  behavioral_profile text,
  financial_capacity_score integer,
  financial_capacity_label text,
  risk_budget_score integer,
  final_profile text,
  recommended_volatility numeric,
  selected_volatility numeric,

  payload jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX map_profile_snapshots_profile_id_idx ON public.map_profile_snapshots (profile_id);
CREATE INDEX map_profile_snapshots_user_id_idx ON public.map_profile_snapshots (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.map_profile_snapshots TO authenticated;
GRANT ALL ON public.map_profile_snapshots TO service_role;

ALTER TABLE public.map_profile_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "map_profile_snapshots_select_own"
  ON public.map_profile_snapshots FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "map_profile_snapshots_insert_own"
  ON public.map_profile_snapshots FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "map_profile_snapshots_update_own"
  ON public.map_profile_snapshots FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "map_profile_snapshots_delete_own"
  ON public.map_profile_snapshots FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_map_profile_snapshots_updated_at
  BEFORE UPDATE ON public.map_profile_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();