// import User from "../model/user.model.js";
// import jwt from "jsonwebtoken";

// console.log("JWT SECRET:", process.env.JWT_SECRET);

// // Generate JWT Token
// const generateToken = (user) => {
//   console.log("JWT SECRET", process.env.JWT_SECRET);
//   return jwt.sign(
//     { user: { id: user._id, email: user.email } },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// // Register
// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     console.log("Register request:", { name, email, password });

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: "Please provide all required fields" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // Create new user
//     const user = new User({ name, email, password });
//     console.log("User created:", user);

//     await user.save();
//     console.log("User saved successfully:", user._id);

//     // Generate token
//     const token = generateToken(user);

//     res.status(201).json({
//       msg: "User registered successfully",
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err.message);
//     console.error("Full error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({ msg: "Please provide email and password" });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ msg: "Invalid credentials" });
//     }

//     // Check password
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ msg: "Invalid credentials" });
//     }

//     // Generate token
//     const token = generateToken(user);

//     res.status(200).json({
//       msg: "Logged in successfully",
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error during login" });
//   }
// };

import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role, // 🔥 ADD ROLE
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};


// ====================== REGISTER ======================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 🔒 Always assign lowest privilege
    const user = new User({
      name,
      email,
      password,
      role: "User", // or "Viewer" (recommended)4
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      msg: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔥 SEND ROLE
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during login" });
  }
};
