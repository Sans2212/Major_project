import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await MentorModel.updateOne({ email }, { password: hashedPassword });

  delete otpStore[email];
  res.json({ message: "Password reset successful!" });
});

// ---------------------- Mentor Apply Route ----------------------

router.post("/apply", upload.single("profilePhoto"), async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;

    const {
      firstName, lastName, email, jobTitle, company,
      location, category, skills, bio, linkedin,
      twitter, website, introVideo, password, confirmPassword
    } = req.body;

    // Validate password fields
    if (!password || !confirmPassword) {
      return res.status(400).json({ error: "Password and confirm password are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhoto = req.file ? req.file.filename : null;

    const mentor = new MentorModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
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

    await mentor.save();
    res.status(201).json({ message: "Mentor saved successfully!" });
  } catch (error) {
    console.error("Error saving mentor:", error);
    res.status(500).json({ error: "Failed to save mentor" });
  }
});

export default router;
