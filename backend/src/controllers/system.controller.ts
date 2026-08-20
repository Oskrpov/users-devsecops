import type { Request, Response } from "express";
import { env } from "../config/env.js";

export function health(_req: Request, res: Response) {
  res.status(200).json({ status: "UP" });
}

export function version(_req: Request, res: Response) {
  res.status(200).json({ version: env.appVersion });
}
