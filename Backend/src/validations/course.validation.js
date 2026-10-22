import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(255),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers and hyphens").optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z.string().url("Thumbnail must be a valid URL").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  price: z.coerce.number().min(0, "Price cannot be negative").max(99999999.99).default(0),
});



export const courseIdParamSchema = z.object({
  id: z.string().uuid(),    // id-টি অবশ্যই UUID format-এর হতে হবে
});


export const updateCourseSchema = z.object({
    title: z.string().trim().min(3).max(255),
    description: z.string().trim().min(20),
    thumbnailUrl: z.string().trim().url().nullable(),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    price: z.number().min(0).max(99999999.99),
  })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });


