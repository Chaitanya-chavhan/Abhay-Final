import { Shield, Zap, Download, HeadphonesIcon, Lock, RefreshCw } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  { icon: Download, title: "Instant Delivery", desc: "Get access immediately after purchase. No waiting around." },
  { icon: Shield, title: "Secure Access", desc: "Private Google Drive links only you can access." },
  { icon: Lock, title: "Lifetime Access", desc: "Buy once, access forever. No subscriptions." },
  { icon: Zap, title: "HD Quality", desc: "All products in premium HD quality. No compromise." },
  { icon: RefreshCw, title: "Free Updates", desc: "Get new additions and updates at no extra cost." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Need help? We're always here for you." },
];

const FeaturesSection = () => {
  return (
    <section className="border-t border-border/50 bg-card/20 py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <span className="mb-4 block text-center text-sm font-medium tracking-widest text-primary">WHY CHOOSE US</span>
          <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-5xl">
            Why Creators Trust Us
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
