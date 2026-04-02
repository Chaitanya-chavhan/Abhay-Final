import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="font-heading text-lg font-bold text-primary-foreground">A</span>
              </div>
              <span className="font-heading text-lg font-semibold text-foreground">Abhay Digital</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Premium digital products for content creators. HD clips, editing elements, courses, and more at unbeatable prices.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Legal</h4>
            <div className="mt-3 flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Terms of Service</span>
              <span className="text-sm text-muted-foreground">Refund Policy</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Abhay Digital Product. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
