import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const desktopNavLinks = [
  { to: "/products", label: "Products" },
  { to: "/refund", label: "Refund Policy" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-border backdrop-blur-md bg-background/90 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center gap-4 px-4 py-3 md:px-6">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex shrink-0 items-center gap-3 group"
          >
            <img
              src="/placeholder.svg"
              alt=""
              className="h-10 w-10 rounded-full border border-border object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-heading text-base font-bold text-foreground">Abhay Platforms</span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-6 md:flex">
            <div className="flex flex-wrap items-center justify-end gap-1">
              {desktopNavLinks.map((l) => (
                <button
                  key={l.to}
                  onClick={() => handleNavClick(l.to)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(l.to) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-3">
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
                    <span className="max-w-[120px] truncate text-sm text-foreground">{displayName?.toString().split(" ")[0]}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout} className="rounded-full text-muted-foreground hover:text-foreground">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative z-50 ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-foreground md:ml-0 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        className={`fixed right-0 top-0 z-40 h-full w-[280px] border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-8 pt-20">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleNavClick("/")}
              className={`flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              Home
            </button>
            {desktopNavLinks.map((l) => (
              <button
                key={l.to}
                type="button"
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
              <div className="flex items-center gap-3 px-4 py-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span className="truncate text-sm font-medium text-foreground">{displayName?.toString().split(" ")[0]}</span>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleNavClick("/admin")}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-primary hover:bg-secondary"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={() => handleNavClick("/dashboard")}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Package className="h-4 w-4" />
                Dashboard
              </button>

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
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
