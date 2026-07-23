import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col opacity-0 animate-fade-in-up rounded-xl overflow-hidden bg-card border border-card-border card-hover"
      style={{ animationDelay: `${index * 0.07}s` }}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={product.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick-add overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
            <ShoppingBag className="w-3 h-3" /> View
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">{product.category.name}</span>
        <h3 className="font-medium text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <span className="mt-1 text-base font-bold text-primary">{formatCurrency(product.price)}</span>
      </div>
    </Link>
  );
}
