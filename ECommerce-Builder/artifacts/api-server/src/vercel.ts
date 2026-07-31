const categories = [
  { id: 1, name: "Furniture" },
  { id: 2, name: "Object" },
  { id: 3, name: "Lighting" },
  { id: 4, name: "Storage" },
  { id: 5, name: "Accessories" },
];

const products = [
  [1, "Aria Modular Sofa", "A low-profile modular sofa with premium fabric upholstery.", 1299, 1, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"],
  [2, "Nexus Coffee Table", "Reclaimed oak coffee table with a refined minimalist profile.", 459, 1, "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000"],
  [3, "Lumina Desk Lamp", "Adjustable LED lamp with touch dimming and wireless charging.", 189, 3, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000"],
  [4, "Vertex Bookshelf", "Geometric bamboo bookshelf with asymmetrical shelving.", 749, 1, "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1000"],
  [5, "Orbit Pendant Light", "Brushed brass pendant with a frosted glass diffuser.", 329, 3, "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1000"],
  [6, "Terra Storage Ottoman", "Multifunctional linen ottoman with a removable tray top.", 399, 4, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"],
  [7, "Cobalt Ceramic Vase", "Hand-thrown ceramic vase in a rich cobalt glaze.", 89, 5, "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1000"],
  [8, "Alpine Throw Blanket", "Chunky knit merino-wool throw for quiet evenings.", 129, 5, "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&q=80&w=1000"],
].map(([id, name, description, price, categoryId, imageUrl]) => ({
  id,
  name,
  description,
  price,
  imageUrl,
  category: categories.find((category) => category.id === categoryId),
}));

export default function handler(req: any, res: any) {
  const url = new URL(req.url || "/", "https://catalog.local");
  const path = url.pathname.replace(/^\/api/, "");

  if (path === "/health" || path === "/healthz") return res.status(200).json({ status: "ok" });
  if (path === "/categories") return res.status(200).json(categories);
  if (path === "/products/featured") return res.status(200).json(products.slice(0, 4));

  const productMatch = path.match(/^\/products\/(\d+)(?:\/related)?$/);
  if (productMatch) {
    const product = products.find((item) => item.id === Number(productMatch[1]));
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (path.endsWith("/related")) {
      return res.status(200).json(products.filter((item) => item.category.id === product.category.id && item.id !== product.id));
    }
    return res.status(200).json(product);
  }

  if (path === "/products") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const categoryId = Number(url.searchParams.get("categoryId")) || undefined;
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 12;
    const filtered = products.filter((item) =>
      (!categoryId || item.category.id === categoryId) &&
      (!search || `${item.name} ${item.description}`.toLowerCase().includes(search)),
    );
    return res.status(200).json({ products: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit });
  }

  return res.status(404).json({ error: "Not found" });
}
