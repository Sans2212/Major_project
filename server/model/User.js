const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mentor", "mentee"], required: true },
  expertise: { type: String, required: function () { return this.role === "mentor"; } }, // ✅ Only required for mentors
  experience: { type: Number, required: function () { return this.role === "mentor"; } }, // ✅ Only required for mentors
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
