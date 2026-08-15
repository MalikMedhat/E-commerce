import { useGetOrder, useCancelOrder } from "@workspace/api-client-react";
import { Link, useParams, useLocation } from "wouter";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Ban, CreditCard, Truck, PackageCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OrderDetail() {
  const { id } = useParams();
  const orderId = Number(id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: ['order', orderId] }
  });

  const cancelMutation = useCancelOrder();

  const handleCancel = () => {
    cancelMutation.mutate({ id: orderId }, {
      onSuccess: () => {
        toast.success("Order cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      onError: (err) => {
        toast.error(err.data?.error || "Failed to cancel order");
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-display font-bold mb-4">Order Not Found</h2>
        <Button variant="outline" className="rounded-none" onClick={() => setLocation("/orders")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  const isCancelable = order?.status === 'PENDING' || order?.status === 'PAID';

  const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
  const currentStatusIndex = statuses.indexOf(order?.status || 'PENDING');
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <AlertCircle className="w-5 h-5" />;
      case 'PAID': return <CreditCard className="w-5 h-5" />;
      case 'SHIPPED': return <Truck className="w-5 h-5" />;
      case 'DELIVERED': return <PackageCheck className="w-5 h-5" />;
      case 'CANCELLED': return <Ban className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary/10">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        
        <div className="mb-8">
          <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 w-fit mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
            <div>
              {isLoading ? (
                <Skeleton className="h-10 w-48 mb-2" />
              ) : (
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter mb-2">
                  Order #{order?.id.toString().padStart(6, '0')}
                </h1>
              )}
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <p className="text-muted-foreground text-sm">Placed on {order ? formatDate(order.createdAt) : ''}</p>
              )}
            </div>
            
            {order && isCancelable && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="rounded-none border-destructive text-destructive hover:bg-destructive hover:text-white">
                    <Ban className="w-4 h-4 mr-2" /> Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">Cancel Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this order? This action cannot be undone. 
                      Since it hasn't shipped yet, you will receive a full refund.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none">No, keep order</AlertDialogCancel>
                    <AlertDialogAction 
                      className="rounded-none bg-destructive hover:bg-destructive/90"
                      onClick={handleCancel}
                      disabled={cancelMutation.isPending}
                    >
                      Yes, cancel order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="h-64 col-span-2" />
              <Skeleton className="h-64 col-span-1" />
            </div>
          </div>
        ) : order ? (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Status Timeline */}
            <div className="bg-background border border-border p-6 md:p-8">
              <h3 className="font-display font-semibold text-lg mb-8">Status Tracker</h3>
              
              {order.status === 'CANCELLED' ? (
                <div className="flex items-center gap-4 text-destructive bg-destructive/10 p-4 border border-destructive/20">
                  <Ban className="w-6 h-6" />
                  <div>
                    <h4 className="font-bold tracking-tight">Order Cancelled</h4>
                    <p className="text-sm opacity-80">This order has been cancelled and refunded.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-secondary hidden md:block" />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {statuses.map((s, i) => {
                      const isCompleted = i <= currentStatusIndex;
                      const isCurrent = i === currentStatusIndex;
                      
                      return (
                        <div key={s} className={`relative flex md:flex-col items-center md:items-start gap-4 md:gap-4 z-10 ${isCompleted ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-background ${
                            isCurrent ? 'border-primary text-primary' : 
                            isCompleted ? 'border-foreground text-foreground' : 'border-border'
                          }`}>
                            {getStatusIcon(s)}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-widest ${isCurrent ? 'text-primary' : ''}`}>{s}</h4>
                            {isCurrent && <p className="text-xs text-muted-foreground mt-1">Current state</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Items */}
              <div className="lg:col-span-2 bg-background border border-border">
                <div className="p-6 border-b border-border">
                  <h3 className="font-display font-semibold text-lg">Items</h3>
                </div>
                <div className="divide-y divide-border">
                  {order.items.map(item => (
                    <div key={item.id} className="p-6 flex gap-6">
                      <div className="w-24 h-32 bg-secondary flex-shrink-0">
                        <img 
                          src={item.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.productId}`} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary transition-colors">
                            {item.productName}
                          </Link>
                          <span className="font-semibold">{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground mb-auto">{formatCurrency(item.priceAtPurchase)} each</span>
                        <span className="text-xs font-semibold uppercase tracking-widest bg-secondary w-fit px-2 py-1 mt-4">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-8">
                <div className="bg-background border border-border p-6 sticky top-24">
                  <h3 className="font-display font-semibold text-lg mb-6 border-b border-border pb-4">Payment Summary</h3>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Complimentary</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center font-bold text-lg border-t border-border pt-4">
                    <span>Total Paid</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>
                
                <div className="bg-secondary/30 border border-border p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about this order, please contact our support team.
                  </p>
                  <Button variant="outline" className="w-full rounded-none bg-background">Contact Support</Button>
                </div>
              </div>

            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
