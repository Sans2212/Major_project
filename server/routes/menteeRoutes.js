import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import UserModel from "../models/User.js";

const router = express.Router();
const otpStore = {}; // Temporary memory storage for OTPs

// Helper function to check OTP expiry
const isOtpExpired = (email) => {
  const expiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds
  const otpTimestamp = otpStore[email]?.timestamp;
  if (!otpTimestamp) return true;
  return Date.now() - otpTimestamp > expiryTime;
};

// Step 1: Send OTP to mentee's email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // Ensure email exists and is a mentee
  const user = await UserModel.findOne({ email, role: "mentee" });
  if (!user) return res.status(404).json({ error: "Mentee not found" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, timestamp: Date.now() };

  // Setup nodemailer transporter
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
    text: `Hello ${user.fullName},\n\nYour OTP is: ${otp}\n\nValid for 10 minutes.`,
  };

  try {
    // Send OTP email
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Step 2: Reset Password using OTP
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // Ensure email exists and is a mentee
  const user = await UserModel.findOne({ email, role: "mentee" });
  if (!user) return res.status(404).json({ error: "Mentee not found" });

  // Check if OTP is expired
  if (isOtpExpired(email)) {
    delete otpStore[email]; // Clean up expired OTP
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  // Verify OTP
  if (otpStore[email]?.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updateOne({ email, role: "mentee" }, { password: hashedPassword });

  // Cleanup OTP after successful password reset
  delete otpStore[email];

  res.json({ message: "Password reset successful!" });
});

export default router;
