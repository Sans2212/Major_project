// server/routes/mentorRoutes.js
const express = require('express');
const multer  = require('multer');
const Mentor = require('../models/mentorModel'); // ← your Mentor Mongoose model
const router  = express.Router();
const cloudinary = require('cloudinary').v2;


// In‑memory storage (you can switch to diskStorage if you prefer)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/apply',
  upload.single('profilePhoto'),
  async (req, res) => {
    try {
      console.log('Received mentor application:', req.body, 'file:', !!req.file);

      // Build the document. req.body has text fields, req.file.buffer is the image.
      const doc = {
        ...req.body,
        profilePhoto: req.file ? req.file.buffer : null
      };

      const mentor = new Mentor(doc);
      await mentor.save();
      return res.status(201).json({ message: 'Mentor application submitted!' });

    } catch (err) {
      console.error('Mentor submission failed:', err);
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
