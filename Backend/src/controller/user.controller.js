import { eq , and, ne } from "drizzle-orm";
import {db} from "../db/db.js";
import {users} from "../db/schema.js";
import { refreshCookieOptions } from "../utils/token.js";
import bcrypt from "bcrypt";


export async function getProfile(req, res) {

    // Database থেকে user খোঁজা
     const [user] = await db

    .select({   // Drizzle ORM-এ .returning() insert, update এবং delete, তিনটার সাথেই ব্যবহার হয়, .returning() ব্যবহার না হলে যেমন : get, select()-এর ভেতরে যে যে ফিল্ড দেবেন, রেসপন্সে শুধু সেগুলোই আসবে। select() খালি রাখলে সব response আসে , sensitive ফিল্ড (যেমন password) বাদ দেওয়ার জন্য খালি select() ব্যবহার না করে স্পষ্টভাবে ফিল্ডগুলো লিখে দেওয়াই সবচেয়ে নিরাপদ ।
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



export async function updateProfile(req,res) {

  // req.body data নেওয়া হয়।
   const { name, email } = req.body;

// এই email অন্য কোনো user ব্যবহার করছে কিনা check , email DB-তে চেক হয়: এই email মেলে, কিন্তু id আমার নিজের নয়, এমন কোনো ইউজার আছে কি না।
  if (email) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.email, email), 
          ne(users.id, req.user.id))) // ne = not equal , সে নিজের email আবার দিয়ে profile update করল , নিজের email-কে conflict হিসেবে ধরা যাবে না। 
      .limit(1);

 if (existing) {
    return res.status(409).json({
        message: "Email is already in use",
    });
}
   // update user
  const [updatedUser] = await db
    .update(users)
    .set({ ...(name && { name }), ...(email && { email }), updatedAt: new Date() })
    .where(eq(users.id, req.user.id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      updatedAt: users.updatedAt,
    });

  if (!updatedUser) {
      return res.status(404).json({
            message: "User not found",
        });
  }
  // response
  res.status(200).json({ 
    success: true,
    message: "Profile updated successfully",
    data: updatedUser });
}

}


export async function deleteProfile(req,res){

 // req.body data নেওয়া হয়।
    const { password } = req.body;

   // Database থেকে user খোঁজা
  const [user] = await db
    .select(
      { id: users.id,
        password: users.password 
      })
    .from(users)
    .where(eq(users.id, req.user.id))
    .limit(1);

  if (!user) {
     return res.status(404).json({
            message: "User not found",
        });
  }

  //  Password compare করা
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
      return res.status(400).json({
            message: "Incorrect password",
        });
  }

// delete user
  await db.delete(users).where(eq(users.id, req.user.id));


// browser cookie clear
 res.clearCookie("refreshToken", refreshCookieOptions);

 // Response
  res.status(200).json(
    { success: true,
     message: "Account deleted successfully" 
      });
}