/**
 * Applies email-auth friendly settings to your hosted Supabase project via the Management API.
 *
 * Prerequisites:
 * 1. Create a personal access token: https://supabase.com/dashboard/account/tokens
 *    Scopes: include project config / auth write (e.g. "All" for a dev token, or auth_config_write).
 * 2. In PowerShell:
 *      $env:SUPABASE_ACCESS_TOKEN="your_token_here"
 *      npm run configure:supabase-auth
 *
 * Optional env:
 *   SUPABASE_PROJECT_REF   (default: qievhnsketxamvlxbreb from supabase/config.toml)
 *   SITE_URL               (default: http://localhost:5173) — Auth "Site URL"
 *   SUPABASE_MAILER_AUTOCONFIRM  set to "false" to require email confirmation before sign-in
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function readProjectRef() {
  try {
    const raw = readFileSync(resolve(root, "supabase", "config.toml"), "utf8");
    const m = raw.match(/project_id\s*=\s*"([^"]+)"/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const REF = process.env.SUPABASE_PROJECT_REF || readProjectRef() || "qievhnsketxamvlxbreb";
const SITE_URL = process.env.SITE_URL || "http://localhost:5173";
const MAILER_AUTOCONFIRM = (process.env.SUPABASE_MAILER_AUTOCONFIRM ?? "true").toLowerCase() !== "false";

const EXTRA_ALLOW = [
  "http://localhost:5173",
  "http://localhost:5173/auth",
  "http://localhost:5173/auth?type=recovery",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5173/auth",
  "http://127.0.0.1:5173/auth?type=recovery",
];

function parseAllowList(s) {
  if (!s || typeof s !== "string") return [];
  return s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

async function main() {
  if (!TOKEN) {
    console.error(
      "Missing SUPABASE_ACCESS_TOKEN.\n" +
        "Create a token at https://supabase.com/dashboard/account/tokens then:\n" +
        '  $env:SUPABASE_ACCESS_TOKEN="sbp_..."\n' +
        "  npm run configure:supabase-auth"
    );
    process.exit(1);
  }

  const base = `https://api.supabase.com/v1/projects/${REF}/config/auth`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };

  const getRes = await fetch(base, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const getText = await getRes.text();
  if (!getRes.ok) {
    console.error("GET config/auth failed:", getRes.status, getText);
    process.exit(1);
  }

  let current;
  try {
    current = JSON.parse(getText);
  } catch {
    console.error("Unexpected GET response (not JSON):", getText.slice(0, 200));
    process.exit(1);
  }

  const mergedAllow = [...new Set([...parseAllowList(current.uri_allow_list), ...EXTRA_ALLOW])].join(",");

  const body = {
    site_url: SITE_URL,
    uri_allow_list: mergedAllow,
    disable_signup: false,
    mailer_autoconfirm: MAILER_AUTOCONFIRM,
  };

  const patchRes = await fetch(base, { method: "PATCH", headers, body: JSON.stringify(body) });
  const patchText = await patchRes.text();
  if (!patchRes.ok) {
    console.error("PATCH config/auth failed:", patchRes.status, patchText);
    process.exit(1);
  }

  console.log("Supabase auth config updated for project ref:", REF);
  console.log("  site_url:", SITE_URL);
  console.log("  mailer_autoconfirm:", MAILER_AUTOCONFIRM);
  console.log("  disable_signup: false");
  console.log("  uri_allow_list: merged with localhost /auth routes");
  console.log("\nNext: Dashboard → Authentication → Providers → ensure Email is enabled (on by default on new projects).");
  if (MAILER_AUTOCONFIRM) {
    console.log("\nNote: mailer_autoconfirm is ON (no inbox confirmation). Set SUPABASE_MAILER_AUTOCONFIRM=false for production-style email verification.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
