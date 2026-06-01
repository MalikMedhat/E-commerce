import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-6" />
          <div>
            <h1 className="font-bold text-xl">TechHub</h1>
            <p className="text-xs text-muted-foreground">Your Tech Paradise</p>
          </div>
        </div>

        <Button onClick={onCartClick} variant="outline" className="relative">
          <ShoppingCart className="size-5 mr-2" />
          Cart
          {cartCount > 0 && (
            <Badge 
              variant="destructive" 
              className="ml-2 size-5 flex items-center justify-center p-0 rounded-full"
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
