

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relation.js";

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  relations,
});