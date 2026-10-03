

//  requireAuth middleware শুধু access token verify করে

import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {

    // Authorization header থেকে token নেয়
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token required",
        });
    }

    // JWT verify করে
    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );


        // Valid হলে req.user.id সেট করে
        req.user = {
            id: payload.id,
        };

      // তারপর next() দিয়ে controller-এ পাঠায়  
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};