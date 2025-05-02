import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const model = role === "mentor" ? req.models.MentorModel : req.models.UserModel;
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
    
    const isPasswordValid = await user.isValidPassword(password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "1h" }
    );

    console.log("Login successful, sending response");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
    const model = role === "mentor" ? req.models.MentorModel : req.models.UserModel;
    if (!model) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }


    const newUser = new model({
      fullName,
      email,
      password: password,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/session", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(200).json({ userId: decoded.id, role: decoded.role });
  });
});

// Default export
export default router;
