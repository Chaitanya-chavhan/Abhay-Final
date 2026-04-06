import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
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

  const navLinks = isAdmin
    ? [
        { to: "/admin", label: "Admin" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
      ];

  return (
    <>
      <div className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-in-out ${scrolled ? "top-3" : "top-5"}`}>
        <nav
          className={`flex w-full max-w-5xl items-center justify-between gap-2 sm:gap-4 rounded-full px-4 py-3 transition-all duration-500 ease-in-out backdrop-blur-2xl ${
            scrolled 
              ? "bg-background/80 md:bg-card/70 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-border/50 translate-y-0" 
              : "bg-background/60 md:bg-card/30 shadow-md ring-1 ring-border/20 translate-y-0"
          }`}
        >
          <div className="flex shrink-0 items-center justify-start flex-1 min-w-[150px]">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex shrink-0 items-center gap-2 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <span className="font-heading text-sm font-bold">A</span>
              </div>
              <span className="font-heading text-base font-extrabold tracking-widest text-foreground transition-colors duration-300 group-hover:text-primary hidden sm:inline-block">
                ABHAY DIGITAL
              </span>
            </Link>
          </div>

          <div className="hidden min-w-0 md:flex flex-none items-center justify-center">
            <div className="flex items-center gap-1 rounded-full p-1 bg-secondary/50 ring-1 ring-border/20 shadow-inner">
              {navLinks.map((l) => (
                <button
                  key={l.to}
                  onClick={() => handleNavClick(l.to)}
                  className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300 ${
                    isActive(l.to) ? "bg-white text-foreground shadow-sm dark:bg-zinc-800" : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end flex-1 gap-2 min-w-[150px]">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-md px-3 py-1.5 shadow-sm">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-6 w-6 rounded-full ring-2 ring-primary/20" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <span className="max-w-[120px] truncate text-sm font-medium text-foreground hidden md:inline-block">{displayName?.toString().split(" ")[0]}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout} className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:opacity-90 hover:shadow"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative z-50 flex h-9 w-9 items-center justify-center rounded-full bg-secondary/50 text-foreground ring-1 ring-border/30 md:hidden"
              aria-expanded={open}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        className={`fixed right-0 top-0 z-[70] h-full w-[280px] border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-8 pt-6">
          <div className="flex items-center justify-between mb-8">
            <span className="font-heading text-lg font-bold">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/50 text-foreground ring-1 ring-border/30 hover:bg-secondary/80 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
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
