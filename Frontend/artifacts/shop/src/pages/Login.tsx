import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLogin();

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        setAuth({ userId: data.userId, email: data.email, role: data.role }, data.token);
        toast.success("Welcome back");
        setLocation("/");
      },
      onError: (err) => {
        toast.error(err.data?.error || "Login failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">Log In</h1>
          <p className="text-muted-foreground">Access your curated collection and order history.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-widest text-xs font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" className="h-12 rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-colors" {...field} data-testid="input-email" />
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
                  <div className="flex items-center justify-between">
                    <FormLabel className="uppercase tracking-widest text-xs font-semibold">Password</FormLabel>
                    <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Forgot?</span>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="h-12 rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-colors" {...field} data-testid="input-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-14 rounded-none uppercase tracking-widest text-sm" disabled={loginMutation.isPending} data-testid="button-submit-login">
              {loginMutation.isPending ? "Authenticating..." : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-8">
          Don't have an account?{" "}
          <Link href="/register" className="text-foreground font-medium hover:text-primary transition-colors link-underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
