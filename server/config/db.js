// server/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const generalConnection = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: 'menteecredentials',
});

const mentorConnection = mongoose.createConnection(process.env.MONGO_URI_MENTOR, {
  dbName: 'mentor',
});

generalConnection.on('connected', () => {
  console.log('✅ Mongoose connected to mentee DB');
});
mentorConnection.on('connected', () => {
  console.log('✅ Mongoose connected to mentor DB');
});

generalConnection.on('error', (err) => {
  console.error('❌ Mentee DB connection error:', err);
});
mentorConnection.on('error', (err) => {
  console.error('❌ Mentor DB connection error:', err);
});

module.exports = { generalConnection, mentorConnection };
