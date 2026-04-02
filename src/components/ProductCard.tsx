import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

const ProductCard = ({ product }: { product: Product }) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
    >
      {product.tag && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {product.tag}
        </span>
      )}

      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
          <span className="font-heading text-3xl font-bold text-primary/60">{product.title.charAt(0)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium text-primary">{product.category}</span>
        <h3 className="mt-1 font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-xl font-bold text-foreground">₹{product.price}</span>
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
            <span className="text-xs font-semibold text-primary">{discount}% off</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
