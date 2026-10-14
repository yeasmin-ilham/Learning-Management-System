
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

import { users } from "../schema/users.schema.js";

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

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull(),
    thumbnailUrl: text("thumbnail_url"),

    level: courseLevelEnum("level").notNull().default("beginner"),
    status: courseStatusEnum("status").notNull().default("draft"),

    price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
    isFree: boolean("is_free").notNull().default(true),

    instructorId: uuid("instructor_id").notNull().references(() => users.id, { onDelete: "restrict" }), // relation er jonno ashche

    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },



 /*  একটি টেবিলের ইনডেক্স (index) ডিফিনিশন

  এই ইনডেক্সগুলো দেওয়া হয়েছে যাতে courses টেবিলে সার্চ করার সময় ডাটাবেসকে পুরো টেবিল স্ক্যান করতে না হয়।
   ইনডেক্স ছাড়া কুয়েরি চালালে ডাটাবেস প্রতিটি রো দেখে দেখে মেলায় (sequential scan); 
   ইনডেক্স থাকলে সরাসরি দরকারি রো-তে পৌঁছে যায়, অনেকটা বইয়ের শেষের সূচিপত্র দেখে সরাসরি পৃষ্ঠায় যাওয়ার মতো। */
   
  (table) => [
    uniqueIndex("courses_slug_unique_idx").on(table.slug), // এটি slug column-এর ওপর index তৈরি করে & Unique করে 
    index("courses_instructor_id_idx").on(table.instructorId), // এটি instructorId column-এর ওপর index তৈরি করে, যাতে নির্দিষ্ট Instructor-এর Course খুঁজতে সুবিধা হয়
    index("courses_status_idx").on(table.status), // এটি status column-এর ওপর index তৈরি করে
  ],
);


