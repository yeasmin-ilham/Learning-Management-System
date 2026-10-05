
import { z} from "zod";

export const signupSchema = z.object({
    name:z
    .string()
    .trim() // trim() মাঝের space মুছে 
    .min(2,"Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters" ),

    email:z
    .string()
    .trim()
    .toLowerCase()
    .max(255, "Email must be at most 255 characters"),

    password:z
    .string()
    .min(8,"Password must be at least 8 characters")
    .max(72,"Password must be at most 72 characters")
    .regex(/[A-Z]/,"Password must contain at least one uppercase letter")
    .regex(/[a-z]/,"Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")

})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password must be at most 72 characters"),
})