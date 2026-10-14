


// requireAuth middleware 1)শুধু access token verify করে, 2)Database-এ User খোঁজে-যে ইউজার API request করেছে, 3)req.user সেট করে


import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../db/schema/index.js";

export const requireAuth = async (req, res, next) => {

  // Read token from user Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  let payload;

  // access Token verify করে
  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  // Database-এ User খোঁজে(যে ইউজার API request করেছে) --যার id ,Token-এর payload.id মিলে (never select the password)
  const [user] = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, payload.id));

  if (!user) {
    return res.status(401).json({
      message: "User no longer exists",
    });
  }

  //  req.user সেট করে
  req.user = user;

 // তারপর next() দিয়ে middleware/controller-এ পাঠায় 
  next();
};