const mongoose = require('mongoose');
require('dotenv').config();

// Create connections for both databases
const generalConnection = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: 'menteecredentials',
});

const mentorConnection = mongoose.createConnection(process.env.MONGO_URI_MENTOR, {
  dbName: 'mentorCeradentials',
});


// Logging successful connection for both databases
generalConnection.once('open', () => {
  console.log('✅ Mongoose connected to mentee DB');
});

mentorConnection.once('open', () => {
  console.log('✅ Mongoose connected to mentor DB');
});

// Logging error for both databases
generalConnection.on('error', (err) => {
  console.error('❌ Mentee DB connection error:', err);
});

mentorConnection.on('error', (err) => {
  console.error('❌ Mentor DB connection error:', err);
});

// Export the connection objects for use in other files
module.exports = { generalConnection, mentorConnection };
