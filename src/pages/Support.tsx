import { Mail, Clock, MessageCircle } from "lucide-react";

const Support = () => (
  <div className="min-h-screen pt-24">
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-4xl font-bold text-foreground">Support</h1>
      <p className="mt-2 text-muted-foreground">We're here to help! Reach out to us through any of the channels below.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-heading font-semibold text-foreground">Email</h3>
          <p className="mt-1 text-sm text-primary">support@abhaydigital.com</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-heading font-semibold text-foreground">Hours</h3>
          <p className="mt-1 text-sm text-muted-foreground">Mon - Sat, 11am - 8pm IST</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-heading font-semibold text-foreground">Response Time</h3>
          <p className="mt-1 text-sm text-muted-foreground">Within 24 hours</p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-heading text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6">
          {[
            { q: "How do I access my purchased products?", a: "After successful payment, go to your Dashboard. You'll see all purchased products with an 'Access' button that opens your private Google Drive link." },
            { q: "Can I share my access link with others?", a: "No. Each product is licensed for single-user access only. Sharing links is prohibited and may result in account termination." },
            { q: "What payment methods do you accept?", a: "We accept UPI, debit/credit cards, net banking, and popular wallets via Razorpay." },
            { q: "I made a payment but don't see the product. What do I do?", a: "Refresh your dashboard. If the product still doesn't appear within 5 minutes, email us with your payment details at support@abhaydigital.com." },
            { q: "Do you offer refunds?", a: "Since products are digital and delivered instantly, refunds are generally not offered. See our Refund Policy for exceptions." },
          ].map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold text-foreground">{item.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Support;
