import { and, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users, instructorApplications } from "../db/schema/index.js";
import {
  applicationIdParamSchema,
  applicationStatusQuerySchema,
} from "../validations/instructorApplication.validation.js";

// Student: apply to become an instructor
export const applyForInstructor = async (req, res) => {
  const { expertise, bio } = req.body;

  //Database-এ খোঁজা হচ্ছে, এই user-এর আগে থেকেই কোনো pending application আছে কি না।
  const pendingApplication = await db.query.instructorApplications.findFirst({
    where: { userId: req.user.id, status: "pending" },
  });

// আগে থেকেই pending application থাকলে নতুন application জমা দিতে দেওয়া হবে না।
  if (pendingApplication) {
    return res.status(409).json({
      success: false,
      message: "You already have a pending application",
    });
  }
// নতুন application তৈরি করা
  const [application] = await db
    .insert(instructorApplications)
    .values({ userId: req.user.id, expertise, bio })
    .returning();

// success response পাঠানো
  return res.status(201).json({ success: true, data: application });
};




// ২টা model/schema-এর মধ্যে relation থাকলে এবং FK থাকলে query-তে এক model থেকে অন্য model-এর related data access করে read, create, update, delete করা যায়
export const approveApplication = async (req, res) => {

  //URL থেকে application id নেওয়া & Zod দিয়ে check হচ্ছে id UUID কি না
  const { id } = applicationIdParamSchema.parse(req.params);


// একটি transaction-এর ভিতরে একাধিক database operation রাখা হয়, যাতে সবগুলো একসঙ্গে সফল হয়

  const result = await db.transaction(async (tx) => {   // Transaction-এর ভিতরে দুটি database operation হচ্ছে:
    const [application] = await tx
      .update(instructorApplications)
      .set({
        status: "approved",                   // 1.Application approve করা।
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      })
      .where(
        and(
          eq(instructorApplications.id, id),
          eq(instructorApplications.status, "pending")
        )
      )
      .returning();

    if (!application) return null;

    await tx         // 2.User-এর role instructor করা, এক model(instructorApplications) থেকে অন্য model(users)-এর related data access করে update
      .update(users)
      .set({ role: "instructor" })
      .where(and(eq(users.id, application.userId), eq(users.role, "student")));

    return application;
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Pending application not found",
    });
  }

  return res.json({ success: true, data: result });
};

// Admin: reject
export const rejectApplication = async (req, res) => {
  const { id } = applicationIdParamSchema.parse(req.params);

  const [application] = await db
    .update(instructorApplications)
    .set({
      status: "rejected",
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    })
    .where(
      and(
        eq(instructorApplications.id, id),
        eq(instructorApplications.status, "pending")
      )
    )
    .returning();

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Pending application not found",
    });
  }

  return res.json({ success: true, data: application });
};


// Admin: applications list (?status=pending)
export const getApplications = async (req, res) => {

  // Query থেকে status নেওয়া এবং Zod দিয়ে validate করা হচ্ছে
  const { status } = applicationStatusQuerySchema.parse(req.query);

// Database থেকে একাধিক application আনা
  const applications = await db.query.instructorApplications.findMany({
    where: status ? { status } : undefined,
    with: { //এক model(instructorApplications) থেকে অন্য model(users)-এর related data access করে Read. প্রতিটি application-এর সঙ্গে user-এর তথ্যও আনা হচ্ছে
      user: { columns: 
         { id: true, // User-এর id আনবে।
            name: true, // নাম আনবে।
            email: true } // Email আনবে।
            
        },
    },
    // নতুন application আগে দেখানো
    orderBy: { createdAt: "desc" },
  });

  // Response পাঠানো
  return res.json({ success: true, data: applications });
};