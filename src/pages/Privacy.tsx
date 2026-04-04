const Privacy = () => (
  <div className="min-h-screen pt-24">
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-4xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p className="mt-2">We collect information you provide when signing in with Google, including your name, email address, and profile picture. We also collect payment information processed securely by Razorpay.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>To process your purchases and deliver digital products</li>
            <li>To manage your account and provide customer support</li>
            <li>To communicate order updates and important notices</li>
            <li>To improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">3. Data Security</h2>
          <p className="mt-2">We implement industry-standard security measures to protect your personal data. Payment processing is handled by Razorpay, a PCI-DSS compliant payment gateway. We do not store your card details.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">4. Third-Party Services</h2>
          <p className="mt-2">We use the following third-party services: Google (authentication), Razorpay (payments), Supabase (data storage), and Google Drive (product delivery). Each service has its own privacy policy.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">5. Cookies</h2>
          <p className="mt-2">We use essential cookies to maintain your session and authentication state. No tracking or advertising cookies are used.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">6. Data Retention</h2>
          <p className="mt-2">We retain your data as long as your account is active. You can request deletion of your account and associated data by contacting us.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">7. Your Rights</h2>
          <p className="mt-2">You have the right to access, correct, or delete your personal data. Contact us at <span className="text-primary">support@abhaydigital.com</span> for any data-related requests.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy;
