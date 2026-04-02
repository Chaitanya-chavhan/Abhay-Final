import { Shield, Zap, Download, HeadphonesIcon, Lock, RefreshCw } from "lucide-react";

const features = [
  { icon: Download, title: "Instant Delivery", desc: "Get access immediately after purchase. No waiting." },
  { icon: Shield, title: "Secure Access", desc: "Private Google Drive links only you can access." },
  { icon: Lock, title: "Lifetime Access", desc: "Buy once, access forever. No subscriptions." },
  { icon: Zap, title: "HD Quality", desc: "All products in premium HD quality. No compromise." },
  { icon: RefreshCw, title: "Free Updates", desc: "Get new additions and updates at no extra cost." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Need help? We're always here for you." },
];

const FeaturesSection = () => {
  return (
    <section className="border-t border-border bg-card/30 py-20">
      <div className="container mx-auto px-4">
        <span className="mb-4 block text-center text-sm font-medium text-primary">WHY CHOOSE US</span>
        <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">
          Why Creators Trust Us
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
