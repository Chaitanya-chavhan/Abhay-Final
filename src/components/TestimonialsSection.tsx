import { Star } from "lucide-react";

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
    <section className="border-t border-border bg-background py-20">
      <div className="container mx-auto px-4">
        <span className="mb-4 block text-center text-sm font-medium text-primary">TESTIMONIALS</span>
        <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">
          Hear From Our Customers
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
