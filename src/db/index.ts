import { createDatabase } from "@kilocode/app-builder-db";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let db: ReturnType<typeof createDatabase>;

if (TURSO_CONNECTION_URL) {
  const client = createClient({
    url: TURSO_CONNECTION_URL,
    authToken: TURSO_AUTH_TOKEN,
  });
  db = drizzle(client, { schema });
} else {
  db = createDatabase(schema);
}

export { db, schema };
export { eq, and, or, desc, asc, sql, like } from "drizzle-orm";
