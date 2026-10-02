import { eq } from "drizzle-orm";
import {users} from "../db/schema.js"
import bcrypt from "bcrypt"
import { db } from "../db/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshCookieOptions} from "../utils/token.js";
  import jwt from "jsonwebtoken"


export async function signup(req, res, next){

        // 1. Request body থেকে data নেওয়া
       const {name , email , password} = req.body;

    // 1. Check if a user with this email already exists
    const [existingUser] = await db

    .select({id:users.id})
    .from(users)
    .where(eq(users.email, email))
    .limit(1)  //"একটা পেলেই থামো, এর বেশি result লাগবে না।", ১০ জন matching user আমাদের দরকার নেই ,একজন পেলেই যথেষ্ট।

    if(existingUser){
      return res.status(409).json({
            message:"Email already exist"
        })
    }
// user create in db
const hashedPassword = await bcrypt.hash(password, 10);

const [user] = await db 
    .insert(users)
    .values({name, email, password:hashedPassword})
    .returning({id:users.id,
                name:users.name,
                email:users.email});


// access Token 
  const accessToken = generateAccessToken(user.id);

    //refresh Token
const refreshToken = generateRefreshToken(user.id);

// browser cookie set
 res.cookie("refreshToken", refreshToken, refreshCookieOptions);

return res.status(201).json({
    message:"user Registerd Successfully",
    user,
    accessToken
    
}); 

}


export async function login(req, res, next) {

    
  // 1. Request body থেকে data নেওয়া
    const {email, password} = req.body;

 // 2. Basic validation
    if(!email || !password){
        return res.status(400).json({
            message:"Email and password are required"
        })
    }

       // Database থেকে user খোঁজা
    const [user] = await db
    .select({
        id:users.id,
        password:users.password
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

if(!user){
    return res.status(401).json({
        message:"Invalid email or password",
    })
}

    // 6. Password compare করা
const isPasswordValid = await bcrypt.compare(password, user.password)


if(!isPasswordValid){
    res.status(400).json({
        message:"Invalid email or password",
    })
}

//access token
const accessToken= generateAccessToken(user.id)

//refresh token
const refreshToken= generateRefreshToken(user.id)

// browser cookie set
res.cookie("refreshToken", refreshToken, refreshCookieOptions );

return res.status(200).json({
    message: "Login successful",
    accessToken,
    user:{
        id:user.id,
        name:user.name,
        email:user.email
    }
   
}) 
} 
/* সহজ নিয়ম: users হলো টেবিল, user হলো ডাটাবেস থেকে আসা একটা row।
users.password মানে কলামের রেফারেন্স। এটা শুধু query বানানোর সময় লাগে: select, where, eq, insert(users)।
user.password মানে ওই row-এর আসল ভ্যালু (hash করা পাসওয়ার্ড স্ট্রিং)। এটা bcrypt.compare-এ যাবে। */

export async function logout(req, res) {
    
    res.clearCookie("refreshToken", refreshCookieOptions)

    return res.status(200).json({
    message: "Logout successful",
  });
}

// 15 minutes পর Access token  expire হলে, browser automatically /api/auth/refresh API call করবে এবং refresh token ব্যবহার করে একটি নতুন access token নেবে।
export async function refreshToken(req, res) {

  // কুকি থেকে refresh token নেওয়া
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  // যাচাই করে , Token নকল হলে
let payload

  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }


  //DB-তে user আছে কি না চেক
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, payload.id))
    .limit(1);

  if (!user) {
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res.status(401).json({ message: "User no longer exists" });
  }

  //নতুন access token বানানো
  const accessToken = generateAccessToken(user.id);

  return res.status(200).json({ accessToken });
}


