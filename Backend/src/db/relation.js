

import { defineRelations } from "drizzle-orm";
import * as schema from "./schema/index.js";


export const relations = defineRelations(schema, (r) => ({
 // One-to-many:(users, courses), ২টি relation তৈরি হয়েছে — একটি One-to-Many, আরেকটি Many-to-One। দুটোই একই relationship-এর দুই দিক।
  users: {
    createdCourses: r.many.courses({
      from: r.users.id,                 // একজন User → অনেক Course
      to: r.courses.instructorId,
    }),
  },

  courses: {
    instructor: r.one.users({
      from: r.courses.instructorId,
      to: r.users.id,
      optional: false,
    }),
  },
}));