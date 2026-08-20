import {
  create,
  findAll,
  findById,
  remove,
  update,
  type CreateUserInput,
  type User
} from "../repositories/user.repository.js";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string
  ) {
    super(message);
  }
}

function validate(input: CreateUserInput): void {
  if (!input.first_name?.trim()) {
    throw new AppError(400, "first_name is required.", "VALIDATION_ERROR");
  }
  if (!input.last_name?.trim()) {
    throw new AppError(400, "last_name is required.", "VALIDATION_ERROR");
  }
  if (!input.email?.trim()) {
    throw new AppError(400, "email is required.", "VALIDATION_ERROR");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new AppError(400, "email has an invalid format.", "VALIDATION_ERROR");
  }
}

function normalize(input: CreateUserInput): CreateUserInput {
  return {
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null
  };
}

export async function listUsers(search?: string): Promise<User[]> {
  return findAll(search?.trim());
}

export async function getUser(id: string): Promise<User> {
  const user = await findById(id);
  if (!user) throw new AppError(404, "User not found.", "USER_NOT_FOUND");
  return user;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const normalized = normalize(input);
  validate(normalized);
  try {
    return await create(normalized);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError(409, "A user with this email already exists.", "EMAIL_CONFLICT");
    }
    throw error;
  }
}

export async function updateUser(id: string, input: CreateUserInput): Promise<User> {
  const normalized = normalize(input);
  validate(normalized);
  try {
    const user = await update(id, normalized);
    if (!user) throw new AppError(404, "User not found.", "USER_NOT_FOUND");
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (isUniqueViolation(error)) {
      throw new AppError(409, "A user with this email already exists.", "EMAIL_CONFLICT");
    }
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  const deleted = await remove(id);
  if (!deleted) throw new AppError(404, "User not found.", "USER_NOT_FOUND");
}

function isUniqueViolation(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "23505";
}
