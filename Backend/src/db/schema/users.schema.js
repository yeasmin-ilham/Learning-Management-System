
import { 
  pgTable, 
  uuid, 
  varchar, 
  text,
  timestamp,  
  pgEnum
  } from "drizzle-orm/pg-core";


  export const userRoleEnum = pgEnum("user_role", ["student", "instructor", "admin"]);

export const users =pgTable("users", {

  id:uuid("id").primaryKey().defaultRandom(),   //  defaultRandom() = id না দিলে automatic random UUID dibe
  name:varchar("name",{length:100}).notNull(),
  email:varchar("email",{length:255}).notNull().unique(),  // unique() = কোনো value duplicate না হওয়া , একই email দিয়ে আরেকজন user করা যাবে না
  password:text("password").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),

});










