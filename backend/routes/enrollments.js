const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/enrollments - student enrolls in a course
router.post('/', requireAuth, async (req, res) => {
  const { course_id, batch_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO enrollments (user_id, course_id, batch_id, status)
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [req.user.id, course_id, batch_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating enrollment' });
  }
});

// GET /api/enrollments/my - student's own enrollments
router.get('/my', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, c.title AS course_title, c.image_url
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = $1 ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/enrollments - admin: all enrollments
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name AS student_name, u.email, c.title AS course_title
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.enrolled_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/enrollments/:id/status - admin updates status
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE enrollments SET status=$1 WHERE id=$2 RETURNING *', [
      status,
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------------------------------------
// GUEST ENROLLMENTS (Direct Checkout without login)
// ----------------------------------------------------

// POST /api/enrollments/guest
router.post('/guest', async (req, res) => {
  const { id, courseTitle, mode, modeName, amountPaid, studentName, email, phone, paymentMethod, date } = req.body;
  if (!id || !studentName || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO guest_enrollments (id, course_title, mode, mode_name, amount_paid, student_name, email, phone, payment_method, date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Confirmed') RETURNING *`,
      [id, courseTitle, mode, modeName, amountPaid, studentName, email, phone, paymentMethod, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving guest enrollment:', err);
    res.status(500).json({ error: 'Server error saving enrollment' });
  }
});

// GET /api/enrollments/guest - admin: all guest enrollments
router.get('/guest', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM guest_enrollments ORDER BY created_at DESC`
    );
    // map database fields to the structure expected by the frontend
    const mappedRows = result.rows.map(row => ({
      id: row.id,
      courseTitle: row.course_title,
      mode: row.mode,
      modeName: row.mode_name,
      amountPaid: row.amount_paid,
      studentName: row.student_name,
      email: row.email,
      phone: row.phone,
      paymentMethod: row.payment_method,
      date: row.date,
      status: row.status,
      created_at: row.created_at
    }));
    res.json(mappedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/enrollments/guest/:id/status - admin updates status
router.put('/guest/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE guest_enrollments SET status=$1 WHERE id=$2 RETURNING *', [
      status,
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/enrollments/guest/:id - admin updates guest enrollment details
router.put('/guest/:id', requireAuth, requireAdmin, async (req, res) => {
  const { courseTitle, mode, modeName, amountPaid, studentName, email, phone, paymentMethod, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE guest_enrollments 
       SET course_title=$1, mode=$2, mode_name=$3, amount_paid=$4, student_name=$5, email=$6, phone=$7, payment_method=$8, status=$9
       WHERE id=$10 RETURNING *`,
      [courseTitle, mode, modeName, amountPaid, studentName, email, phone, paymentMethod, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating guest enrollment:', err);
    res.status(500).json({ error: 'Server error updating enrollment' });
  }
});

// DELETE /api/enrollments/guest/:id - admin deletes
router.delete('/guest/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM guest_enrollments WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
