import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const CTASection = () => {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="scale">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-14 text-center md:p-20">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-15 blur-[100px]" style={{ background: "hsl(217 91% 60%)" }} />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full opacity-10 blur-[80px]" style={{ background: "hsl(199 89% 48%)" }} />
            
            <div className="relative">
              <span className="text-sm font-medium tracking-widest text-primary">NOT SURE WHICH PRODUCT FITS YOU?</span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-5xl">
                Ready to Level Up Your Content?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
                Join hundreds of creators who are already using our premium digital products to grow their audience.
              </p>
              <Link
                to="/products"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 active:scale-95"
              >
                Explore Products
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
