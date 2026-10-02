import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "15d";

export const REFRESH_COOKIE_MAX_AGE = 15 * 24 * 60 * 60 * 1000; // 15 days


export function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export const refreshCookieOptions = {
  httpOnly: true, // JS দিয়ে পড়া যাবে না
  secure: process.env.NODE_ENV === "production", // production-এ শুধু HTTPS
  sameSite: "lax",
  path: "/",
  maxAge: REFRESH_COOKIE_MAX_AGE
};