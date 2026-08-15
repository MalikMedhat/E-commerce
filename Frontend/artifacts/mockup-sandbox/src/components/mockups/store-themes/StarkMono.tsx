import "./store-themes.css";
import { ShoppingBag, Search, Plus, ArrowRight } from "lucide-react";

export function StarkMono() {
  const products = [
    { name: "Architectural Side Table", price: "$480", cat: "Furniture", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", tag: "NEW" },
    { name: "Precision Desk Lamp", price: "$295", cat: "Lighting", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", tag: "" },
    { name: "Woven Throw Blanket", price: "$165", cat: "Textiles", img: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400&q=80", tag: "" },
    { name: "Cast Iron Planter", price: "$89", cat: "Garden", img: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80", tag: "SALE" },
  ];

  return (
    <div style={{
      background: "#FFFFFF",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "#0A0A0A",
    }}>
      {/* Top bar */}
      <div style={{ background: "#0A0A0A", padding: "10px 48px", textAlign: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#FFFFFF", textTransform: "uppercase" }}>
          Free shipping on orders over $200 · Use code ARRIVAL26
        </span>
      </div>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "64px",
        borderBottom: "2px solid #0A0A0A",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>FORM</span>
          {["Shop", "Stories", "Spaces"].map(l => (
            <a key={l} style={{ fontSize: 13, letterSpacing: "0.05em", color: "#0A0A0A", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Search size={18} color="#0A0A0A" />
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: "#0A0A0A", cursor: "pointer" }}>
            <ShoppingBag size={14} color="#FFFFFF" />
            <span style={{ fontSize: 11, letterSpacing: "0.08em", color: "#FFFFFF", fontWeight: 600 }}>BAG · 0</span>
          </div>
        </div>
      </nav>

      {/* Hero — split layout */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "2px solid #0A0A0A", height: 400 }}>
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px 64px",
          borderRight: "2px solid #0A0A0A"
        }}>
          <div style={{
            display: "inline-block", padding: "4px 10px",
            border: "1.5px solid #0A0A0A", marginBottom: 24,
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700
          }}>S/S 2026</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800,
            lineHeight: 0.85, letterSpacing: "-0.03em", margin: "0 0 32px"
          }}>
            Form<br />Follows<br />Function.
          </h1>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: 0, background: "none", border: "none",
            fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer", borderBottom: "2px solid #0A0A0A", paddingBottom: 4
          }}>
            Shop Collection <ArrowRight size={16} />
          </button>
        </div>
        <div style={{ overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
            alt="hero"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }}
          />
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, borderBottom: "1.5px solid #0A0A0A", paddingBottom: 16 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>New Arrivals</h2>
          <a style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", color: "#0A0A0A" }}>All Products →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {products.map((p, i) => (
            <div key={i} style={{ border: "1.5px solid #0A0A0A", cursor: "pointer" }}>
              <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative", borderBottom: "1.5px solid #0A0A0A" }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
                {p.tag && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#0A0A0A", padding: "2px 8px" }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.15em", color: "#FFF", fontWeight: 700 }}>{p.tag}</span>
                  </div>
                )}
              </div>
              <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", margin: "0 0 2px" }}>{p.cat}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{p.name}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>{p.price}</p>
                  <div style={{ width: 28, height: 28, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>
                    <Plus size={14} color="#FFF" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
