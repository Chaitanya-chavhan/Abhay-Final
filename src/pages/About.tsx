import { Shield, Users, Zap, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-medium text-primary">ABOUT US</span>
          <h1 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
            Empowering <span className="text-gradient">Content Creators</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            At Abhay Digital Product, we believe every creator deserves access to premium tools without 
            burning a hole in their pocket. We curate and deliver high-quality digital products — from 
            HD video clips to editing elements and courses — all at prices starting from just ₹29.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "500+ Creators", desc: "Trust our products" },
            { icon: Zap, title: "Instant Delivery", desc: "Via private Google Drive" },
            { icon: Shield, title: "100% Secure", desc: "Single-user access only" },
            { icon: Heart, title: "Made with Love", desc: "For Indian creators" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-foreground">How It Works</h2>
          <div className="mt-8 space-y-6">
            {[
              { step: "01", title: "Browse Products", desc: "Explore our collection of premium digital products." },
              { step: "02", title: "Make Payment", desc: "Pay securely via Razorpay (UPI, cards, wallets)." },
              { step: "03", title: "Get Access", desc: "Receive private Google Drive link in your dashboard instantly." },
              { step: "04", title: "Create & Grow", desc: "Use the resources to create amazing content and grow!" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary font-heading font-bold text-primary-foreground">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
