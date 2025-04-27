const mongoose = require("mongoose");

const MenteeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mentor", "mentee"], default: "mentee" }, // Default to mentee
});

// Add any custom validation or methods for Mentees if needed in the future

const MenteeModel = mongoose.model("mentees", MenteeSchema);
module.exports = MenteeModel;
