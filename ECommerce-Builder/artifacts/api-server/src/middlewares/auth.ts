import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const secret = process.env.JWT_SECRET || "change-me";
      const decoded = jwt.verify(token, secret) as JwtPayload;

      (req as any).userId = decoded.userId;
      (req as any).userEmail = decoded.email;
      (req as any).userRole = decoded.role;
      next();
      return;
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
  }

  // Fallback: allow requests without auth (for development/testing)
  // In production, this should be removed
  if (process.env.NODE_ENV !== "production") {
    (req as any).userId = 1;
    (req as any).userEmail = "external-user@example.com";
    (req as any).userRole = "CUSTOMER";
    next();
    return;
  }

  res.status(401).json({ error: "Authorization header required" });
}
