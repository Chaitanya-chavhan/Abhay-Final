import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, ShieldCheck, Clock, Download } from "lucide-react";
import { products } from "@/lib/products";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const product = products.find((p) => p.id === id);

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

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleBuy = () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    // TODO: Integrate Razorpay here
    toast({
      title: "Coming Soon!",
      description: "Payment integration (Razorpay) will be added soon. Stay tuned!",
    });
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
              <span className="font-heading text-6xl font-bold text-primary/40">{product.title.charAt(0)}</span>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {product.category}
            </span>
            {product.tag && (
              <span className="ml-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {product.tag}
              </span>
            )}

            <h1 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-heading text-4xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {discount}% OFF
              </span>
            </div>

            <Button
              onClick={handleBuy}
              className="mt-8 w-full rounded-full bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-glow sm:w-auto sm:px-12"
            >
              {user ? "Buy Now" : "Sign In to Buy"}
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
