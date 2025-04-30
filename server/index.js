import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { menteeConnection, mentorConnection } from './config/db.js'; // ✅ Corrected import here
import UserSchema from './schemas/UserSchema.js';
import MentorSchema from './schemas/MentorSchema.js';

import authRoutes from './routes/authRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import menteeRoutes from './routes/menteeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

// Connect to both databases
Promise.all([menteeConnection.asPromise(), mentorConnection.asPromise()])
  .then(() => {
    console.log('✅ Mongoose connected to mentee DB');
    console.log('✅ Mongoose connected to mentor DB');

    // Create models after connection
    const UserModel = menteeConnection.models.User || menteeConnection.model('User', UserSchema);
    const MentorModel = mentorConnection.models.Mentor || mentorConnection.model('Mentor', MentorSchema);

    // Attach models globally
    app.locals.UserModel = UserModel;
    app.locals.MentorModel = MentorModel;

    // Routes
    app.use('/api/auth', (req, res, next) => { req.models = { UserModel, MentorModel }; next(); }, authRoutes);
    app.use('/api/mentors', (req, res, next) => { req.models = { MentorModel }; next(); }, mentorRoutes);
    app.use('/api/mentees', (req, res, next) => { req.models = { UserModel }; next(); }, menteeRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });
