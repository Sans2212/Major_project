// server/routes/mentorRoutes.js
const express = require('express');
const multer = require('multer');
const Mentor = require('../models/MentorModel');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// In-memory storage (you can switch to diskStorage if you prefer)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/apply',
  upload.single('profilePhoto'),
  async (req, res) => {
    try {
      console.log('Received mentor application:', req.body); // Log the form data
      console.log('File received:', req.file); // Log the uploaded file

      // Build the document. req.body has text fields, req.file.buffer is the image.
      const doc = {
        ...req.body,
        profilePhoto: req.file ? req.file.buffer : null, // If file exists, add it to the document
      };

      const mentor = new Mentor(doc);

      // Validate before saving
      const validationError = mentor.validateSync();
      if (validationError) {
        console.error('Validation failed:', validationError);
        return res.status(400).json({ error: validationError.message });
      }

      // Save the mentor document if validation passes
      await mentor.save();
      return res.status(201).json({ message: 'Mentor application submitted!' });

    } catch (err) {
      console.error('Mentor submission failed:', err); // Ensure this prints the actual error
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
