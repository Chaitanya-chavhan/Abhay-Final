import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const amountRaw = body.amount;
    const currency = typeof body.currency === "string" && body.currency.trim()
      ? body.currency.trim().toUpperCase()
      : "INR";
    const receipt =
      typeof body.receipt === "string" && body.receipt.trim()
        ? body.receipt.trim()
        : `rcpt_${user.id.slice(0, 8)}_${Date.now()}`;
    const productId = typeof body.product_id === "string" ? body.product_id : undefined;

    if (amountRaw === undefined || amountRaw === null) {
      throw new Error("amount is required");
    }

    const amountNum = Number(amountRaw);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      throw new Error("amount must be a positive number");
    }

    const amountRupees = Math.round(amountNum);
    const amountPaise = Math.round(amountNum * 100);

    if (!productId) {
      return new Response(JSON.stringify({ error: "product_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, title, price, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product?.is_active) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (product.price !== amountRupees) {
      return new Response(JSON.stringify({ error: "Amount does not match product price" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const basic = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const rzRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basic}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt,
      }),
    });

    const rzJson = (await rzRes.json()) as {
      id?: string;
      error?: { description?: string; code?: string };
    };

    if (!rzRes.ok || !rzJson.id) {
      const detail = rzJson.error?.description ?? "Failed to create Razorpay order";
      return new Response(JSON.stringify({ error: "Razorpay order failed", details: detail }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: productId,
      razorpay_order_id: rzJson.id,
      amount: amountRupees,
      currency,
      status: "created",
    });

    if (insertError) {
      console.error("Order insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        order_id: rzJson.id,
        key_id: razorpayKeyId,
        amount: amountPaise,
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
