import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useGetProduct, useGetRelatedProducts, useAddCartItem } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { setIsOpen: setCartOpen } = useCartStore();
  const queryClient = useQueryClient();
  
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: ['product', productId] }
  });

  const { data: relatedProducts, isLoading: isLoadingRelated } = useGetRelatedProducts(productId, {
    query: { enabled: !!productId, queryKey: ['product-related', productId] }
  });

  const addCartItemMutation = useAddCartItem();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart");
      setLocation("/login");
      return;
    }

    addCartItemMutation.mutate(
      { data: { productId, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart-nav'] });
          queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
          toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
          setCartOpen(true);
        },
        onError: (err) => {
          toast.error(err.data?.error || "Failed to add item to cart");
        }
      }
    );
  };

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-display font-bold mb-4">Product Not Found</h2>
        <Button variant="outline" className="rounded-none" onClick={() => setLocation("/products")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 md:px-6 mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-fade-in-up">
          <button onClick={() => setLocation("/")} className="hover:text-foreground transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => setLocation("/products")} className="hover:text-foreground transition-colors">Shop</button>
          <span>/</span>
          {isLoading ? (
            <Skeleton className="w-20 h-4" />
          ) : (
            <span className="text-foreground font-medium">{product?.name}</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
          {/* Images */}
          <div className="animate-fade-in-up">
            {isLoading ? (
              <Skeleton className="w-full aspect-[4/5] rounded-none" />
            ) : (
              <div className="w-full aspect-[4/5] bg-secondary relative overflow-hidden">
                <img 
                  src={product?.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${productId}`}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {isLoading ? (
              <>
                <Skeleton className="w-24 h-5 mb-4" />
                <Skeleton className="w-full h-12 mb-4" />
                <Skeleton className="w-32 h-8 mb-8" />
                <Skeleton className="w-full h-24 mb-10" />
                <Skeleton className="w-full h-14" />
              </>
            ) : (
              <>
                <div className="mb-8 border-b border-border pb-8">
                  <span className="text-primary font-medium tracking-widest uppercase text-xs mb-3 block">
                    {product?.category.name}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">
                    {product?.name}
                  </h1>
                  <span className="text-2xl font-medium">{product ? formatCurrency(product.price) : ''}</span>
                </div>

                <div className="prose prose-neutral dark:prose-invert mb-10 text-muted-foreground">
                  <p className="leading-relaxed">{product?.description}</p>
                </div>

                <div className="flex flex-col gap-6 mt-auto">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center border border-border h-12 w-32">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center font-medium">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors"
                        disabled={quantity >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="h-14 rounded-none text-sm uppercase tracking-widest w-full gap-2 relative overflow-hidden group"
                    onClick={handleAddToCart}
                    disabled={addCartItemMutation.isPending}
                    data-testid="button-add-to-cart"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      {addCartItemMutation.isPending ? "Adding..." : "Add to Cart"}
                    </span>
                    <div className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </Button>

                  <div className="mt-8 grid grid-cols-2 gap-4 text-xs tracking-wide text-muted-foreground border-t border-border pt-8">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground uppercase">Shipping</span>
                      <span>Complimentary worldwide delivery on orders over $500.</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground uppercase">Returns</span>
                      <span>30-day return window. Items must be unused and in original packaging.</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-border">
            <h3 className="text-2xl font-display font-bold tracking-tight mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp, i) => (
                <ProductCard key={rp.id} product={rp} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
