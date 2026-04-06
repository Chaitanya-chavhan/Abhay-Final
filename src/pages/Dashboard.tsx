import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Package, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/supabase-edge-function";
import { useToast } from "@/hooks/use-toast";

interface PurchasedProduct {
  id: string;
  product_id: string;
  title: string;
  created_at: string;
}

type PurchaseQueryRow = {
  id: string;
  product_id: string;
  created_at: string;
  products: { title: string } | null;
};

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [accessingLink, setAccessingLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("purchases")
        .select("id, product_id, created_at, products(title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setPurchases(
          (data as PurchaseQueryRow[]).map((p) => ({
            id: p.id,
            product_id: p.product_id,
            title: p.products?.title || "Unknown Product",
            created_at: new Date(p.created_at).toLocaleDateString("en-IN"),
          }))
        );
      }
      setLoadingPurchases(false);
    };
    fetchPurchases();
  }, [user]);

  const handleAccessLink = async (productId: string) => {
    setAccessingLink(productId);
    try {
      const { data, error } = await invokeEdgeFunction<{ drive_link?: string; error?: string }>("get-drive-link", {
        product_id: productId,
      });

      if (error || !data?.drive_link) {
        toast({
          title: "Error",
          description: data?.error || error?.message || "Unable to get access link.",
          variant: "destructive",
        });
      } else {
        window.open(data.drive_link, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch access link.", variant: "destructive" });
    }
    setAccessingLink(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;

  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="container relative mx-auto px-4 sm:px-6 z-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 sm:flex-row sm:items-center shadow-2xl shadow-primary/5 ring-1 ring-white/10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary blur-md opacity-50" />
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="relative h-20 w-20 rounded-full border-2 border-background object-cover shadow-lg" />
              ) : (
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-heading text-3xl font-bold text-primary-foreground shadow-lg border-2 border-background">
                  {displayName?.toString().charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium tracking-wider text-primary uppercase mb-1">Welcome Back</p>
              <h1 className="font-heading text-3xl font-bold text-foreground tracking-tight">{displayName}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-12 px-6 rounded-xl transition-colors">
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold text-foreground tracking-tight">Your Products</h2>
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">{purchases.length} Items</span>
        </div>

        {loadingPurchases ? (
          <div className="mt-12 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border/60 bg-card/20 backdrop-blur-sm p-16 text-center shadow-inner">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 mb-6">
              <Package className="h-10 w-10 text-primary/40" />
            </div>
            <h3 className="font-heading text-2xl font-semibold text-foreground">No products yet</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Products you purchase will appear here with instant access to their content and files.
            </p>
            <Link to="/products" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {purchases.map((p) => (
              <div key={p.id} className="group flex flex-col justify-between rounded-2xl border border-border/50 bg-card/50 backdrop-blur-lg p-6 shadow-xl shadow-primary/5 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground leading-tight">{p.title}</h3>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">Purchased on {p.created_at}</p>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handleAccessLink(p.product_id)}
                    disabled={accessingLink === p.product_id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-primary/10 px-4 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground disabled:opacity-50"
                  >
                    {accessingLink === p.product_id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Access Content
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
