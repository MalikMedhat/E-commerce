import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, Menu, Package, LogOut, Zap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useGetCart } from "@workspace/api-client-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { useState } from "react";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const { setIsOpen: setCartOpen } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cart } = useGetCart({ query: { enabled: isAuthenticated, queryKey: ["cart-nav"] } });
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Gear", href: "/products" },
    { label: "Home", href: "/" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Left — logo + nav links */}
        <div className="flex items-center gap-8">
          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] flex flex-col pt-10 bg-background border-border">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
              </form>
              <div className="flex flex-col gap-5">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-foreground/70 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
                {isAuthenticated ? (
                  <>
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground">
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm text-foreground/70 hover:text-foreground">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 text-sm text-destructive">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-foreground/70 hover:text-foreground">Log in</Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-foreground/70 hover:text-foreground">Create account</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5" data-testid="link-home-logo">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-extrabold text-xl tracking-wide gradient-text">VOLT</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-sm font-medium transition-colors ${location === l.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right — search + auth + cart */}
        <div className="flex items-center gap-3">
          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border focus-within:border-primary/40 transition-colors w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              placeholder="Search anything…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              data-testid="input-search-desktop"
            />
          </form>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/orders">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Package className="w-4.5 h-4.5" />
                </Button>
              </Link>
              <Link href="/profile" data-testid="link-profile">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <User className="w-4.5 h-4.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
              <Link href="/register">
                <span className="px-3 py-1.5 rounded-md text-xs font-semibold badge-cyan">Sign up</span>
              </Link>
            </div>
          )}

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:border-primary/40 transition-colors"
            data-testid="button-cart-trigger"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-foreground/80" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
