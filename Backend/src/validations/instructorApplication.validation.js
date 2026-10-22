import { z } from "zod";

export const applyInstructorSchema = z.object({
  expertise: z.string().trim().min(2).max(150),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters").max(2000),
});

export const applicationIdParamSchema = z.object({
  id: z.string().uuid(),    // id-টি অবশ্যই UUID format-এর হতে হবে
});

export const applicationStatusQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});