import {
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users.schema.js";
import { courses } from "./courses.schema.js";

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active", // ধরো, একজন Student Biology Course-এ enroll করল, প্রথমে status হবে active।
  "completed", // Student সব lesson শেষ করলে status হবে completed
  "cancelled", // Enrollment বাতিল হয়েছে
]);

export const enrollments = pgTable("enrollments",{

    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Fk

    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "restrict" }), // Fk

    status: enrollmentStatusEnum("status").notNull().default("active"),

    // Price snapshot at enrollment time (course price may change later)
    pricePaid: numeric("price_paid", { precision: 10, scale: 2 }).notNull().default("0.00"),

    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (table) => [
    // A student can enroll in a course only once
    uniqueIndex("enrollments_user_course_unique_idx").on(table.userId, table.courseId),
    // Fast lookup: "all courses of this student"
    index("enrollments_user_id_idx").on(table.userId),
    // Fast lookup: "all students of this course"
    index("enrollments_course_id_idx").on(table.courseId),
  ]
);