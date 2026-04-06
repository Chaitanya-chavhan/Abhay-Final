import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

type EdgeErrBody = {
  message?: string;
  error?: string;
  details?: string;
  razorpay_error?: { description?: string | null };
};

function formatEdgeErrorBody(o: EdgeErrBody | null, status: number, rawText: string): string {
  const rz = o?.razorpay_error?.description;
  const parts = [o?.details, rz, o?.message, o?.error].filter(
    (x): x is string => typeof x === "string" && x.length > 0,
  );
  if (parts.length) return parts[0];
  const short = rawText.trim().slice(0, 200);
  if (short && !short.startsWith("{")) {
    return `Server returned non-JSON (${status}). Check VITE_SUPABASE_URL and that the Edge Function is deployed.`;
  }
  return `Request failed (${status})`;
}

function clarifyJwtMessage(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid jwt") || m.includes("jwt")) {
    return `${msg} — Try signing out and signing in again. Also confirm VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are from the same Supabase project.`;
  }
  return msg;
}

/**
 * Invokes Edge Functions with a valid session JWT. Validates the user with the
 * auth server, refreshes tokens when they are close to expiry, then uses the
 * Supabase client `functions.invoke` so Authorization + apikey match the SDK.
 */
export async function invokeEdgeFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>,
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

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = session.expires_at ?? 0;
  // Refresh first when expired or close to expiry — getUser() and the Edge gateway reject stale JWTs.
  if (expiresAt <= now + 600) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshed.session?.access_token) {
      return {
        data: null,
        error: new Error(
          refreshError
            ? clarifyJwtMessage(refreshError.message)
            : "Session expired. Please sign out, sign in again, then retry.",
        ),
      };
    }
  }

  const { error: userError } = await supabase.auth.getUser();
  if (userError) {
    return {
      data: null,
      error: new Error(clarifyJwtMessage(userError.message ?? "Session invalid. Please sign in again.")),
    };
  }

  const { data, error } = await supabase.functions.invoke(name, {
    body: body ?? {},
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const res = error.context as Response;
      let raw = "";
      try {
        raw = await res.text();
      } catch {
        raw = "";
      }
      let parsed: unknown = null;
      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }
      }
      const o = (parsed && typeof parsed === "object" ? parsed : null) as EdgeErrBody | null;
      const detail = clarifyJwtMessage(formatEdgeErrorBody(o, res.status, raw));
      return { data: (parsed as T) ?? null, error: new Error(detail) };
    }

    const msg = error instanceof Error ? error.message : String(error);
    return { data: null, error: new Error(clarifyJwtMessage(msg)) };
  }

  if (data === null || typeof data !== "object") {
    return {
      data: null,
      error: new Error(
        "Empty or invalid JSON from Edge Function. Confirm create-razorpay-order is deployed and returns JSON.",
      ),
    };
  }

  return { data: data as T, error: null };
}
