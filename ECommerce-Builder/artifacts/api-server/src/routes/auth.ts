import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { RegisterBody, LoginBody, GetMeResponse } from "@workspace/api-zod";

const router = Router();

function generateToken(userId: number, email: string, role: string): string {
  const secret = process.env.JWT_SECRET || "change-me";
  return jwt.sign({ userId, email, role }, secret, { expiresIn: "7d" });
}

function generateRefreshToken(userId: number): string {
  const secret = process.env.JWT_SECRET || "change-me";
  return jwt.sign({ userId }, secret, { expiresIn: "30d" });
}

router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  // Check if user already exists
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "Email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordHash, role: "CUSTOMER" })
    .returning();

  const token = generateToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    userId: user.id,
    email: user.email,
    token,
    refreshToken,
    role: user.role,
  });
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    userId: user.id,
    email: user.email,
    token,
    refreshToken,
    role: user.role,
  });
});

router.get("/auth/me", async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId as number;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(GetMeResponse.parse({
    userId: user.id,
    email: user.email,
    role: user.role,
  }));
});

export default router;
