import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-display font-bold text-3xl tracking-tighter block mb-6">
              ATELIER
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Curated objects for purposeful living. We source the finest materials and partner with independent makers to bring you products that last a lifetime.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 tracking-tight">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/products?sort=newest" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?categoryId=1" className="hover:text-primary transition-colors">Furniture</Link></li>
              <li><Link href="/products?categoryId=2" className="hover:text-primary transition-colors">Object</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 tracking-tight">Account</h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-primary transition-colors">Log In</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ATELIER. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
