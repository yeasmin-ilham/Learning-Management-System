
// This file---only for Guideline

1. Admin API Endpoints

admin User Management (ইউজার পরিচালনা)
- GET /api/admin/users — সব user-এর তালিকা দেখা।
- GET /api/admin/users/:id — নির্দিষ্ট user-এর details দেখা।
- PATCH /api/admin/users/:id/role — user-এর role পরিবর্তন করা, যেমন student থেকে instructor।
- PATCH /api/admin/users/:id/status — user-কে active বা suspended করা।
- DELETE /api/admin/users/:id — user delete করা।
admin Instructor Management (ইনস্ট্রাক্টর পরিচালনা)
- GET /api/admin/instructors — সব instructor দেখা।
- GET /api/admin/instructor-applications — instructor applications দেখা।
- PATCH /api/admin/instructor-applications/:id/approve — instructor application approve করা।
- PATCH /api/admin/instructor-applications/:id/reject — application reject করা।
admin Course Management (কোর্স পরিচালনা)
- GET /api/admin/courses — সব course দেখা।
- PATCH /api/admin/courses/:id/status — course publish, unpublish বা suspend করা।
- DELETE /api/admin/courses/:id — অনুপযুক্ত course delete করা।



2. Instructor API Endpoints

Instructor Application (ইনস্ট্রাক্টর হওয়ার আবেদন)
যদি Admin approval system রাখো, তাহলে student প্রথমে instructor হওয়ার আবেদন করবে।
- POST /api/instructor-applications — Instructor হওয়ার আবেদন করা।
- GET /api/instructor-applications/me — নিজের application status দেখা।
- GET /api/admin/instructor-applications — Admin সব application দেখবে।
- PATCH /api/admin/instructor-applications/:id/approve — Admin application approve করবে।
- PATCH /api/admin/instructor-applications/:id/reject — Admin application reject করবে।
 Instructor Course Management (কোর্স তৈরি ও পরিচালনা)
- POST /api/instructor/courses — নতুন course তৈরি করা।
- GET /api/instructor/courses — নিজের তৈরি করা সব course দেখা।
- GET /api/instructor/courses/:id — নিজের নির্দিষ্ট course-এর details দেখা।
- PATCH /api/instructor/courses/:id — নিজের course update করা।
- DELETE /api/instructor/courses/:id — নিজের course delete করা।
Course Publishing (কোর্স প্রকাশ করা)
- PATCH /api/instructor/courses/:id/submit — Review-এর জন্য course submit করা।
- PATCH /api/instructor/courses/:id/publish — Course publish করা, যদি তোমার LMS-এ instructor-কে এই permission দেওয়া হয়।
- PATCH /api/instructor/courses/:id/unpublish — নিজের course unpublish করা।
Course Content Management (লেকচার ও মডিউল)
- POST /api/instructor/courses/:courseId/sections — Course-এর section তৈরি করা।
- PATCH /api/instructor/sections/:id — Section update করা।
- DELETE /api/instructor/sections/:id — Section delete করা।
- POST /api/instructor/sections/:sectionId/lessons — Lesson তৈরি করা।
- PATCH /api/instructor/lessons/:id — Lesson update করা।
- DELETE /api/instructor/lessons/:id — Lesson delete করা।
Instructor Dashboard
- GET /api/instructor/dashboard — নিজের course, enrollment ও earnings summary দেখা।
- GET /api/instructor/courses/:id/students — নির্দিষ্ট course-এর enrolled students দেখা।
- GET /api/instructor/earnings — নিজের earnings দেখা, যদি payment ও revenue-sharing system থাকে।



3.Student Management

- GET /api/users/me — নিজের profile দেখা।
- PATCH /api/users/me — নিজের profile update করা।
- DELETE /api/users/me — নিজের account delete করা।
- GET /api/users/me/courses — নিজের enrolled courses দেখা।




4.Enrollment & Learning

- POST /api/courses/:courseId/enroll — course-এ enroll করা।
- GET /api/learn/:courseId — enrolled course শেখা শুরু করা।
- PATCH /api/lessons/:lessonId/progress — lesson progress update করা।
- GET /api/users/me/progress — নিজের learning progress দেখা।
- POST /api/courses/:courseId/reviews — course review দেওয়া।
- GET /api/courses/:courseId/reviews — course reviews দেখা।



5.Payment & Orders
- POST /api/checkout — course purchase শুরু করা।
- GET /api/orders/me — নিজের order history দেখা।
- GET /api/payments/:id — নিজের payment details দেখা।
- POST /api/webhooks/stripe — Stripe payment event গ্রহণ করা।




6.Quiz & Certificate
- GET /api/courses/:courseId/quizzes — course-এর quizzes দেখা।
- POST /api/quizzes/:quizId/attempts — quiz attempt শুরু বা submit করা।
- GET /api/users/me/certificates — নিজের certificates দেখা।
- GET /api/certificates/:id — certificate details যাচাই করা।



7.Additional Features
- GET /api/notifications — notifications দেখা।
- PATCH /api/notifications/:id/read — notification read করা।
- POST /api/users/me/wishlist/:courseId — wishlist-এ course যোগ করা।
- DELETE /api/users/me/wishlist/:courseId — wishlist থেকে course সরানো।
- POST /api/support/tickets — support ticket তৈরি করা।
- POST /api/reports — অনুপযুক্ত content report করা।