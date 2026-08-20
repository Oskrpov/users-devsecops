import { pool } from "../config/database.js";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
}

export type UpdateUserInput = CreateUserInput;

export async function findAll(search?: string): Promise<User[]> {
  if (!search) {
    const result = await pool.query<User>(
      `SELECT id, first_name, last_name, email, phone, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  const term = `%${search}%`;
  const result = await pool.query<User>(
    `SELECT id, first_name, last_name, email, phone, created_at, updated_at
     FROM users
     WHERE first_name ILIKE $1
        OR last_name ILIKE $1
        OR email ILIKE $1
        OR COALESCE(phone, '') ILIKE $1
     ORDER BY created_at DESC`,
    [term]
  );
  return result.rows;
}

export async function findById(id: string): Promise<User | null> {
  const result = await pool.query<User>(
    `SELECT id, first_name, last_name, email, phone, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function create(input: CreateUserInput): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (first_name, last_name, email, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, first_name, last_name, email, phone, created_at, updated_at`,
    [input.first_name, input.last_name, input.email, input.phone]
  );
  return result.rows[0];
}

export async function update(id: string, input: UpdateUserInput): Promise<User | null> {
  const result = await pool.query<User>(
    `UPDATE users
     SET first_name = $1, last_name = $2, email = $3, phone = $4, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, first_name, last_name, email, phone, created_at, updated_at`,
    [input.first_name, input.last_name, input.email, input.phone, id]
  );
  return result.rows[0] ?? null;
}

export async function remove(id: string): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [id]
  );
  return result.rowCount === 1;
}
