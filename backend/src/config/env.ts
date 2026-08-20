import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  appVersion: process.env.APP_VERSION ?? "1.0.0",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5500",
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 5432),
    database: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD")
  }
};
