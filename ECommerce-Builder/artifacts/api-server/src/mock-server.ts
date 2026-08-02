import express from "express";
import cors from "cors";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category | undefined;
}

const categories: Category[] = [
  { id: 1, name: "Furniture" },
  { id: 2, name: "Object" },
  { id: 3, name: "Lighting" },
  { id: 4, name: "Storage" },
  { id: 5, name: "Accessories" },
];

const products: Product[] = [
  [1, "Aria Modular Sofa", "A low-profile modular sofa with premium fabric upholstery.", 1299, 1, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"],
  [2, "Nexus Coffee Table", "Reclaimed oak coffee table with a refined minimalist profile.", 459, 1, "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000"],
  [3, "Lumina Desk Lamp", "Adjustable LED lamp with touch dimming and wireless charging.", 189, 3, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000"],
  [4, "Vertex Bookshelf", "Geometric bamboo bookshelf with asymmetrical shelving.", 749, 1, "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1000"],
  [5, "Orbit Pendant Light", "Brushed brass pendant with a frosted glass diffuser.", 329, 3, "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1000"],
  [6, "Terra Storage Ottoman", "Multifunctional linen ottoman with a removable tray top.", 399, 4, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"],
  [7, "Cobalt Ceramic Vase", "Hand-thrown ceramic vase in a rich cobalt glaze.", 89, 5, "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1000"],
  [8, "Alpine Throw Blanket", "Chunky knit merino-wool throw for quiet evenings.", 129, 5, "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&q=80&w=1000"],
].map(([id, name, description, price, categoryId, imageUrl]): Product => ({
  id: id as number,
  name: name as string,
  description: description as string,
  price: price as number,
  imageUrl: imageUrl as string,
  category: categories.find((category) => category.id === categoryId),
}));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/categories", (req, res) => {
  res.json(categories);
});

app.get("/api/products/featured", (req, res) => {
  res.json(products.slice(0, 4));
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.get("/api/products/:id/related", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(products.filter((item) => item.category?.id === product.category?.id && item.id !== product.id));
});

app.get("/api/products", (req, res) => {
  const search = (req.query.search as string)?.toLowerCase() || "";
  const categoryId = Number(req.query.categoryId) || undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const filtered = products.filter((item) =>
    (!categoryId || item.category?.id === categoryId) &&
    (!search || `${item.name} ${item.description}`.toLowerCase().includes(search)),
  );
  res.json({ products: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit });
});

app.get("/api/cart", (req, res) => {
  res.json({ items: [], total: 0 });
});

app.get("/api/cart/items", (req, res) => {
  res.json([]);
});

app.post("/api/cart/items", (req, res) => {
  res.json({ success: true });
});

app.put("/api/cart/items/:id", (req, res) => {
  res.json({ success: true });
});

app.delete("/api/cart/items/:id", (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
