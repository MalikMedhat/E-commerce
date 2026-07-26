import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="flex-1 p-4">
        <Badge variant="secondary" className="mb-2">
          {product.category?.name ?? "Uncategorized"}
        </Badge>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <div className="font-bold text-2xl text-primary">
          ${product.price.toFixed(2)}
        </div>
        <Button onClick={() => onAddToCart(product)} size="sm">
          <ShoppingCart className="size-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
