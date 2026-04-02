import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-background p-12 text-center md:p-16">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-20 blur-[80px]" style={{ background: "hsl(25 95% 53%)" }} />
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Ready to Level Up Your Content?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join hundreds of creators who are already using our premium digital products to grow their audience.
          </p>
          <Link
            to="/products"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-glow"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
