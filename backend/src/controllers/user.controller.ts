import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const data = await userService.listUsers(search);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const data = await userService.getUser(req.params.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const data = await userService.createUser(req.body);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const data = await userService.updateUser(req.params.id, req.body);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
