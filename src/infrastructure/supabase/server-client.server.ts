/**
 * Helpers de cliente Supabase para uso exclusivo no servidor.
 *
 * Este arquivo tem extensão `.server.ts`, o que impede que ele seja
 * importado acidentalmente em código de cliente/browser.
 */
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export function createServerPublishableClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error("SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não configurados.");
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function loadServiceRoleClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
