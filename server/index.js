require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// DB connections
const { generalConnection: menteeConnection, mentorConnection } = require('./config/db');

// Import schemas (not models)
const UserSchema = require('./schemas/UserSchema');
const MentorSchema = require('./schemas/MentorSchema');

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

    // Now create models only after successful connection
    const UserModel = menteeConnection.model('User', UserSchema);
    const MentorModel = mentorConnection.model('Mentor', MentorSchema);

    // Attach to app for access in routes
    app.locals.UserModel = UserModel;
    app.locals.MentorModel = MentorModel;

    // Signup route
    app.post('/signup', async (req, res) => {
      const { fullName, email, password, confirmPassword, expertise, experience } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match!' });
      }

      const role = expertise ? 'mentor' : 'mentee';
      const Model = role === 'mentor' ? MentorModel : UserModel;

      try {
        const existingUser = await Model.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists!' });
        }

        if (role === 'mentor' && (!expertise || experience == null)) {
          return res.status(400).json({ error: 'Expertise and experience are required for mentors!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Model({
          fullName,
          email,
          password: hashedPassword,
          role,
          ...(role === 'mentor' && { expertise, experience })
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!', role });

      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Error registering user. Please try again later.' });
      }
    });

    // Login route
    app.post('/login', async (req, res) => {
      const { email, password, role } = req.body;
      const Model = role === 'mentor' ? MentorModel : UserModel;

      try {
        const user = await Model.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: 'User not found!' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(400).json({ error: 'Invalid password!' });
        }

        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(200).json({
          message: `Login successful as ${user.role}!`,
          role: user.role,
          token
        });

      } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Error logging in. Please try again later.' });
      }
    });

    // Routes
    const mentorRoutes = require('./routes/mentorRoutes');
    const menteeRoutes = require('./routes/menteeRoutes');

    app.use('/api/mentors', mentorRoutes);
    app.use('/api/mentees', menteeRoutes);

    // Start server only after DBs are connected
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });
