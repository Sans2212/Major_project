import express from 'express';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const otpStore = {};

// ---------------------- OTP Helpers ----------------------

const isOtpExpired = (email) => {
  const expiryTime = 10 * 60 * 1000;
  const otpTimestamp = otpStore[email]?.timestamp;
  if (!otpTimestamp) return true;
  return Date.now() - otpTimestamp > expiryTime;
};

// ---------------------- Multer Config ----------------------

const uploadDir = path.join('uploads', 'mentors');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ---------------------- OTP Routes ----------------------

router.post("/forgot-password/send-otp", async (req, res) => {
  const { email } = req.body;
  const MentorModel = req.app.locals.MentorModel;

  const mentor = await MentorModel.findOne({ email });
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, timestamp: Date.now() };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mentor Connect - OTP for Password Reset",
    text: `Hello ${mentor.firstName},\n\nYour OTP is: ${otp}\n\nValid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/forgot-password/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const MentorModel = req.app.locals.MentorModel;

  const mentor = await MentorModel.findOne({ email });
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });

  if (isOtpExpired(email)) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  if (otpStore[email]?.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await MentorModel.updateOne({ email }, { password: hashedPassword });

  delete otpStore[email];
  res.json({ message: "Password reset successful!" });
});

// ---------------------- Mentor Apply Route ----------------------

router.post("/apply", upload.single("profilePhoto"), async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;

    console.log("=== New Mentor Signup ===");
    console.log("Received mentor data:", {
      ...req.body,
      password: req.body.password ? "exists" : "missing",
      confirmPassword: req.body.confirmPassword ? "exists" : "missing"
    });

    const {
      firstName, lastName, email, jobTitle, company,
      location, category, skills, bio, linkedin,
      twitter, website, introVideo, password, confirmPassword
    } = req.body;

    // Validate password fields
    if (!password || !confirmPassword) {
      console.log("Password validation failed - missing fields");
      return res.status(400).json({ error: "Password and confirm password are required." });
    }

    if (password !== confirmPassword) {
      console.log("Password validation failed - passwords don't match");
      return res.status(400).json({ error: "Passwords do not match." });
    }

    if (password.length < 6) {
      console.log("Password validation failed - too short");
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Check if mentor already exists
    const existingMentor = await MentorModel.findOne({ email });
    if (existingMentor) {
      console.log("Mentor already exists with email:", email);
      return res.status(400).json({ error: "A mentor with this email already exists." });
    }

    const profilePhoto = req.file ? req.file.filename : null;

    console.log("Creating new mentor with email:", email);
    const mentor = new MentorModel({
      firstName,
      lastName,
      email,
      password, // The schema's pre-save middleware will hash this
      jobTitle,
      company,
      location,
      category,
      skills,
      bio,
      linkedin,
      twitter,
      website,
      introVideo,
      profilePhoto
    });

    console.log("About to save mentor...");
    await mentor.save();
    console.log("Mentor saved successfully");

    // Create and send JWT token
    const token = jwt.sign(
      { id: mentor._id, role: 'mentor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      message: "Mentor registration successful!", 
      token,
      mentor: {
        id: mentor._id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email
      }
    });
  } catch (error) {
    console.error("Error saving mentor:", error);
    res.status(500).json({ error: "Failed to save mentor. " + error.message });
  }
});

// ---------------------- Profile Routes ----------------------

router.get("/profile/:mentorId", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findById(req.params.mentorId).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Error fetching mentor profile" });
  }
});

router.put("/profile/:mentorId", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const { mentorId } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.email;

    const updatedMentor = await MentorModel.findByIdAndUpdate(
      mentorId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedMentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(updatedMentor);
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    res.status(500).json({ error: "Error updating mentor profile" });
  }
});

// Get all mentors (for browse mentors page)
router.get("/browse", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentors = await MentorModel.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ error: "Error fetching mentors" });
  }
});

// Get mentor by email
router.get("/profile-by-email/:email", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findOne({ email: req.params.email }).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json({ mentorId: mentor._id });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({ error: "Error fetching mentor" });
  }
});

// Get mentor by username
router.get("/profile/username/:username", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findOne({ username: req.params.username }).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({ error: "Error fetching mentor" });
  }
});

// Search mentors
router.get("/search", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchRegex = new RegExp(q, 'i');
    const mentors = await MentorModel.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { jobTitle: searchRegex },
        { skills: searchRegex },
        { bio: searchRegex }
      ]
    }).select('-password').limit(20);

    res.json(mentors);
  } catch (error) {
    console.error("Error searching mentors:", error);
    res.status(500).json({ error: "Error searching mentors" });
  }
});

export default router;
