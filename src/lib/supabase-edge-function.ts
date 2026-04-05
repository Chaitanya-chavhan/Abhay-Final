import { supabase } from "@/integrations/supabase/client";

/**
 * Invokes a Supabase Edge Function with a fresh user JWT.
 * Avoids 401s when the in-memory session is stale but localStorage was refreshed,
 * or when the access token is about to expire.
 */
export async function invokeEdgeFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: unknown }> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    return { data: null, error: sessionError ?? new Error("Not authenticated") };
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

  return supabase.functions.invoke<T>(name, {
    body,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
