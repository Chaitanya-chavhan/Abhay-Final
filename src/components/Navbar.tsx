import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-card/90 border-b border-border shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-110">
              <span className="font-heading text-lg font-bold text-primary-foreground">A</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-sm font-bold text-foreground">Abhay Digital</span>
              <span className="text-[10px] text-muted-foreground">Products</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 rounded-full border border-border bg-secondary/60 px-1.5 py-1 backdrop-blur-sm md:flex">
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

          {/* Desktop Auth */}
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
              <Link
                to="/auth"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl text-foreground md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-[280px] bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.to}
                onClick={() => handleNavClick(l.to)}
                className={`flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive(l.to) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="my-4 border-t border-border" />

          {user ? (
            <div className="flex flex-col gap-1">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground truncate">{displayName?.toString().split(" ")[0]}</span>
              </div>

              {isAdmin && (
                <button onClick={() => handleNavClick("/admin")} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-primary hover:bg-secondary">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </button>
              )}
              <button onClick={() => handleNavClick("/dashboard")} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-foreground hover:bg-secondary">
                <Package className="h-4 w-4" />
                Dashboard
              </button>

              <div className="mt-auto pt-4">
                <button onClick={() => { logout(); setOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
