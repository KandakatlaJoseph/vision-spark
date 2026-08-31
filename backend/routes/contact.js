const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/contact - anyone can submit
router.post(
  '/',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('message').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, phone, subject, message } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, phone, subject, message)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name, email, phone || null, subject || null, message]
      );
      res.status(201).json({ message: 'Thank you! We will get back to you soon.', data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error submitting message' });
    }
  }
);

// GET /api/contact - admin: view all messages
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
