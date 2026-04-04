const Terms = () => (
  <div className="min-h-screen pt-24">
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-4xl font-bold text-foreground">Terms and Conditions</h1>
      <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">By accessing and using Abhay Digital Products ("we", "our", "us"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">2. Products & Delivery</h2>
          <p className="mt-2">All products are digital and delivered via private Google Drive links accessible through your dashboard after successful payment. Products are for personal, non-commercial use unless explicitly stated otherwise.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">3. Payment</h2>
          <p className="mt-2">Payments are processed securely via Razorpay. We accept UPI, debit/credit cards, net banking, and wallets. All prices are listed in Indian Rupees (INR).</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">4. Usage Rights</h2>
          <p className="mt-2">Upon purchase, you receive a non-transferable, non-exclusive license to use the digital products. You may not redistribute, resell, share, or make the products available to third parties.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">5. Account Security</h2>
          <p className="mt-2">You are responsible for maintaining the confidentiality of your account. Sharing access links or credentials is strictly prohibited and may result in account termination.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">6. Intellectual Property</h2>
          <p className="mt-2">All content, branding, and materials on this website are owned by Abhay Digital Products and are protected by intellectual property laws.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">7. Limitation of Liability</h2>
          <p className="mt-2">We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">8. Changes to Terms</h2>
          <p className="mt-2">We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">9. Contact</h2>
          <p className="mt-2">For questions regarding these terms, contact us at <span className="text-primary">support@abhaydigital.com</span>.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
