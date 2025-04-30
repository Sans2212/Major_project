import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Creating separate connections for mentee and mentor databases
const menteeConnection = mongoose.createConnection(process.env.MONGO_URI_MENTEE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const mentorConnection = mongoose.createConnection(process.env.MONGO_URI_MENTOR, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Event listeners for error handling
menteeConnection.on('connected', () => {
  console.log('Mentee database connected');
});

mentorConnection.on('connected', () => {
  console.log('Mentor database connected');
});

// Error handling for connections
menteeConnection.on('error', (err) => {
  console.error('Error connecting to Mentee database:', err);
});

mentorConnection.on('error', (err) => {
  console.error('Error connecting to Mentor database:', err);
});

// Export the connections for use in other parts of your application
export { menteeConnection, mentorConnection };
