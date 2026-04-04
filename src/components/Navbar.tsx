import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (to: string) => {
    setOpen(false);
    navigate(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;

  return (
    <nav
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
        scrolled
          ? "w-[95%] max-w-5xl rounded-2xl border border-border bg-card/80 shadow-lg shadow-foreground/5 backdrop-blur-2xl"
          : "w-[95%] max-w-6xl rounded-2xl border border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-110">
            <span className="font-heading text-lg font-bold text-primary-foreground">A</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-bold text-foreground">Abhay Digital</span>
            <span className="text-[10px] text-muted-foreground">Products</span>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 rounded-full border border-border bg-secondary/60 px-1.5 py-1 backdrop-blur-sm md:flex">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => handleNavClick(l.to)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-full text-primary hover:text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/dashboard" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full text-muted-foreground hover:text-foreground">
                  <Package className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">{displayName?.toString().split(" ")[0]}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-96 border-t border-border" : "max-h-0"
        }`}
      >
        <div className="p-4 space-y-1">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => handleNavClick(l.to)}
              className={`block w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive(l.to) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {l.label}
            </button>
          ))}
          {user ? (
            <>
              {isAdmin && (
                <button onClick={() => handleNavClick("/admin")} className="block w-full text-left rounded-xl px-4 py-3 text-sm text-primary hover:bg-secondary">
                  Admin Dashboard
                </button>
              )}
              <button onClick={() => handleNavClick("/dashboard")} className="block w-full text-left rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-secondary">
                Dashboard
              </button>
              <button onClick={() => { logout(); setOpen(false); }} className="w-full rounded-xl px-4 py-3 text-left text-sm text-destructive hover:bg-secondary">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => { signInWithGoogle(); setOpen(false); }} className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
