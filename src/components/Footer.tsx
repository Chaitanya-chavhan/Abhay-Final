import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="font-heading text-xl font-bold text-primary-foreground">A</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-sm font-bold text-foreground">Abhay Digital</span>
                <span className="text-[10px] text-muted-foreground">Products</span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium digital products for content creators. HD clips, editing elements, courses, and more at unbeatable prices.
            </p>
            <div className="mt-6 flex gap-3">
              {["Instagram", "YouTube", "Twitter"].map((s) => (
                <div
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:scale-110 cursor-pointer"
                >
                  <span className="text-xs font-bold">{s.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">About</h4>
            <div className="mt-5 flex flex-col gap-3">
              <button onClick={() => handleNavClick("/about")} className="text-left text-sm text-muted-foreground transition-colors duration-200 hover:text-primary">About Us</button>
              <button onClick={() => handleNavClick("/products")} className="text-left text-sm text-muted-foreground transition-colors duration-200 hover:text-primary">Products</button>
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors duration-200 hover:text-primary">Support</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">Legal</h4>
            <div className="mt-5 flex flex-col gap-3">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors duration-200 hover:text-primary">Terms and Conditions</span>
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors duration-200 hover:text-primary">Privacy Policy</span>
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors duration-200 hover:text-primary">Refund Policy</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">Contact</h4>
            <div className="mt-5 flex flex-col gap-3">
              <div>
                <span className="text-sm font-medium text-primary">Online: 11am - 8pm</span>
              </div>
              <span className="text-sm text-muted-foreground">support@abhaydigital.com</span>
              <span className="text-sm text-muted-foreground">India</span>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-border/30 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Abhay Digital Products. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
