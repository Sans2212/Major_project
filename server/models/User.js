const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mentor", "mentee"], required: true },
  expertise: { type: String, default: "" },  // Set default for mentees
  experience: { type: Number, default: null },  // Set default for mentees
});

// Custom validation for mentors
UserSchema.pre("validate", function (next) {
  if (this.role === "Mentor") {
    if (!this.expertise) {
      return next(new Error("Expertise is required for mentors"));
    }
    if (this.experience == null) {
      return next(new Error("Experience is required for mentors"));
    }
  }
  next();
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
