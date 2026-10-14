import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "../src/db/db.js"
import { users } from "../src/db/schema/index.js";
import { adminSeedSchema } from "../src/validations/admin.validation.js";

// admin schema parse -value from .env file
const parsed = adminSeedSchema.safeParse(process.env);  // Seed এর schema process.env parse করে, req.body parse করে না


if (!parsed.success) {
  console.error("Invalid environment variables:",
  parsed.error.flatten().fieldErrors);
  process.exit(1);
}

// get .env admin data --with zod validation
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = parsed.data;


try {

    // hashed password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

// create new user with admin role or change existing user role admin(if user already exist with student role)
  const [admin] = await db
    .insert(users)
    .values({
      name: ADMIN_NAME,   // আগে থেকে Email না থাকলে → create new user & নতুন user-এর role admin হবে
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { role: "admin" }, //  Email আগে থেকে থাকলে → existing user-এর role admin হবে। (if user already exist with student role)
    })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
    });

  console.log("Admin ready:", admin);
} catch (error) {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
} finally {
  await db.$client.end(); // db.$client.end() PostgreSQL connection বন্ধ করে,কারণ Seed script-এর কাজ শেষ হওয়ার পর database connection খোলা থাকলে Node.js process চালু থেকে যেতে পারে।
}