const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UserModel = require("../models/User"); // Mentee model

const otpStore = {}; // Temp memory storage for OTPs

// Step 1: Send OTP to email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email, role: "mentee" });
  if (!user) return res.status(404).json({ error: "Mentee not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

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

  if (otpStore[email] !== otp) return res.status(400).json({ error: "Invalid OTP" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updateOne({ email, role: "mentee" }, { password: hashedPassword });

  delete otpStore[email];
  res.json({ message: "Password reset successful!" });
});

module.exports = router;
