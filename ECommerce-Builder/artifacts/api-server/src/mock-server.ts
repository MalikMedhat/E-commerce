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

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  token: string;
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

// In-memory cart storage
let cartItems: CartItem[] = [];
let cartIdCounter = 1;

// In-memory user storage
let users: User[] = [];
let userIdCounter = 1;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Authentication endpoints
app.post("/api/auth/register", (req, res) => {
  console.log("Register request body:", req.body);
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    console.log("Missing required fields:", { email: !!email, password: !!password, name: !!name });
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  if (users.find((u) => u.email === email)) {
    console.log("User already exists:", email);
    return res.status(400).json({ error: "User already exists" });
  }
  
  const newUser: User = {
    id: userIdCounter++,
    email,
    password, // In production, this should be hashed
    name,
    token: "mock_token_" + Date.now() + "_" + userIdCounter,
  };
  
  users.push(newUser);
  console.log("User registered successfully:", newUser.email);
  
  res.json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
    token: newUser.token,
  });
});

app.post("/api/auth/login", (req, res) => {
  console.log("Login request body:", req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log("Missing email or password:", { email: !!email, password: !!password });
    return res.status(400).json({ error: "Missing email or password" });
  }
  
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    console.log("Invalid credentials for:", email);
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  console.log("Login successful:", user.email);
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token: user.token,
  });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const user = users.find((u) => u.token === token);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
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
  const sort = (req.query.sort as string) || "newest";
  
  let filtered = products.filter((item) =>
    (!categoryId || item.category?.id === categoryId) &&
    (!search || `${item.name} ${item.description}`.toLowerCase().includes(search)),
  );
  
  // Handle sorting
  if (sort === "newest") {
    filtered = [...filtered].reverse();
  } else if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }
  
  res.json({ products: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit });
});

app.get("/api/cart", (req, res) => {
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  res.json({ items: cartItems, total });
});

app.get("/api/cart/items", (req, res) => {
  res.json(cartItems);
});

app.post("/api/cart/items", (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find((p) => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  const existingItem = cartItems.find((item) => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    const newItem: CartItem = {
      id: cartIdCounter++,
      productId,
      quantity: quantity || 1,
      product,
    };
    cartItems.push(newItem);
  }
  
  res.json(cartItems);
});

app.put("/api/cart/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const { quantity } = req.body;
  
  const item = cartItems.find((item) => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  
  item.quantity = quantity;
  res.json(cartItems);
});

app.delete("/api/cart/items/:id", (req, res) => {
  const id = Number(req.params.id);
  cartItems = cartItems.filter((item) => item.id !== id);
  res.json(cartItems);
});

// Payment endpoints
app.post("/api/checkout/create-payment-intent", (req, res) => {
  const { amount } = req.body;
  res.json({
    clientSecret: "mock_client_secret_" + Date.now(),
    amount: amount || 0,
  });
});

app.post("/api/checkout/confirm-payment", (req, res) => {
  const { paymentIntentId } = req.body;
  res.json({
    success: true,
    orderId: "ORD_" + Date.now(),
    paymentIntentId,
  });
});

// Order checkout endpoint
app.post("/api/orders/checkout", (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  
  const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  
  const order = {
    id: "ORD_" + Date.now(),
    items: items,
    total: total,
    status: "completed",
    shippingAddress: shippingAddress || {},
    paymentMethod: paymentMethod || "card",
    createdAt: new Date().toISOString(),
  };
  
  res.json(order);
});

app.get("/api/orders", (req, res) => {
  res.json([]);
});

app.get("/api/orders/:id", (req, res) => {
  res.json({
    id: req.params.id,
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    status: "completed",
    createdAt: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
