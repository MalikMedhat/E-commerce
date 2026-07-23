import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");

  // Calculate password strength (0-100)
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return Math.min(100, score);
  };

  const strength = calculateStrength(passwordValue);

  const getStrengthColor = (val: number) => {
    if (val < 40) return "bg-destructive";
    if (val < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const registerMutation = useRegister();

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({ data: { email: values.email, password: values.password } }, {
      onSuccess: (data) => {
        setAuth({ userId: data.userId, email: data.email, role: data.role }, data.token);
        toast.success("Account created successfully");
        setLocation("/");
      },
      onError: (err) => {
        toast.error(err.data?.error || "Registration failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-4 bg-secondary/10">
      <div className="w-full max-w-md animate-fade-in-up bg-background p-8 border border-border shadow-2xl shadow-black/5">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold tracking-tighter mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join the Atelier community for faster checkout and order tracking.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-widest text-xs font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" className="h-12 rounded-none border-border focus-visible:ring-primary transition-colors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-widest text-xs font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="h-12 rounded-none border-border focus-visible:ring-primary transition-colors" {...field} />
                  </FormControl>
                  
                  {passwordValue && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Password strength</span>
                        <span className="font-medium text-foreground">{strength < 40 ? 'Weak' : strength < 80 ? 'Good' : 'Strong'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`} 
                          style={{ width: `${strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-widest text-xs font-semibold">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="h-12 rounded-none border-border focus-visible:ring-primary transition-colors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full h-14 rounded-none uppercase tracking-widest text-sm" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating..." : "Create Account"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground font-medium hover:text-primary transition-colors link-underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
