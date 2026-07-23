import "./store-themes.css";
import { ShoppingBag, Search, Zap, ArrowUpRight, Sparkles } from "lucide-react";

export function VibrantModern() {
  const products = [
    { name: "ARC Wireless Headphones", price: "$149", cat: "Electronics", badge: "BESTSELLER", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", accent: "#00E5FF" },
    { name: "FLUX Smart Watch", price: "$399", cat: "Wearables", badge: "NEW", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", accent: "#A3E635" },
    { name: "PRISM Desk Speaker", price: "$229", cat: "Audio", badge: "", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", accent: "#FF6BF8" },
    { name: "NOVA Webcam 4K", price: "$89", cat: "Accessories", badge: "SALE", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", accent: "#FFD60A" },
  ];

  return (
    <div style={{
      background: "#080C14",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#F0F4FF",
    }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "64px",
        borderBottom: "1px solid rgba(0,229,255,0.12)",
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(8,12,20,0.9)", backdropFilter: "blur(16px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={18} color="#00E5FF" fill="#00E5FF" />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "0.05em", background: "linear-gradient(90deg, #00E5FF, #A3E635)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VOLT</span>
          </div>
          {["Gear", "Bundles", "Drops"].map(l => (
            <a key={l} style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", border: "1px solid rgba(240,244,255,0.1)", borderRadius: 6 }}>
            <Search size={14} color="rgba(240,244,255,0.4)" />
            <span style={{ fontSize: 12, color: "rgba(240,244,255,0.3)" }}>Search anything…</span>
          </div>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <ShoppingBag size={20} color="#F0F4FF" />
            <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#00E5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: "#080C14" }}>3</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", padding: "64px 40px 48px",
        borderBottom: "1px solid rgba(0,229,255,0.1)",
        overflow: "hidden"
      }}>
        {/* Glow effects */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(0,229,255,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, right: 120, width: 300, height: 300, borderRadius: "50%", background: "rgba(163,230,53,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 4, marginBottom: 24 }}>
              <Sparkles size={12} color="#00E5FF" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#00E5FF", letterSpacing: "0.12em", textTransform: "uppercase" }}>Summer Drop 2026</span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800,
              lineHeight: 0.88, letterSpacing: "-0.03em", margin: "0 0 24px"
            }}>
              Next-Gen<br />
              <span style={{ background: "linear-gradient(90deg, #00E5FF, #A3E635)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tech.</span><br />
              Your Way.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", marginBottom: 32, lineHeight: 1.6 }}>
              Curated drops of the most forward-thinking gear on the market. No clutter, just signal.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{
                padding: "12px 24px", background: "linear-gradient(90deg, #00E5FF, #A3E635)",
                border: "none", borderRadius: 6, cursor: "pointer",
                fontSize: 13, fontWeight: 700, color: "#080C14", letterSpacing: "0.04em"
              }}>
                Shop the Drop
              </button>
              <button style={{
                padding: "12px 24px", background: "transparent",
                border: "1px solid rgba(240,244,255,0.15)", borderRadius: 6, cursor: "pointer",
                fontSize: 13, color: "#F0F4FF"
              }}>
                See What's New
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"
            ].map((src, i) => (
              <div key={i} style={{ aspectRatio: i === 0 ? "1" : "1", overflow: "hidden", borderRadius: 8, border: "1px solid rgba(0,229,255,0.15)" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: 0 }}>Latest Drops</h2>
          <a style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#00E5FF", textDecoration: "none", fontWeight: 600 }}>
            View All <ArrowUpRight size={14} />
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {products.map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden",
              cursor: "pointer", transition: "border-color 0.2s"
            }}>
              <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {p.badge && (
                  <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 8px", borderRadius: 4, background: p.accent, }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#080C14", letterSpacing: "0.1em" }}>{p.badge}</span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(8,12,20,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${p.accent}` }}>
                  <ShoppingBag size={13} color={p.accent} />
                </div>
              </div>
              <div style={{ padding: "14px" }}>
                <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(240,244,255,0.4)", textTransform: "uppercase", margin: "0 0 4px" }}>{p.cat}</p>
                <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>{p.name}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: p.accent, margin: 0 }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
