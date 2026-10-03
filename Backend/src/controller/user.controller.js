import { eq } from "drizzle-orm";
import {db} from "../db/db.js";
import {users} from "../db/schema.js";


export async function getProfile(req, res) {

    // Database থেকে user খোঁজা
     const [user] = await db

    .select({   // select()-এর ভেতরে যে যে ফিল্ড দেবেন, রেসপন্সে শুধু সেগুলোই আসবে। select() খালি রাখলে সব response আসে , sensitive ফিল্ড (যেমন password) বাদ দেওয়ার জন্য খালি select() ব্যবহার না করে স্পষ্টভাবে ফিল্ডগুলো লিখে দেওয়াই সবচেয়ে নিরাপদ।
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, req.user.id))
    .limit(1);

  if (!user) {
   res.status(404).json({
    message:"user not found"
   })
  }
  
// response পাঠানো
  res.status(200).json({ success: true, data: user });
}