import "./store-themes.css";
import { ShoppingBag, Search, ChevronRight, Star } from "lucide-react";

export function DarkLuxury() {
  const products = [
    { name: "Noir Ceramic Vase", price: "$189", category: "Home", img: "https://images.unsplash.com/photo-1602166803750-e638e2e08a0b?w=400&q=80" },
    { name: "Obsidian Desk Lamp", price: "$329", category: "Lighting", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
    { name: "Velvet Lounge Chair", price: "$1,240", category: "Furniture", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
    { name: "Marble Bookend Set", price: "$94", category: "Decor", img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80" },
  ];

  return (
    <div className="dark-luxury-root" style={{
      background: "#0A0A0A",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#F5F0E8",
    }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "72px",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "0.15em", color: "#C9A84C" }}>AURUM</span>
          {["Collection", "About", "Editorial"].map(l => (
            <a key={l} style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(245,240,232,0.5)", textDecoration: "none", textTransform: "uppercase" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Search size={18} color="rgba(245,240,232,0.5)" />
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #C9A84C", cursor: "pointer" }}>
            <ShoppingBag size={14} color="#C9A84C" />
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "#C9A84C" }}>BAG (0)</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=80"
          alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(10,10,10,0.95) 40%, transparent 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px"
        }}>
          <div style={{ width: 40, height: 1, background: "#C9A84C", marginBottom: 24 }} />
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#C9A84C", textTransform: "uppercase", marginBottom: 16 }}>New Collection — 2026</p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 68, fontWeight: 800,
            lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: 28, margin: "0 0 28px"
          }}>
            Crafted<br />
            <span style={{ color: "#C9A84C" }}>for the</span><br />
            Discerning.
          </h1>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "14px 28px", background: "#C9A84C", color: "#0A0A0A",
            border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase"
          }}>
            Explore Collection <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "64px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", marginBottom: 8 }}>Curated Selection</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Featured Objects</h2>
          </div>
          <a style={{ fontSize: 11, letterSpacing: "0.15em", color: "#C9A84C", textDecoration: "none", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
            View All <ChevronRight size={12} />
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {products.map((p, i) => (
            <div key={i} style={{ cursor: "pointer" }}>
              <div style={{ aspectRatio: "4/5", overflow: "hidden", marginBottom: 16, position: "relative" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }} />
                <div style={{
                  position: "absolute", bottom: 12, right: 12,
                  background: "#C9A84C", width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <ShoppingBag size={14} color="#0A0A0A" />
                </div>
              </div>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", color: "#C9A84C", textTransform: "uppercase", marginBottom: 4 }}>{p.category}</p>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, margin: "0 0 4px" }}>{p.name}</p>
              <p style={{ fontSize: 16, color: "#C9A84C", fontWeight: 600 }}>{p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strip */}
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", padding: "24px 48px", display: "flex", gap: 48, alignItems: "center" }}>
        {["Free Global Shipping", "Certificate of Authenticity", "30-Day Returns", "Handcrafted Quality"].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={10} color="#C9A84C" fill="#C9A84C" />
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(245,240,232,0.5)", textTransform: "uppercase" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
