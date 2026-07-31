
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tech Hub. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
