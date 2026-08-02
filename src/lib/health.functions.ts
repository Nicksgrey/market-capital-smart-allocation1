import { createServerFn } from "@tanstack/react-start";

/**
 * Verifica a conectividade de leitura com o Supabase.
 *
 * Usa um cliente publishable sem sessão de usuário, portanto só consegue
 * ler dados explicitamente públicos. Aqui fazemos uma leitura mínima
 * do catálogo interno para confirmar que o projeto está respondendo.
 */
export const checkSupabaseHealth = createServerFn({ method: "GET" }).handler(
  async () => {
    const { createServerPublishableClient } = await import(
      "@/infrastructure/supabase/server-client.server"
    );
    const supabase = createServerPublishableClient();

    const { data, error } = await supabase
      .from("clients")
      .select("id")
      .limit(1);

    if (error) {
      return { ok: false, error: error.message };
    }

    return {
      ok: true,
      url: process.env["SUPABASE_URL"],
      projectId: process.env["SUPABASE_PROJECT_ID"],
      tablesReachable: Array.isArray(data),
    };
  },
);
