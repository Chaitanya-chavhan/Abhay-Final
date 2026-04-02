import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { products, categories } from "@/lib/products";

const ProductsShowcase = ({ showAll = false }: { showAll?: boolean }) => {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);
  const display = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        {!showAll && (
          <div className="mb-4 text-center">
            <span className="text-sm font-medium text-primary">OUR PRODUCTS</span>
          </div>
        )}
        <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">
          {showAll ? "All Products" : "Explore Our Digital Products"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Premium digital assets at prices that won't break the bank. Instant delivery to your account.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {!showAll && filtered.length > 6 && (
          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsShowcase;
