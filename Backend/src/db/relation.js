
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema/index.js";

export const relations = defineRelations(schema, (r) => ({

  users: {

   // একজন User অনেক Course তৈরি করতে পারে (one-to-many)
    createdCourses: r.many.courses({ 
      from: r.users.id,
      to: r.courses.instructorId,
    }),

    // একজন User অনেক Instructor Application জমা দিতে পারে (one-to-many)
    instructorApplications: r.many.instructorApplications({
      from: r.users.id,
      to: r.instructorApplications.userId,
      alias: "applicant",
    }),

    // একজন Admin অনেক Application review করতে পারে (one-to-many)
    reviewedApplications: r.many.instructorApplications({
      from: r.users.id,
      to: r.instructorApplications.reviewedBy,
      alias: "reviewer",
    }),
  },

  courses: {
      // প্রতিটি Course-এর একজন Instructor থাকবে
    instructor: r.one.users({
      from: r.courses.instructorId,
      to: r.users.id,
      optional: false,
    }),
  },


  instructorApplications: {
     // Application জমা দেওয়া User
    user: r.one.users({
      from: r.instructorApplications.userId,
      to: r.users.id,
      alias: "applicant",
      optional: false,
    }),

    // Application review করা Admin (optional) ----The admin who reviewed it (reviewedBy is nullable until reviewed)
    reviewer: r.one.users({
      from: r.instructorApplications.reviewedBy,
      to: r.users.id,
      alias: "reviewer",
    }),
  },
}));