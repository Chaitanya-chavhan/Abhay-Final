import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Download } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero-gradient pt-24">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, hsl(0 0% 30%) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      {/* Glow orb */}
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]" style={{ background: "hsl(25 95% 53%)" }} />

      <div className="container relative mx-auto flex flex-col items-center px-4 pt-20 text-center">
        <span className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap className="h-3.5 w-3.5" /> Premium Digital Products
        </span>

        <h1 className="animate-slide-up font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-7xl">
          Get Premium{" "}
          <span className="text-gradient">Digital Products</span>
          <br />
          At Unbeatable Prices!
        </h1>

        <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: "0.1s" }}>
          HD video clips, editing elements, courses, templates & more.
          Everything you need to create amazing content — all in one place.
        </p>

        <div className="animate-slide-up mt-4 flex items-center gap-6 text-sm text-muted-foreground" style={{ animationDelay: "0.15s" }}>
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Secure Access</span>
          <span className="flex items-center gap-1.5"><Download className="h-4 w-4 text-primary" /> Instant Delivery</span>
        </div>

        <div className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row" style={{ animationDelay: "0.2s" }}>
          <Link
            to="/products"
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:shadow-glow"
          >
            Explore Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-border px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Learn More
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-slide-up mt-20 grid w-full max-w-3xl grid-cols-3 gap-4" style={{ animationDelay: "0.3s" }}>
          {[
            { value: "500+", label: "Happy Customers" },
            { value: "10k+", label: "Products Delivered" },
            { value: "₹49", label: "Starting Price" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
              <div className="font-heading text-2xl font-bold text-gradient sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
