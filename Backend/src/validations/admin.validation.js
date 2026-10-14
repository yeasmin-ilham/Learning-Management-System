import { z } from "zod";

export const adminSeedSchema = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(100).default("Admin"),   // env file value 
  ADMIN_EMAIL: z.string().trim().toLowerCase().email().max(255),
  ADMIN_PASSWORD: z.string().min(8, "Password must be at least 8 characters"),
});