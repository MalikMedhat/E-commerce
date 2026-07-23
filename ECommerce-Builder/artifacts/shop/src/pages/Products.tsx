import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListProducts, useListCategories, ListProductsSort } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ProductsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const initialSearch = searchParams.get("search") || "";
  const initialCategoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined;
  const initialSort = (searchParams.get("sort") as ListProductsSort) || "newest";

  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState<number | undefined>(initialCategoryId);
  const [sort, setSort] = useState<ListProductsSort>(initialSort);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryId, sort]);

  // Update from URL params if they change externally (e.g. search in navbar)
  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null) {
      setSearch(s);
      setPage(1);
    }
  }, [location]);

  const { data: categories } = useListCategories();
  
  const { data: pageData, isLoading } = useListProducts({
    search: search || undefined,
    categoryId,
    sort,
    page,
    limit,
  });

  const clearFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setSort("newest");
  };

  const hasFilters = search !== "" || categoryId !== undefined || sort !== "newest";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container px-4 md:px-6 mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">
            {search ? `Search: ${search}` : "All Objects"}
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Explore our complete collection of meticulously crafted items designed to elevate your everyday spaces.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden w-full rounded-none">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Categories</h4>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setCategoryId(undefined)}
                        className={`text-left text-sm px-2 py-1.5 rounded-none ${categoryId === undefined ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary'}`}
                      >
                        All Categories
                      </button>
                      {categories?.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => setCategoryId(cat.id)}
                          className={`text-left text-sm px-2 py-1.5 rounded-none ${categoryId === cat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Categories (Tabs style) */}
            <div className="hidden md:flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setCategoryId(undefined)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${categoryId === undefined ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary/50 bg-background'}`}
              >
                All
              </button>
              {categories?.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors ${categoryId === cat.id ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary/50 bg-background'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-10 px-3 rounded-none">
                <X className="w-4 h-4 mr-2" /> Clear
              </Button>
            )}
            
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden md:block" />
              <Select value={sort} onValueChange={(val) => setSort(val as ListProductsSort)}>
                <SelectTrigger className="w-full md:w-[180px] rounded-none border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/5] rounded-none" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : pageData?.products.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center justify-center border border-dashed border-border">
            <h3 className="text-2xl font-display font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search term.</p>
            <Button variant="outline" onClick={clearFilters} className="rounded-none uppercase tracking-widest text-xs">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 mb-16">
              {pageData?.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pageData && pageData.total > limit && (
              <div className="flex items-center justify-center gap-2 border-t border-border pt-8">
                <Button 
                  variant="outline" 
                  className="rounded-none h-10 w-24"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium mx-4">
                  Page {page} of {Math.ceil(pageData.total / limit)}
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-none h-10 w-24"
                  disabled={page >= Math.ceil(pageData.total / limit)}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
