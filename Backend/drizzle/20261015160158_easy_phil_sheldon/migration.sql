CREATE TYPE "application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "instructor_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"expertise" varchar(150) NOT NULL,
	"bio" text NOT NULL,
	"status" "application_status" DEFAULT 'pending'::"application_status" NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "one_pending_application_per_user" ON "instructor_applications" ("user_id") WHERE "status" = 'pending';--> statement-breakpoint
ALTER TABLE "instructor_applications" ADD CONSTRAINT "instructor_applications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "instructor_applications" ADD CONSTRAINT "instructor_applications_reviewed_by_users_id_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL;