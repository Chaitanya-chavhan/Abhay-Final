import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Package, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PurchasedProduct {
  id: string;
  product_id: string;
  title: string;
  created_at: string;
}

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
          data.map((p: any) => ({
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
      const { data, error } = await supabase.functions.invoke("get-drive-link", {
        body: { product_id: productId },
      });

      if (error || !data?.drive_link) {
        toast({ title: "Error", description: data?.error || "Unable to get access link.", variant: "destructive" });
      } else {
        // Open in new tab
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
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-14 w-14 rounded-full" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
                {displayName?.toString().charAt(0) || "U"}
              </div>
            )}
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">{displayName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        <h2 className="mt-10 font-heading text-2xl font-bold text-foreground">Your Products</h2>

        {loadingPurchases ? (
          <div className="mt-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">No products yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Products you purchase will appear here with their access links.
            </p>
            <Link to="/products" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {purchases.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">Purchased: {p.created_at}</p>
                </div>
                <button
                  onClick={() => handleAccessLink(p.product_id)}
                  disabled={accessingLink === p.product_id}
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {accessingLink === p.product_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Access
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
