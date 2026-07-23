import { Link, useLocation } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveCartItem } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function CartSidebar() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { isOpen, setIsOpen } = useCartStore();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useGetCart({
    query: { enabled: isAuthenticated && isOpen, queryKey: ['/api/cart'] }
  });

  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    updateMutation.mutate({ id: itemId, data: { quantity: newQuantity } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart-nav'] });
      }
    });
  };

  const handleRemove = (itemId: number) => {
    removeMutation.mutate({ id: itemId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart-nav'] });
        toast.success("Item removed from cart");
      }
    });
  };

  const handleCheckout = () => {
    setIsOpen(false);
    setLocation("/checkout");
  };

  if (!isAuthenticated) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col border-l border-border bg-background p-0">
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="font-display font-bold text-2xl mb-2">Sign in to shop</h3>
            <p className="text-muted-foreground mb-8">Please log in or create an account to start curating your collection.</p>
            <Button className="rounded-none w-full h-12 uppercase tracking-widest text-xs" onClick={() => { setIsOpen(false); setLocation("/login"); }}>
              Log In
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col border-l border-border bg-background p-0">
        <SheetHeader className="p-6 border-b border-border text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display font-bold text-2xl">Cart</SheetTitle>
            <span className="text-sm font-medium text-muted-foreground">{cart?.items?.length || 0} items</span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">Loading...</div>
          ) : !hasItems ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
              <p>Your cart is currently empty.</p>
              <Button variant="link" className="mt-4 uppercase tracking-widest text-xs text-primary" onClick={() => { setIsOpen(false); setLocation("/products"); }}>
                Discover Objects
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-32 bg-secondary flex-shrink-0">
                    <img 
                      src={item.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.productId}`} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/products/${item.productId}`} onClick={() => setIsOpen(false)} className="font-medium hover:text-primary transition-colors text-sm">
                        {item.productName}
                      </Link>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-sm mb-4">{formatCurrency(item.price)}</span>
                    
                    <div className="mt-auto flex items-center border border-border h-8 w-24">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors"
                        disabled={updateMutation.isPending || item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center text-xs font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors"
                        disabled={updateMutation.isPending || item.quantity >= 10}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasItems && (
          <div className="p-6 bg-secondary/30 border-t border-border mt-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-sm uppercase tracking-widest">Subtotal</span>
              <span className="font-display font-bold text-2xl">{formatCurrency(cart.total)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6 text-center">Shipping & taxes calculated at checkout</p>
            <Button 
              className="w-full h-14 rounded-none uppercase tracking-widest text-sm relative overflow-hidden group"
              onClick={handleCheckout}
            >
              <span className="relative z-10 flex items-center gap-2">
                Checkout <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
