/**
 * Leitura centralizada de variáveis de ambiente.
 *
 * Regras:
 * - `VITE_*` são lidas no browser via import.meta.env.
 * - `SUPABASE_*` são lidas apenas no servidor (server functions/routes).
 */
export const env = {
  supabase: {
    url: import.meta.env["VITE_SUPABASE_URL"] as string | undefined,
    publishableKey: import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined,
    projectId: import.meta.env["VITE_SUPABASE_PROJECT_ID"] as string | undefined,
  },
};

export function requireSupabaseUrl(): string {
  const url = env.supabase.url;
  if (!url) {
    throw new Error("VITE_SUPABASE_URL não está definido. Verifique a integração Supabase.");
  }
  return url;
}

export function requireSupabasePublishableKey(): string {
  const key = env.supabase.publishableKey;
  if (!key) {
    throw new Error(
      "VITE_SUPABASE_PUBLISHABLE_KEY não está definido. Verifique a integração Supabase.",
    );
  }
  return key;
}
