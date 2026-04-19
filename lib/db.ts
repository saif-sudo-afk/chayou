import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

let database: NeonHttpDatabase<typeof schema> | undefined;

export function getDb() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (!database) {
    const sql = neon(url);
    database = drizzle(sql, { schema });
  }

  return database;
}
