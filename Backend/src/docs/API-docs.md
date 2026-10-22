# LMS Core API Endpoints

## Auth 
- POST /api/auth/signup — নতুন account তৈরি, role সবসময় student হবে।
- POST /api/auth/login — email ও password দিয়ে login, access token ও refresh token পাওয়া।
- POST /api/auth/refresh — refresh token দিয়ে নতুন access token নেওয়া।
- POST /api/auth/logout — refresh token বাতিল করে logout করা।

## User Profile (নিজের প্রোফাইল), Student Management
- GET /api/users/me — logged in user এর নিজের তথ্য দেখা।
- PATCH /api/users/me — নিজের নাম ইত্যাদি তথ্য আপডেট করা।
- PATCH /api/users/me/password — পুরনো password দিয়ে নতুন password সেট করা।

## Instructor Application (instructor হওয়ার আবেদন)
- POST /api/instructor-applications — student এর instructor হওয়ার আবেদন জমা দেওয়া (student)।
- GET /api/instructor-applications/me — নিজের আবেদনের অবস্থা দেখা: pending, approved বা rejected (student, instructor)।
- GET /api/instructor-applications — সব আবেদনের তালিকা, (admin)।
- PATCH /api/instructor-applications/:id/approve — আবেদন approve করা, user এর role instructor হয়ে যায় (admin)।
- PATCH /api/instructor-applications/:id/reject — আবেদন reject করা (admin)।

## Public Course (login ছাড়া সবাই দেখতে পারবে)
- GET /api/courses — শুধু published course এর তালিকা।
- GET /api/courses/:slug — একটা published course এর বিস্তারিত, section ও lesson এর শিরোনাম সহ।

## Instructor Course Management (instructor এর নিজের course)
- POST /api/courses — নতুন course তৈরি, শুরুতে status draft থাকে।
- GET /api/courses/my-courses — নিজের তৈরি সব course এর তালিকা।
- GET /api/courses/my-courses/:id — নিজের একটা course এর বিস্তারিত, draft সহ।
- PATCH /api/courses/my-courses/:id —  আপডেট করা।
- DELETE /api/courses/my-courses/:id — শুধু draft course মুছে ফেলা।
- PATCH /api/courses/my-courses/:id/submit —
- PATCH /api/courses/my-courses/:id/archive — published course archive করা।
- GET /api/courses/my-courses/:id/students — এই course এ কারা enroll করেছে তার তালিকা।

## Section Management (course এর অধ্যায়, instructor)
- POST /api/courses/my-courses/:courseId/sections — course এ নতুন section যোগ করা।
- PATCH /api/sections/:id — section এর নাম বা ক্রম বদলানো।
- DELETE /api/sections/:id — section মুছে ফেলা।

## Lesson Management (section এর পাঠ, instructor)
- POST /api/sections/:sectionId/lessons — section এ নতুন lesson যোগ করা (title, video url, content, ক্রম)।
- PATCH /api/lessons/:id — lesson এর তথ্য আপডেট করা।
- DELETE /api/lessons/:id — lesson মুছে ফেলা।

## Enrollment (ভর্তি, student)
- POST /api/courses/:id/enroll — course এ ভর্তি হওয়া।
- GET /api/enrollments/my — নিজের ভর্তি হওয়া সব course এর তালিকা।
- GET /api/enrollments/my/:courseId/content — ভর্তি থাকলে course এর সব section ও lesson এর আসল content দেখা।

## Progress (অগ্রগতি, student)
- POST /api/lessons/:id/complete — lesson শেষ হয়েছে বলে চিহ্নিত করা।
- DELETE /api/lessons/:id/complete — lesson এর complete চিহ্ন সরানো।
- GET /api/enrollments/my/:courseId/progress — course এর কত শতাংশ শেষ হয়েছে দেখা।

## Admin Course Management (course পরিচালনা)
- GET /api/admin/courses — সব course এর তালিকা, ?status=pending দিয়ে approval queue দেখা।
- GET /api/admin/courses/:id — যেকোনো course এর বিস্তারিত দেখা।
- PATCH /api/admin/courses/:id/approve — pending course approve করে published করা।
- PATCH /api/admin/courses/:id/reject — pending course reject করে আবার draft এ ফেরত পাঠানো, কারণ সহ।
- PATCH /api/admin/courses/:id/archive — প্রয়োজনে যেকোনো course archive করা।

## Admin User Management (ইউজার পরিচালনা)
- GET /api/admin/users — সব user এর তালিকা, ?role=&page= দিয়ে filter।
- GET /api/admin/users/:id — নির্দিষ্ট user এর details দেখা।
- PATCH /api/admin/users/:id/role — user এর role পরিবর্তন করা, নিজের role ছাড়া।
- PATCH /api/admin/users/:id/status — user কে active বা suspended করা।
- DELETE /api/admin/users/:id — user delete করা।

## Admin Dashboard (পরিসংখ্যান)
- GET /api/admin/stats — মোট user, course, enrollment ও pending আবেদনের সংখ্যা।




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