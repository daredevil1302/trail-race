import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export type Role = "Applicant" | "Administrator";
export type Authed = Request & { user?: { sub: string; role: Role } };

export const auth = (req: Authed, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as any;
    req.user = { sub: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole =
  (role: Role) => (req: Authed, res: Response, next: NextFunction) =>
    req.user?.role === role
      ? next()
      : res.status(403).json({ error: "Forbidden" });
