import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * Calls Edge Functions with a plain fetch so Supabase's gateway always receives:
 * - `Authorization: Bearer <user_jwt>`
 * - `apikey: <anon_key>`
 *
 * The shared `fetchWithAuth` + FunctionsClient merge can still satisfy this, but
 * hitting the gateway directly avoids edge cases where a 401 is returned with
 * `{ "message": "Missing authorization header" }` before your function runs.
 */
export async function invokeEdgeFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: null, error: new Error("Supabase URL or anon key is not configured") };
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    return { data: null, error: new Error(sessionError?.message ?? "Not authenticated") };
  }

  let accessToken = session.access_token;
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = session.expires_at ?? 0;
  if (expiresAt - now < 120) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (!refreshError && refreshed.session?.access_token) {
      accessToken = refreshed.session.access_token;
    }
  }

  const url = `${SUPABASE_URL}/functions/v1/${encodeURIComponent(name)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body ?? {}),
    });

    const raw = await res.text();
    let parsed: unknown = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }

    if (!res.ok) {
      const o = parsed as { message?: string; error?: string; details?: string } | null;
      const detail =
        o?.error ||
        o?.message ||
        o?.details ||
        (typeof raw === "string" && raw.length < 200 ? raw : null) ||
        `Request failed (${res.status})`;
      return { data: (parsed as T) ?? null, error: new Error(detail) };
    }

    return { data: parsed as T, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { data: null, error: new Error(message) };
  }
}
