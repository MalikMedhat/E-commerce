import { db, categoriesTable, productsTable, usersTable } from "@workspace/db";
import bcrypt from "bcryptjs";

const categories = [
  { name: "Furniture" },
  { name: "Object" },
  { name: "Lighting" },
  { name: "Storage" },
  { name: "Accessories" },
];

const products = [
  {
    name: "Aria Modular Sofa",
    description: "A sleek, low-profile modular sofa with customizable configurations. Features premium fabric upholstery and solid ash legs.",
    price: "1299.00",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    categoryId: 1,
  },
  {
    name: "Nexus Coffee Table",
    description: "A minimalist coffee table crafted from reclaimed oak with a live-edge top and black steel hairpin legs.",
    price: "459.00",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    categoryId: 1,
  },
  {
    name: "Lumina Desk Lamp",
    description: "An adjustable LED desk lamp with touch-sensitive dimming and a built-in wireless charging pad.",
    price: "189.00",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
    categoryId: 3,
  },
  {
    name: "Vertex Bookshelf",
    description: "A geometric bookshelf with asymmetrical shelving, crafted from sustainable bamboo and finished with natural oil.",
    price: "749.00",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000",
    categoryId: 1,
  },
  {
    name: "Orbit Pendant Light",
    description: "A statement pendant light with a brushed brass finish and a frosted glass diffuser for warm, ambient lighting.",
    price: "329.00",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1000",
    categoryId: 3,
  },
  {
    name: "Terra Storage Ottoman",
    description: "A multifunctional storage ottoman with a removable tray top, crafted from water-resistant linen and solid pine.",
    price: "399.00",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000",
    categoryId: 4,
  },
  {
    name: "Cobalt Ceramic Vase",
    description: "A hand-thrown ceramic vase with a distinctive cobalt blue glaze, perfect for fresh flowers or dried arrangements.",
    price: "89.00",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    categoryId: 5,
  },
  {
    name: "Alpine Throw Blanket",
    description: "A chunky knit throw blanket made from ethically-sourced merino wool, perfect for cozy evenings.",
    price: "129.00",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    categoryId: 5,
  },
];

export async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(productsTable);
  await db.delete(categoriesTable);
  await db.delete(usersTable);

  // Insert categories
  for (const cat of categories) {
    await db.insert(categoriesTable).values(cat);
  }
  console.log(`Inserted ${categories.length} categories`);

  // Insert products
  for (const product of products) {
    await db.insert(productsTable).values(product);
  }
  console.log(`Inserted ${products.length} products`);

  // Insert a demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  await db.insert(usersTable).values({
    email: "demo@example.com",
    passwordHash,
    role: "CUSTOMER",
  });
  console.log("Inserted 1 demo user (demo@example.com / password123)");

  console.log("Seeding complete!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
