import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ShieldCheck, Clock, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/supabase-edge-function";
import type { Product } from "@/lib/products";
import { useEffect, useState } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise: Promise<void> | null = null;

/** Loads Razorpay Checkout via a dynamically injected script (no `razorpay` npm package). */
function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser"));
  }
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve();
  }
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay script")), { once: true });
    });
  }
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        razorpayScriptPromise = null;
        reject(new Error("Failed to load Razorpay script"));
      };
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type CreateOrderErrorPayload = {
  error?: string;
  details?: string;
  razorpay_error?: { description?: string | null };
};

function describeCreateOrderFailure(data: CreateOrderErrorPayload | null, err: Error | null): string {
  const fromApi =
    (data?.details && String(data.details)) ||
    (data?.razorpay_error?.description && String(data.razorpay_error.description)) ||
    (data?.error && String(data.error));
  if (fromApi) return fromApi;
  if (err?.message) return err.message;
  return "Failed to create order. Please try again.";
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("products_public")
        .select("id, title, description, price, original_price, category, image_url, features, tag, is_active, created_at, updated_at")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (data) setProduct(data as Product);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user || !id) return;
      const { data } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .maybeSingle();
      if (data) setPurchased(true);
    };
    checkPurchase();
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Product Not Found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  const handleBuyNow = async () => {
    if (!user || !session) {
      const path = id ? `/product/${id}` : "/products";
      navigate(`/auth?redirect=${encodeURIComponent(path)}`);
      return;
    }

    if (purchased) {
      toast({ title: "Already Purchased!", description: "Check your dashboard for access." });
      return;
    }

    setPurchasing(true);
    try {
      await loadRazorpayScript();
    } catch {
      toast({ title: "Error", description: "Payment system failed to load. Please try again.", variant: "destructive" });
      setPurchasing(false);
      return;
    }

    try {
      const amountRupees = Math.round(Number(product.price));
      if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
        toast({
          title: "Error",
          description: "This product has an invalid price. Contact support.",
          variant: "destructive",
        });
        setPurchasing(false);
        return;
      }

      const { data, error } = await invokeEdgeFunction<{
        order_id?: string;
        error?: string;
        details?: string;
        key_id?: string;
        amount?: number;
        currency?: string;
        product_title?: string;
        razorpay_error?: { description?: string | null };
      }>("create-razorpay-order", {
        product_id: String(product.id),
        amount: amountRupees,
        currency: "INR",
        receipt: `rcpt_${String(product.id).replace(/-/g, "").slice(0, 12)}`,
      });

      if (error || !data?.order_id) {
        const detail = describeCreateOrderFailure((data as CreateOrderErrorPayload) ?? null, error);
        if (import.meta.env.DEV) {
          console.error("[create-razorpay-order]", { data, error: error?.message });
        }
        toast({ title: "Payment setup failed", description: detail, variant: "destructive" });
        setPurchasing(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Abhay Digital Products",
        description: data.product_title,
        order_id: data.order_id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const { data: verifyData, error: verifyError } = await invokeEdgeFunction<{ success?: boolean }>(
              "verify-razorpay-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            if (verifyError || !verifyData?.success) {
              toast({
                title: "Payment Failed",
                description:
                  (verifyData as { error?: string } | undefined)?.error ||
                  verifyError?.message ||
                  "Payment verification failed. Contact support.",
                variant: "destructive",
              });
            } else {
              setPurchased(true);
              toast({ title: "Payment Successful! 🎉", description: "Your product is now available in your dashboard." });
            }
          } catch {
            toast({ title: "Error", description: "Something went wrong. Contact support.", variant: "destructive" });
          }
          setPurchasing(false);
        },
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || "",
        },
        theme: { color: "#3B82F6" },
        modal: {
          ondismiss: () => setPurchasing(false),
        },
      };

      const Razorpay = (window as unknown as { Razorpay?: new (opts: typeof options) => { open: () => void } }).Razorpay;
      if (!Razorpay) {
        toast({ title: "Error", description: "Payment system loading. Please try again.", variant: "destructive" });
        setPurchasing(false);
        return;
      }
      const rzp = new Razorpay(options);
      rzp.open();
    } catch {
      toast({ title: "Error", description: "Failed to initiate payment.", variant: "destructive" });
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 py-10">
        <Link to="/products" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 items-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/50 bg-card/60 shadow-2xl shadow-primary/5 ring-1 ring-white/10 backdrop-blur-sm group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <span className="font-heading text-8xl font-bold tracking-tighter text-primary/20 drop-shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:text-primary/30">{product.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10 dark:ring-white/10 pointer-events-none" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
                {product.category}
              </span>
              {product.tag && (
                <span className="rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-xs font-bold tracking-wide text-primary-foreground shadow-sm shadow-primary/20">
                  {product.tag}
                </span>
              )}
            </div>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:leading-tight">
              {product.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 flex items-baseline gap-4 rounded-2xl bg-secondary/30 p-6 border border-border/50">
              <span className="font-heading text-5xl font-extrabold text-foreground tracking-tight">₹{product.price}</span>
              <span className="text-xl text-muted-foreground line-through decoration-muted-foreground/50">₹{product.original_price}</span>
              <span className="ml-auto flex items-center justify-center rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-bold text-green-600 dark:text-green-400 border border-green-500/20">
                {discount}% OFF
              </span>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={purchasing}
              className="group relative mt-8 h-14 w-full overflow-hidden rounded-2xl bg-primary text-lg font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] active:scale-[0.98] sm:h-16 sm:text-xl"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-500 group-hover:bg-gradient-to-l" />
              <div className="relative flex items-center justify-center gap-2">
                {purchasing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Processing Secure Payment...
                  </>
                ) : purchased ? (
                  "✓ Purchased — Go to Dashboard"
                ) : user ? (
                  "Buy Now Securely"
                ) : (
                  "Sign In to Buy"
                )}
              </div>
            </Button>

            <div className="mt-8 space-y-3">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, label: "Secure" },
                { icon: Clock, label: "Instant" },
                { icon: Download, label: "Lifetime" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
