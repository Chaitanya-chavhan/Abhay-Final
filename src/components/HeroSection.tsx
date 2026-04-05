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
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-8 blur-[150px]" style={{ background: "hsl(217 91% 60%)" }} />
      <div className="absolute right-0 top-3/4 h-[250px] w-[250px] rounded-full opacity-6 blur-[120px]" style={{ background: "hsl(199 89% 48%)" }} />

      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
        <div className="mb-6 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-wider text-primary backdrop-blur-sm sm:px-5 sm:py-2 sm:text-sm">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            BROWSE. BUY. CREATE.
          </span>
        </div>

        <h1 className="animate-slide-up font-heading text-3xl font-bold leading-[1.1] text-foreground tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
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
            <span className="relative ml-2 sm:ml-3 inline-block">
              <span className="relative z-10">Prices!</span>
              <span className="absolute -bottom-0.5 left-0 h-2 w-full rounded bg-primary/15 sm:-bottom-1 sm:h-3" />
            </span>
          </span>
        </h1>

        <p className="animate-slide-up mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-8 sm:max-w-2xl sm:text-lg md:text-xl" style={{ animationDelay: "0.15s" }}>
          Join a growing community of creators getting premium digital assets — HD clips,
          editing elements, courses & more — all in one place.
        </p>

        <div className="animate-slide-up mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:mt-6 sm:gap-6 sm:text-sm" style={{ animationDelay: "0.2s" }}>
          <span className="flex items-center gap-1.5 sm:gap-2"><Shield className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> Secure Access</span>
          <span className="flex items-center gap-1.5 sm:gap-2"><Download className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> Instant Delivery</span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-primary font-bold">500+</span> Happy Customers
          </span>
        </div>

        <div className="animate-slide-up mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:gap-4" style={{ animationDelay: "0.25s" }}>
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 active:scale-95 sm:px-10 sm:py-4 sm:text-base"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <Link
            to="/about"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary hover:border-primary/40 sm:px-10 sm:py-4 sm:text-base"
          >
            Learn More
          </Link>
        </div>

        <div className="animate-slide-up mt-16 grid w-full max-w-3xl grid-cols-3 gap-3 sm:mt-24 sm:gap-4 md:gap-6" style={{ animationDelay: "0.35s" }}>
          {[
            { value: "500+", label: "Happy Customers" },
            { value: "10k+", label: "Products Delivered" },
            { value: "₹49", label: "Starting Price" },
          ].map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:rounded-2xl sm:p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="font-heading text-xl font-bold text-gradient sm:text-3xl md:text-4xl">{s.value}</div>
                <div className="mt-1 text-[10px] text-muted-foreground sm:mt-2 sm:text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
