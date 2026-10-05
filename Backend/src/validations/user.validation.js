import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100).optional(),

    email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });


export const deleteProfileSchema = z .object({

    password: z
    .string()
    .min(1, "Password is required"),
  })
  .strict();