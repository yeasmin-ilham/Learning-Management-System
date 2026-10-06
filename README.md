# LMS Backend

REST API for a Learning Management System (LMS). It handles authentication, course management, enrollments, lessons, assignments, and progress tracking.

## Tech Stack

- **Runtime:** Node.js (LTS)
- **Framework:** Express 5.2.1
- **Language:** JavaScript (ES Modules)
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Validation:** Zod
- **Auth:** JWT (access + refresh tokens), bcrypt for password hashing

## Features

- User registration, login, and role-based access (`admin`, `instructor`, `student`)
- Course CRUD with categories and publishing status
- Modules and lessons inside each course
- Student enrollment and progress tracking
- Assignments and submissions with grading
- Centralized error handling and request validation

## Project Structure

```
src/
├── config/          # env, database connection
├── db/
│   ├── schema/      # Drizzle table definitions
│   └── migrations/  # Generated SQL migrations
├── middlewares/     # auth, validate, error handler
├── modules/
│   ├── auth/
│   ├── users/
│   ├── courses/
│   ├── lessons/
│   ├── enrollments/
│   └── assignments/
│       ├── *.routes.js
│       ├── *.controller.js
│       ├── *.service.js
│       └── *.schema.js   # Zod schemas
├── utils/           # AppError, helpers
├── app.js           # Express app setup
└── server.js        # Entry point
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### Installation

```bash
git clone <repository-url>
cd lms-backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lms
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### Database Setup

```bash
npm run db:generate   # generate migrations from schema
npm run db:migrate    # apply migrations
npm run db:seed       # optional: seed sample data
```

### Run the Server

```bash
npm run dev     # development with auto-reload
npm start       # production
```

The API runs at `http://localhost:5000/api/v1`.

## Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Start with file watching            |
| `npm start`           | Start in production mode            |
| `npm run db:generate` | Generate Drizzle migrations         |
| `npm run db:migrate`  | Apply migrations                    |
| `npm run db:studio`   | Open Drizzle Studio                 |
| `npm test`            | Run tests                           |

## API Overview

Base URL: `/api/v1`

### Auth

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | `/auth/register`  | Register a new user    |
| POST   | `/auth/login`     | Log in                 |
| POST   | `/auth/refresh`   | Refresh access token   |
| POST   | `/auth/logout`    | Log out                |

### Courses

| Method | Endpoint        | Description                     | Role              |
| ------ | --------------- | ------------------------------- | ----------------- |
| GET    | `/courses`      | List published courses          | Public            |
| GET    | `/courses/:id`  | Get course details              | Public            |
| POST   | `/courses`      | Create a course                 | Instructor, Admin |
| PATCH  | `/courses/:id`  | Update a course                 | Owner, Admin      |
| DELETE | `/courses/:id`  | Delete a course                 | Owner, Admin      |

### Lessons

| Method | Endpoint                      | Description        | Role              |
| ------ | ----------------------------- | ------------------ | ----------------- |
| GET    | `/courses/:id/lessons`        | List lessons       | Enrolled, Owner   |
| POST   | `/courses/:id/lessons`        | Add a lesson       | Instructor, Admin |
| PATCH  | `/lessons/:id`                | Update a lesson    | Owner, Admin      |
| DELETE | `/lessons/:id`                | Delete a lesson    | Owner, Admin      |

### Enrollments and Progress

| Method | Endpoint                         | Description                  | Role    |
| ------ | -------------------------------- | ---------------------------- | ------- |
| POST   | `/courses/:id/enroll`            | Enroll in a course           | Student |
| GET    | `/enrollments/me`                | List my enrollments          | Student |
| POST   | `/lessons/:id/complete`          | Mark a lesson as completed   | Student |

### Assignments

| Method | Endpoint                          | Description             | Role       |
| ------ | --------------------------------- | ----------------------- | ---------- |
| POST   | `/courses/:id/assignments`        | Create an assignment    | Instructor |
| POST   | `/assignments/:id/submissions`    | Submit an assignment    | Student    |
| PATCH  | `/submissions/:id/grade`          | Grade a submission      | Instructor |

## Error Handling

All errors go through a single global error-handling middleware and return a consistent shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "path": "email", "message": "Invalid email address" }
  ]
}
```

- **Validation errors (400):** thrown from Zod schemas via the `validate` middleware
- **Auth errors (401/403):** invalid token or insufficient role
- **Not found (404):** missing resources
- **Server errors (500):** unexpected failures, with stack traces hidden in production

Express 5 forwards rejected promises from async handlers to the error middleware automatically, so no `try/catch` wrapper is needed in controllers.

## Database Schema (Core Tables)

- `users`: id, name, email, password_hash, role
- `courses`: id, title, description, instructor_id, status, price
- `lessons`: id, course_id, title, content, position
- `enrollments`: id, user_id, course_id, enrolled_at
- `lesson_progress`: id, user_id, lesson_id, completed_at
- `assignments`: id, course_id, title, due_date
- `submissions`: id, assignment_id, user_id, content, grade

## Security

- Passwords hashed with bcrypt
- JWT-based authentication with short-lived access tokens
- Role-based authorization middleware
- Request validation on every input with Zod
- `helmet`, `cors`, and rate limiting enabled

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Commit your changes with clear messages
3. Push and open a pull request

## License

MIT
