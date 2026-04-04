import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Download } from "lucide-react";
import { useEffect, useState } from "react";

const words = ["Digital Products", "YouTube Bundles", "Editing Elements", "Premium Courses"];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setShow(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[150px]" style={{ background: "hsl(217 91% 60%)" }} />
      <div className="absolute right-0 top-3/4 h-[300px] w-[300px] rounded-full opacity-8 blur-[120px]" style={{ background: "hsl(199 89% 48%)" }} />

      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            BROWSE. BUY. CREATE.
          </span>
        </div>

        <h1 className="animate-slide-up font-heading text-5xl font-bold leading-[1.1] text-foreground sm:text-6xl md:text-8xl tracking-tight">
          Get Premium{" "}
          <span
            className={`inline-block text-gradient transition-all duration-400 ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ minWidth: "3ch" }}
          >
            {words[wordIndex]}
          </span>
          <br />
          <span className="relative">
            At Unbeatable
            <span className="relative ml-3 inline-block">
              <span className="relative z-10">Prices!</span>
              <span className="absolute -bottom-1 left-0 h-3 w-full rounded bg-primary/15" />
            </span>
          </span>
        </h1>

        <p className="animate-slide-up mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: "0.15s" }}>
          Join a growing community of creators getting premium digital assets — HD clips,
          editing elements, courses & more — all in one place.
        </p>

        <div className="animate-slide-up mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground" style={{ animationDelay: "0.2s" }}>
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Secure Access</span>
          <span className="flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Instant Delivery</span>
          <span className="flex items-center gap-2">
            <span className="text-primary font-bold">500+</span> Happy Customers
          </span>
        </div>

        <div className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row" style={{ animationDelay: "0.25s" }}>
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 active:scale-95"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <Link
            to="/about"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full border border-border px-10 py-4 text-base font-medium text-foreground transition-all duration-300 hover:bg-secondary hover:border-primary/40"
          >
            Learn More
          </Link>
        </div>

        <div className="animate-slide-up mt-24 grid w-full max-w-3xl grid-cols-3 gap-4 md:gap-6" style={{ animationDelay: "0.35s" }}>
          {[
            { value: "500+", label: "Happy Customers" },
            { value: "10k+", label: "Products Delivered" },
            { value: "₹49", label: "Starting Price" },
          ].map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="font-heading text-2xl font-bold text-gradient sm:text-3xl md:text-4xl">{s.value}</div>
                <div className="mt-2 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 p-1">
            <div className="h-2 w-1.5 mx-auto rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
