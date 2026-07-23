import { useListOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  const { data: orders, isLoading } = useListOrders({
    query: { queryKey: ['orders'] }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'PAID': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        
        <div className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">Order History</h1>
          <p className="text-muted-foreground">Track your recent purchases and view order details.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-32 rounded-none" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order, i) => (
              <Link 
                key={order.id} 
                href={`/orders/${order.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 border border-border bg-background hover:border-primary transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex flex-col gap-4 mb-6 md:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-lg tracking-tight">
                      Order #{order.id.toString().padStart(6, '0')}
                    </span>
                    <Badge variant="outline" className={`rounded-none text-[10px] tracking-widest uppercase font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="uppercase tracking-widest text-[10px] font-semibold text-foreground">Date</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="uppercase tracking-widest text-[10px] font-semibold text-foreground">Items</span>
                      <span>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="uppercase tracking-widest text-[10px] font-semibold text-foreground">Total</span>
                      <span className="font-medium text-foreground">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t border-border pt-4 md:border-0 md:pt-0">
                  <div className="flex -space-x-3 mr-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="w-10 h-10 border-2 border-background bg-secondary overflow-hidden rounded-full z-10">
                        <img 
                          src={item.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.productId}`} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 border-2 border-background bg-muted flex items-center justify-center rounded-full z-0 text-xs font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-white transition-colors rounded-full w-10 h-10">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-border bg-secondary/20 flex flex-col items-center">
            <div className="w-16 h-16 bg-background border border-border flex items-center justify-center rounded-full mb-6">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">When you make a purchase, it will appear here.</p>
            <Button asChild className="rounded-none h-12 px-8 uppercase tracking-widest text-xs">
              <Link href="/products">Start Shopping <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
