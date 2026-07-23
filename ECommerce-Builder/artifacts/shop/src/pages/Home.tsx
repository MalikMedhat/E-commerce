import { useGetFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { ArrowUpRight, Sparkles, Zap, Shield, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000",
];

export default function Home() {
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useGetFeaturedProducts();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />

        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-cyan text-xs font-bold tracking-widest uppercase mb-8">
              <Sparkles className="w-3 h-3" />
              Summer Drop 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.85] mb-6">
              Next-Gen<br />
              <span className="gradient-text">Tech.</span><br />
              Your Way.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
              Curated drops of the most forward-thinking gear on the market. No noise — just signal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <button className="px-6 py-3 rounded-lg font-semibold text-sm text-primary-foreground"
                  style={{ background: "linear-gradient(90deg,#00E5FF,#A3E635)" }}>
                  Shop the Drop
                </button>
              </Link>
              <Link href="/products">
                <button className="px-6 py-3 rounded-lg font-semibold text-sm border border-border text-foreground hover:border-primary/40 transition-colors">
                  See What's New
                </button>
              </Link>
            </div>
          </div>

          {/* Right — image collage */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {[
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
              "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
              "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
            ].map((src, i) => (
              <div key={i} className={`overflow-hidden rounded-xl border border-border ${i === 0 ? "col-span-2 aspect-[16/7]" : "aspect-square"}`}>
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="border-y border-border py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            {[
              { icon: Truck, label: "Free Global Shipping" },
              { icon: Zap, label: "Same-Day Dispatch" },
              { icon: Shield, label: "2-Year Warranty" },
              { icon: Sparkles, label: "Curated by Experts" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Products ── */}
      <section className="py-20 container px-4 md:px-6 mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Curated for You</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter">Latest Drops</h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingFeatured
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-xl overflow-hidden bg-card border border-card-border">
                  <Skeleton className="aspect-[4/5] rounded-none" />
                  <div className="p-3 flex flex-col gap-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                </div>
              ))
            : featuredProducts?.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="pb-20 container px-4 md:px-6 mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Browse by Type</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter">Shop Categories</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {isLoadingCategories
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
            : categories?.slice(0, 4).map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/products?categoryId=${cat.id}`}
                  className="group relative h-48 rounded-xl overflow-hidden border border-border"
                >
                  <img
                    src={CATEGORY_IMAGES[i] || CATEGORY_IMAGES[0]}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  {/* Cyan glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(0,229,255,0.4)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-bold text-foreground">{cat.name}</p>
                    <p className="text-xs text-primary flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowUpRight className="w-3 h-3" />
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

    </div>
  );
}
