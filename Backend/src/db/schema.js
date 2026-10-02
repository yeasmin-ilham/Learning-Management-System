
import { pgTable, uuid, varchar, text, timestamp} from "drizzle-orm/pg-core";



export const users =pgTable("users", {
  id:uuid("id").primaryKey().defaultRandom(),   //  defaultRandom() = id না দিলে automatic random UUID dibe
  name:varchar("name",{length:100}).notNull(),
  email:varchar("email",{length:255}).notNull().unique(),  // unique() = কোনো value duplicate না হওয়া , একই email দিয়ে আরেকজন user করা যাবে না
  password:text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),

});




