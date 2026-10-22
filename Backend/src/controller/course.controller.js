import { db } from "../db/db.js";
import { courses } from "../db/schema/index.js";
import { courseIdParamSchema } from "../validations/course.validation.js";
import { and, eq } from "drizzle-orm";

// এই slugify() function-এর কাজ হলো কোনো text-কে URL-friendly slug-এ convert করা
const slugify = (text) =>
  text
    .toLowerCase()
    .trim() // Text-এর শুরুতে ও শেষে থাকা extra whitespace সরিয়ে দেয়
    .replace(/[^a-z0-9\s-]/g, "") // English letter, number, whitespace এবং hyphen (-) ছাড়া অন্য character সরিয়ে দেয়
    .replace(/\s+/g, "-") // এক বা একাধিক whitespace-কে একটি hyphen (-) দিয়ে replace করে
    .replace(/-+/g, "-") // পাশাপাশি একাধিক hyphen থাকলে একটিতে পরিণত করে
    .replace(/^-|-$/g, ""); // Text-এর শুরুতে বা শেষে hyphen থাকলে সরিয়ে দেয়


export const createCourse = async (req, res) => {

// req body থেকে ডেটা নেওয়া
  const { title, description, thumbnailUrl, level, status, price } = req.body;

  // user নিজে slug পাঠালে সেটাই ব্যবহার হয়। না পাঠালে slugify দিয়ে title থেকে বানানো হয়
  const slug = req.body.slug ?? slugify(title); // ?? মানে: বাম পাশের value null হলে ডান পাশের value নাও


  if (!slug) {
    return res.status(400).json({
      success: false,
      message: "Could not generate a slug from the title. Please provide a slug.",
    });
  }

// ডাটাবেসে new course create
    const [course] = await db
      .insert(courses)
      .values({
        instructorId: req.user.id,
        title,
        slug,
        description,
        thumbnailUrl,
        level,
        status,
        price,
        isFree: price === 0,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } 


export const getMyCourses = async (req, res) => {

  const courses = await db.query.courses.findMany({

    where: { instructorId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
};



export const getCourseById = async (req, res) => {

  const { id } = courseIdParamSchema.parse(req.params);

  const course = await db.query.courses.findFirst({

    where: { id, instructorId: req.user.id },
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
};



// Instructor: update own course 
export const updateCourse = async (req, res) => {

  const { id } = courseIdParamSchema.parse(req.params);
  const { price, ...rest } = req.body;

  const values = { ...rest };

  // numeric column expects a string; isFree is always derived from price
  if (price !== undefined) {
    values.price = price.toFixed(2);
    values.isFree = price === 0;
  }

  // Ownership check is part of the WHERE clause
  const [updatedCourse] = await db
    .update(courses)
    .set(values)
    .where(and(eq(courses.id, id), eq(courses.instructorId, req.user.id)))
    .returning();

  if (!updatedCourse) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: updatedCourse,
  });
};




export const deleteCourse = async (req, res) => {

  const { id } = courseIdParamSchema.parse(req.params);

  
  const course = await db.query.courses.findFirst({

    where: { id, instructorId: req.user.id },
    columns: { id: true, status: true }, // Database থেকে শুধু id এবং status এই দুটি column-এর data নিয়ে আসবে
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  // Published or archived courses may already have students, so they must not be deleted
  if (course.status !== "draft") {
    return res.status(409).json({
      success: false,
      message: "Only draft courses can be deleted. Archive this course instead.",
    });
  }

  // The status is checked again in WHERE to avoid a race with a concurrent publish
  const [deletedCourse] = await db
    .delete(courses)
    .where(
      and(
        eq(courses.id, id),
        eq(courses.instructorId, req.user.id),
        eq(courses.status, "draft")
      )
    )
    .returning({ id: courses.id, title: courses.title });

  if (!deletedCourse) {
    return res.status(409).json({
      success: false,
      message: "Course status changed, please try again",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Course deleted successfully",
    data: deletedCourse,
  });
};