
// এই authorizeRoles middleware-এর কাজ হলো কোন user কোন কাজ করতে পারবে, সেটা তার role দেখে অনুমতি দেওয়া


export const authorizeRoles = (...allowedRoles) => {  // ...allowedRoles হলো Rest Parameter। এটি একাধিক role-কে allow করে

  return (req, res, next) => {

    if (!req.user) {  // req.user সাধারণত আগের requireAuth middleware থেকে আসে
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
   

    next();
  };
};