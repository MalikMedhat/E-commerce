import { useAuthStore } from "@/store/authStore";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { logout } = useAuthStore();
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useGetMe({
    query: { queryKey: ['me'] }
  });

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary/10">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        
        <div className="mb-12 border-b border-border pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account details and preferences.</p>
        </div>

        <div className="bg-background border border-border animate-fade-in-up">
          <div className="p-8 md:p-12 border-b border-border flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
              <User className="w-10 h-10" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isLoading ? (
                <>
                  <div className="h-8 w-48 bg-secondary animate-pulse mb-3 mx-auto md:mx-0" />
                  <div className="h-5 w-32 bg-secondary animate-pulse mx-auto md:mx-0" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold font-display tracking-tight mb-2">
                    {user?.email.split('@')[0]}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
                    <span className="hidden md:inline text-border">•</span>
                    <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold"><Shield className="w-4 h-4" /> {user?.role}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12 bg-secondary/20">
            <h3 className="font-display font-semibold text-lg mb-6">Account Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-none justify-start px-6 bg-background" onClick={() => setLocation("/orders")}>
                View Order History
              </Button>
              <Button variant="outline" className="h-14 rounded-none justify-start px-6 text-destructive border-destructive/20 hover:bg-destructive hover:text-white bg-background" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-3" /> Log Out
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
