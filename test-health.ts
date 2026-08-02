import { createClient } from "@supabase/supabase-js";

const url = process.env["SUPABASE_URL"];
const key = process.env["SUPABASE_PUBLISHABLE_KEY"];

if (!url || !key) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
  },
});

const { data, error } = await supabase.from("clients").select("id").limit(1);

if (error) {
  console.error("Error:", error.message);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, url, tablesReachable: Array.isArray(data) }, null, 2));
