import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/products";

const ProductCard = ({ product }: { product: Product }) => {
  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  return (
    <Link
      to={`/product/${product.id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2"
    >
      {product.tag && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20">
          {product.tag}
        </span>
      )}

      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-secondary transition-all duration-700 group-hover:scale-110">
            <span className="font-heading text-5xl font-bold text-primary/30 transition-all duration-500 group-hover:text-primary/50 group-hover:scale-110">{product.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-all duration-500 group-hover:bg-primary/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">{product.category}</span>
        <h3 className="mt-2 font-heading text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-border mt-5">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-foreground">₹{product.price}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.original_price}</span>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{discount}% OFF</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
