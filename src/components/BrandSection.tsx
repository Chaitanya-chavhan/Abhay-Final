import { ScrollReveal } from "@/hooks/useScrollReveal";

const BrandSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-8 sm:py-10">
      <ScrollReveal>
        <div className="py-6 sm:py-8 text-center">
          <h2
            className="font-heading text-3xl font-bold tracking-tight text-foreground/80 transition-all duration-700 hover:text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            ABHAY DIGITAL PRODUCTS
          </h2>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default BrandSection;
