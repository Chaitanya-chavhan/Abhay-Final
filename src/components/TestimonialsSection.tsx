import { Star } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Rahul Verma",
    role: "YouTube Creator",
    text: "The IPL clips bundle is insane! Got 6000+ clips for just ₹49. My Shorts are getting 10x more views now.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Instagram Influencer",
    text: "The Reels pack saved me hours of editing. Trending transitions and effects that actually work. Best investment!",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Content Creator",
    text: "Bought the Mega Bundle and it's worth every rupee. Everything a creator needs in one package. Highly recommended!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="border-t border-border/50 bg-background py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <span className="mb-4 block text-center text-sm font-medium tracking-widest text-primary">TESTIMONIALS</span>
          <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-5xl">
            Hear From Our Customers
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.12}>
              <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-all duration-500 hover:border-primary/30 hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
