import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Razorpay Orders API: `receipt` max length 40. */
const MAX_RECEIPT_LEN = 40;

function truncateReceipt(receipt: string): string {
  const t = receipt.trim();
  return t.length <= MAX_RECEIPT_LEN ? t : t.slice(0, MAX_RECEIPT_LEN);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: "Razorpay not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = body.amount;
    const currencyRaw = body.currency;
    const receiptRaw = body.receipt;
    const productId = body.product_id;

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error("amount must be a positive number");
    }

    const currency =
      typeof currencyRaw === "string" && currencyRaw.trim()
        ? currencyRaw.trim().toUpperCase()
        : "INR";

    let receipt: string;
    if (typeof receiptRaw === "string" && receiptRaw.trim()) {
      receipt = truncateReceipt(receiptRaw);
    } else {
      receipt = truncateReceipt(`rcpt_${user.id.replace(/-/g, "").slice(0, 12)}_${Date.now()}`);
    }

    const productIdStr =
      productId != null && String(productId).trim() !== "" ? String(productId).trim() : undefined;
    if (!productIdStr) {
      return new Response(JSON.stringify({ error: "product_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amountInPaise = Math.round(parsedAmount * 100);
    const amountRupees = Math.round(parsedAmount);

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, title, price, is_active")
      .eq("id", productIdStr)
      .single();

    if (productError || !product?.is_active) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const catalogPriceRupees = Math.round(Number(product.price));
    if (catalogPriceRupees !== amountRupees) {
      return new Response(
        JSON.stringify({
          error: "Amount does not match product price",
          details: `Expected ₹${catalogPriceRupees}, received ₹${amountRupees}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const basic = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const rzRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basic}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt,
      }),
    });

    let rzJson: Record<string, unknown>;
    try {
      rzJson = await rzRes.json() as Record<string, unknown>;
    } catch {
      return new Response(
        JSON.stringify({
          error: "Razorpay order failed",
          details: "Invalid or empty response from Razorpay",
          status_code: rzRes.status,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!rzRes.ok) {
      const err = rzJson.error as Record<string, unknown> | undefined;
      const description =
        typeof err?.description === "string"
          ? err.description
          : typeof rzJson.message === "string"
          ? rzJson.message as string
          : JSON.stringify(rzJson);
      return new Response(
        JSON.stringify({
          error: "Razorpay order failed",
          details: description,
          razorpay_error: {
            description: err?.description ?? null,
            code: err?.code ?? null,
            source: err?.source ?? null,
            step: err?.step ?? null,
            reason: err?.reason ?? null,
            field: err?.field ?? null,
          },
          http_status: rzRes.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const orderId = rzJson.id as string | undefined;
    if (!orderId) {
      return new Response(
        JSON.stringify({
          error: "Razorpay order failed",
          details: "Missing order id in Razorpay response",
          razorpay_response: rzJson,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error: insertError } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: productIdStr,
      razorpay_order_id: orderId,
      amount: amountRupees,
      currency,
      status: "created",
    });

    if (insertError) {
      console.error("Order insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save order", details: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        order_id: orderId,
        key_id: razorpayKeyId,
        amount: amountInPaise,
        currency,
        product_title: product.title,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("create-razorpay-order:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
