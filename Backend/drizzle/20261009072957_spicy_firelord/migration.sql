CREATE TYPE "user_role" AS ENUM('student', 'instructor', 'admin');--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "instructor_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'student'::"user_role" NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "courses_slug_unique_idx" ON "courses" ("slug");--> statement-breakpoint
CREATE INDEX "courses_instructor_id_idx" ON "courses" ("instructor_id");--> statement-breakpoint
CREATE INDEX "courses_status_idx" ON "courses" ("status");--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_users_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE RESTRICT;