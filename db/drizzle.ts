import { drizzle } from "drizzle-orm/postgres-js"; // Use your specific dialect import
import postgres from "postgres";
import * as schema from "./schema"; // Make sure this imports all your schema tables

const client = postgres(process.env.DATABASE_URL!);
// Pass the schema object here:
export const db = drizzle(client, { schema }); 
