import { sql } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { 
  pgTable, 
  uuid, 
  varchar, 
  text,
  timestamp,  
  pgEnum
  } from "drizzle-orm/pg-core";
  import { users } from "./users.schema.js";


export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);

export const instructorApplications = pgTable( "instructor_applications",{

    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Forgien
    expertise: varchar("expertise", { length: 150 }).notNull(),
    bio: text("bio").notNull(),
    status: applicationStatusEnum("status").notNull().default("pending"),
    reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },

  (table) => [
    // One user can have only one pending application at a time
    uniqueIndex("one_pending_application_per_user").on(table.userId).where(sql`${table.status} = 'pending'`),
  ]
);