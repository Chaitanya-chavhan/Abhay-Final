import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_DRIVE_HOSTS = new Set([
  "drive.google.com",
  "docs.google.com",
  "drive.usercontent.google.com",
]);

function isValidProductId(id: string): boolean {
  return typeof id === "string" && UUID_RE.test(id.trim());
}

function isAllowedDriveUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("https://")) return false;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "https:") return false;
    return ALLOWED_DRIVE_HOSTS.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: { product_id?: string };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const product_id = body.product_id?.trim();
    if (!product_id || !isValidProductId(product_id)) {
      return new Response(
        JSON.stringify({ error: "Valid product_id (UUID) required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (!purchase) {
      return new Response(
        JSON.stringify({ error: "Access denied: product not purchased" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("drive_link, title")
      .eq("id", product_id)
      .single();

    if (productError || !product?.drive_link) {
      return new Response(
        JSON.stringify({ error: "Drive link not available" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isAllowedDriveUrl(product.drive_link)) {
      console.error("Rejected drive_link host for product", product_id);
      return new Response(
        JSON.stringify({
          error:
            "Drive link is not an allowed Google Drive URL. Use https://drive.google.com/... or https://docs.google.com/...",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: logError } = await supabase.from("drive_link_access_logs").insert({
      user_id: user.id,
      product_id,
    });
    if (logError) {
      console.warn("drive_link_access_logs insert skipped:", logError.message);
    }

    return new Response(
      JSON.stringify({ drive_link: product.drive_link.trim(), title: product.title }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
