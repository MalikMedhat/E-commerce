import { useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmation() {
  const { id } = useParams();
  const orderId = Number(id);
  const [, setLocation] = useLocation();

  const { data: order, isLoading, error } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: ['order', orderId] }
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <Button onClick={() => setLocation("/orders")} className="rounded-none">View All Orders</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary/20">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        
        {isLoading ? (
          <div className="bg-background border border-border p-8 md:p-12 text-center animate-pulse">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
            <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-12" />
            <div className="space-y-4 max-w-md mx-auto text-left">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <div className="bg-background border border-border shadow-xl shadow-black/5 animate-fade-in-up">
            
            {/* Header */}
            <div className="p-8 md:p-12 text-center border-b border-border bg-primary/5">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">Thank You</h1>
              <p className="text-muted-foreground text-lg mb-2">Your order has been placed successfully.</p>
              <p className="text-sm font-medium">Order #{order?.id.toString().padStart(6, '0')}</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Order Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{order ? formatDate(order.createdAt) : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-primary">{order?.status}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Delivery</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We will send a confirmation email with tracking information once your order has shipped.
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-12">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-2">Items ordered</h3>
                <div className="space-y-6">
                  {order?.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-secondary flex-shrink-0">
                        <img 
                          src={item.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.productId}`} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-medium text-sm mb-1">{item.productName}</h4>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center font-medium">
                        {formatCurrency(item.priceAtPurchase * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-secondary/30 p-6 flex justify-between items-center mb-8 border border-border">
                <span className="font-display font-semibold text-lg">Total Paid</span>
                <span className="font-display font-bold text-2xl text-primary">{formatCurrency(order?.total || 0)}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="h-14 rounded-none uppercase tracking-widest text-xs flex-1">
                  <Link href={`/orders/${order?.id}`}><Package className="w-4 h-4 mr-2" /> View Order Status</Link>
                </Button>
                <Button asChild className="h-14 rounded-none uppercase tracking-widest text-xs flex-1">
                  <Link href="/products">Continue Shopping <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
