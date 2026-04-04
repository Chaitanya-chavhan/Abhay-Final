const Refund = () => (
  <div className="min-h-screen pt-24">
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-4xl font-bold text-foreground">Refund Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Digital Products — No Refund Policy</h2>
          <p className="mt-2">Since all our products are digital and delivered instantly via Google Drive, <strong className="text-foreground">we do not offer refunds</strong> once the product has been delivered to your account.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Exceptions</h2>
          <p className="mt-2">Refunds may be considered in the following cases:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You were charged multiple times for the same product</li>
            <li>The product delivered is significantly different from what was described</li>
            <li>Technical issues prevented you from accessing the product (after our support team has attempted to resolve the issue)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">How to Request a Refund</h2>
          <p className="mt-2">If you believe you qualify for a refund, please email us at <span className="text-primary">support@abhaydigital.com</span> within 48 hours of purchase with:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Your registered email address</li>
            <li>Order/product details</li>
            <li>Reason for the refund request</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Processing Time</h2>
          <p className="mt-2">Approved refunds will be processed within 5-7 business days and credited to the original payment method.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Refund;
