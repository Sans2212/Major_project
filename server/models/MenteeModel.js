import { Schema } from "mongoose";
import { generalConnection } from "../config/db"; // Import the general connection

const MenteeSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mentor", "mentee"], default: "mentee" }, // Default to mentee
});

// Add any custom validation or methods for Mentees if needed in the future

const MenteeModel = generalConnection.models.Mentee || generalConnection.model('Mentee', MenteeSchema, 'Mentee');
export default MenteeModel;