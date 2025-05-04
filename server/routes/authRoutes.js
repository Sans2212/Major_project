import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { env } from 'process';
import UserModel from '../models/User.js';
import Mentor from '../models/MentorModel.js';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Get environment variables or use fallbacks
const config = {
  jwtSecret: env.JWT_SECRET || 'your-secret-key',
  nodeEnv: env.NODE_ENV || 'development'
};

const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("=== Login Attempt ===");
  console.log("Request body:", req.body);
  let { email, password, role } = req.body;

  if (!email || !password || !role) {
    console.log("Missing required fields:", { email: !!email, password: !!password, role: !!role });
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  // Normalize role and email
  role = role.trim().toLowerCase();
  email = email.trim().toLowerCase();
  
  console.log("Normalized credentials:", { email, role });

  try {
    const model = role === "mentor" ? Mentor : UserModel;
    console.log("Using model:", model ? model.modelName : "none");
    
    if (!model) {
      console.log("Invalid role provided");
      return res.status(400).json({ error: "Invalid role provided" });
    }

    const user = await model.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Stored password hash:", user.password);
    console.log("Attempting password validation...");
    
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    console.log("Login successful, sending response");

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "Strict",
    });

    res.json({ 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        firstName: user.firstName || user.fullName,
        lastName: user.lastName,
        email: user.email,
        role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password, confirmPassword, role } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const model = role === "mentor" ? Mentor : UserModel;
    if (!model) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password before creating user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new model({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "Strict",
    });

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/session", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const model = decoded.role === "mentor" ? Mentor : UserModel;
    
    const user = await model.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: decoded.role,
      firstName: user.firstName || user.fullName,
      lastName: user.lastName,
      profilePhoto: user.profilePhoto
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Default export
export default router;
