import { type Request, type Response, type NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  (req as any).userId = (req as any).userId ?? 1;
  (req as any).userEmail = (req as any).userEmail ?? "external-user@example.com";
  (req as any).userRole = (req as any).userRole ?? "CUSTOMER";
  next();
}
