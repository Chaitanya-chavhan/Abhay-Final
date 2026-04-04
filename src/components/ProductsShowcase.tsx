import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { categories, type Product } from "@/lib/products";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const ProductsShowcase = ({ showAll = false }: { showAll?: boolean }) => {
  const [active, setActive] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, description, price, original_price, category, image_url, features, tag, is_active, created_at, updated_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);
  const display = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          {!showAll && (
            <div className="mb-4 text-center">
              <span className="text-sm font-medium tracking-widest text-primary">OUR PRODUCTS</span>
            </div>
          )}
          <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-5xl">
            {showAll ? "All Products" : "Explore Our Digital Products"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Premium digital assets at prices that won't break the bank. Instant delivery to your account.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  active === c
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15 scale-105"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : display.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((p, i) => (
              <ScrollReveal key={p.id} delay={0.1 + i * 0.1} direction="up">
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {!showAll && filtered.length > 6 && (
          <ScrollReveal delay={0.2}>
            <div className="mt-12 text-center">
              <Link
                to="/products"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/5"
              >
                View All Products
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default ProductsShowcase;
