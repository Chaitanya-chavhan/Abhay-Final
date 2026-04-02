import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="font-heading text-lg font-semibold text-foreground">
            Abhay Digital
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-secondary/50 px-2 py-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Package className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">{user.displayName?.split(" ")[0]}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={signInWithGoogle} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive(l.to) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-sm text-muted-foreground">
                Dashboard
              </Link>
              <button onClick={() => { logout(); setOpen(false); }} className="w-full rounded-lg px-4 py-3 text-left text-sm text-destructive">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => { signInWithGoogle(); setOpen(false); }} className="mt-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
              Sign In with Google
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
