import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetCart, useCheckout } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);

  const { data: cart, isLoading: isCartLoading } = useGetCart({
    query: { queryKey: ['/api/cart'] }
  });

  const checkoutMutation = useCheckout();

  useEffect(() => {
    if (!isCartLoading && (!cart?.items || cart.items.length === 0) && step === 1) {
      toast.error("Your cart is empty");
      setLocation("/products");
    }
  }, [cart, isCartLoading, step, setLocation]);

  const handleCreateOrder = () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    checkoutMutation.mutate(
      { data: { shippingAddress } },
      {
        onSuccess: (order) => {
          toast.success("Order submitted successfully");
          setLocation(`/order-confirmation/${order.id}`);
        },
        onError: (err) => {
          toast.error(err.data?.error || "Checkout failed");
        }
      }
    );
  };

  const steps = [
    { num: 1, title: "Review" },
    { num: 2, title: "Shipping" },
    { num: 3, title: "Confirm" }
  ];

  if (isCartLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary/20">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tighter mb-8">Checkout</h1>

          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step > s.num ? 'bg-primary border-primary text-white' : step === s.num ? 'border-primary text-primary' : 'border-muted-foreground/30'}`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold hidden sm:block">{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-[2px] mx-2 sm:mx-4 mb-5 sm:mb-6 ${step > s.num ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 order-2 lg:order-1">
            {step === 1 && (
              <div className="bg-background border border-border p-6 md:p-8 animate-fade-in-up">
                <h2 className="text-xl font-display font-semibold mb-6">Review Your Order</h2>
                <div className="divide-y divide-border border-y border-border mb-8">
                  {cart?.items.map(item => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <img src={item.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${item.productId}`} className="w-16 h-20 object-cover bg-secondary" alt={item.productName} />
                      <div className="flex-1 flex justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{item.productName}</h4>
                          <p className="text-muted-foreground text-sm mt-1">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-14 rounded-none uppercase tracking-widest" onClick={() => setStep(2)}>
                  Continue to Shipping <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-background border border-border p-6 md:p-8 animate-fade-in-up">
                <h2 className="text-xl font-display font-semibold mb-6">Shipping Address</h2>
                <div className="space-y-6 mb-8">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Full Address</Label>
                    <textarea
                      className="w-full min-h-[120px] p-3 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-transparent resize-none"
                      placeholder="Enter your full shipping address..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="w-1/3 h-14 rounded-none uppercase tracking-widest" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="w-2/3 h-14 rounded-none uppercase tracking-widest" onClick={() => {
                    if (!shippingAddress.trim()) {
                      toast.error("Shipping address required");
                      return;
                    }
                    setStep(3);
                  }}>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-background border border-border p-6 md:p-8 animate-fade-in-up">
                <h2 className="text-xl font-display font-semibold mb-6">Billing Address</h2>

                <div className="mb-8 space-y-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary text-primary rounded-none border-border"
                      checked={useShippingForBilling}
                      onChange={(e) => setUseShippingForBilling(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Same as shipping address</span>
                  </label>

                  {!useShippingForBilling && (
                    <div className="space-y-2 animate-fade-in-up">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Billing Address</Label>
                      <textarea
                        className="w-full min-h-[120px] p-3 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-transparent resize-none"
                        placeholder="Enter your billing address..."
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="w-1/3 h-14 rounded-none uppercase tracking-widest" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="w-2/3 h-14 rounded-none uppercase tracking-widest"
                    onClick={handleCreateOrder}
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? "Processing..." : "Place Order"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[380px] order-1 lg:order-2">
            <div className="bg-background border border-border p-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg mb-6 border-b border-border pb-4">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart?.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-4">{item.quantity} × {item.productName}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-border pt-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(cart?.total || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Complimentary</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-4">
                <span>Total</span>
                <span>{formatCurrency(cart?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
