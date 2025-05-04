import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { env } from 'process';
import fs from 'fs';

import { menteeConnection, mentorConnection } from './config/db.js';
import Mentor from './models/MentorModel.js';
import UserModel from './models/User.js';

import authRoutes from './routes/authRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import menteeRoutes from './routes/menteeRoutes.js';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const menteesDir = path.join(uploadsDir, 'mentees');
const mentorsDir = path.join(uploadsDir, 'mentors');

[uploadsDir, menteesDir, mentorsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Add endpoint to get server port
app.get('/api/server-info', (req, res) => {
  res.json({ port: app.get('port') });
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = await import('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.listen(startPort + 1);
      } else {
        reject(err);
      }
    });

    server.on('listening', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.listen(startPort);
  });
};

// Connect to databases and start server
Promise.all([menteeConnection.asPromise(), mentorConnection.asPromise()])
  .then(async () => {
    console.log('✅ Mongoose connected to mentee DB');
    console.log('✅ Mongoose connected to mentor DB');

    // Attach models globally
    app.locals.UserModel = UserModel;
    app.locals.MentorModel = Mentor;

    // Routes
    app.use('/api/auth', (req, res, next) => { req.models = { UserModel, MentorModel: Mentor }; next(); }, authRoutes);
    app.use('/api/mentors', (req, res, next) => { req.models = { MentorModel: Mentor }; next(); }, mentorRoutes);
    app.use('/api/mentees', (req, res, next) => { req.models = { UserModel }; next(); }, menteeRoutes);

    try {
      // Try to find an available port
      const availablePort = await findAvailablePort(PORT);
      
      // Start the server
      app.listen(availablePort, () => {
        console.log(`🚀 Server is running on port ${availablePort}`);
        if (availablePort !== PORT) {
          console.log(`⚠️ Original port ${PORT} was in use, using port ${availablePort} instead`);
        }
      });
    } catch (err) {
      console.error('❌ Failed to start server:', err);
    }
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });
