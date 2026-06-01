import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Toaster } from "./components/ui/sonner";
import { useCart } from "../context/CartContext";
import { productAPI, categoryAPI } from "../services/api";
import type { Category, Product } from "../types/product";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const {
    cartItems,
    addToCart,
    removeByProductId,
    clearCart,
    getCartCount,
  } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("API Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 2000;
    return Math.ceil(Math.max(...products.map((p) => p.price)) / 50) * 50;
  }, [products]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false);

        const matchesCategory =
          selectedCategory === "all" ||
          product.category?.id === Number(selectedCategory);

        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (productId: number) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
      toast.info(`Removed ${item.name} from cart`);
    }
    removeByProductId(productId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    toast.success("Checkout functionality coming soon!");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Header
        cartCount={getCartCount()}
        onCartClick={() => setIsCartOpen(true)}
      />

      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
        <div className="container px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to TechHub
          </h2>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
            Discover Amazing Products at Unbeatable Prices
          </p>
        </div>
      </section>

      <main className="flex-1 container px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="size-5" />
            <h3 className="font-semibold text-lg">Filters & Search</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("name");
                setPriceRange([0, maxPrice]);
              }}
            >
              Reset Filters
            </Button>
          </div>

          <div className="max-w-md">
            <label className="text-sm font-medium mb-2 block">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={maxPrice}
              step={50}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </p>
        </div>

        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Products</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {loading && !error ? (
          <div className="text-center py-16">
            <div className="inline-block size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading amazing products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : !error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : null}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <Footer />
    </div>
  );
}
