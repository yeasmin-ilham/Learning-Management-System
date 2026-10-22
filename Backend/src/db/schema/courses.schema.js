
import {
  boolean,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users.schema.js";

export const courseLevelEnum = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const courseStatusEnum = pgEnum("course_status", [
  "draft",
  "published",
  "archived",
]);

export const courses = pgTable( "courses",{
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull(),
    thumbnailUrl: text("thumbnail_url"),

    level: courseLevelEnum("level").notNull().default("beginner"),
    status: courseStatusEnum("status").notNull().default("draft"),

    price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
    isFree: boolean("is_free").notNull().default(true),

    instructorId: uuid("instructor_id").notNull().references(() => users.id, { onDelete: "restrict" }), // Foreign Key (FK)

    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },



 /* একটি টেবিলের (index):
 database table-এ index ব্যবহার করা হয় data দ্রুত খুঁজে বের করার জন্য
  এই courses টেবিলে index দেওয়া হয়েছে যাতে courses টেবিলে সার্চ করার সময় data দ্রুত খুঁজে বের করা যায় */
   
  (table) => [
    uniqueIndex("courses_slug_unique_idx").on(table.slug), // এটি courses table-এ slug column Unique করে & এর ওপর index তৈরি করে  
    index("courses_instructor_id_idx").on(table.instructorId), // এটি instructorId column-এর ওপর index তৈরি করে, যাতে নির্দিষ্ট Instructor-এর Course খুঁজতে সুবিধা হয়
    index("courses_status_idx").on(table.status), // এটি status column-এর ওপর index তৈরি করে
  ],
);


