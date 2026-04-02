import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Package, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;

  // TODO: Fetch purchased products from Firestore
  const purchasedProducts: { id: string; title: string; link: string; purchasedAt: string }[] = [];

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="h-14 w-14 rounded-full" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
                {user.displayName?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">{user.displayName}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Purchased Products */}
        <h2 className="mt-10 font-heading text-2xl font-bold text-foreground">Your Products</h2>

        {purchasedProducts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">No products yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Products you purchase will appear here with their access links.
            </p>
            <a href="/products" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Browse Products →
            </a>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {purchasedProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">Purchased: {p.purchasedAt}</p>
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <ExternalLink className="h-4 w-4" /> Access
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
