// // middleware/auth.js
// import jwt from "jsonwebtoken";

// // 🔐 Verify Token Middleware
// const auth = (req, res, next) => {
//   const authHeader = req.header("Authorization");

//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 🔥 Attach full decoded payload
//     req.user = decoded; 
//     // Now available:
//     // req.user.id
//     // req.user.role
//     // req.user.email

//     next();
//   } catch (err) {
//     return res.status(401).json({ msg: "Token is not valid" });
//   }
// };

// export default auth;


// middleware/auth.js
import jwt from "jsonwebtoken";


/* ========================================= */
/* 🔐 VERIFY TOKEN MIDDLEWARE                */
/* ========================================= */

export const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ msg: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request
    req.user = decoded;
    // Available:
    // req.user.id
    // req.user.role
    // req.user.email

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired." });
    }

    return res.status(401).json({ msg: "Invalid token." });
  }
};

/* ========================================= */
/* 🔐 ROLE AUTHORIZATION MIDDLEWARE         */
/* ========================================= */

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        msg: "Access forbidden. You do not have permission.",
      });
    }

    next();
  };
};