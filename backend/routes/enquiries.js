const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ----------------------------------------------------
// 1. COURSE ENQUIRIES
// ----------------------------------------------------
// POST /api/enquiries/course
router.post('/course', async (req, res) => {
  const { name, mobile, email, course, preferred_mode, message } = req.body;
  if (!name || !mobile || !email || !course) {
    return res.status(400).json({ error: 'Name, mobile, email, and course are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO course_enquiries (name, mobile, email, course, preferred_mode, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'New') RETURNING *`,
      [name, mobile, email, course, preferred_mode || 'Online', message || '']
    );
    res.status(201).json({
      message: 'Thank you for contacting Vision Spark Solutions. Our team will contact you shortly.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error saving course enquiry:', err);
    res.status(500).json({ error: 'Server error submitting course enquiry.' });
  }
});

// GET /api/enquiries/course - Admin
router.get('/course', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM course_enquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching course enquiries.' });
  }
});

// PUT /api/enquiries/course/:id/status - Admin
router.put('/course/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE course_enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

// ----------------------------------------------------
// 2. DEMO CLASS REQUESTS
// ----------------------------------------------------
// POST /api/enquiries/demo
router.post('/demo', async (req, res) => {
  const { name, phone, email, course, preferred_date, preferred_time, mode, message } = req.body;
  if (!name || !phone || !email || !course) {
    return res.status(400).json({ error: 'Name, phone, email, and course are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO demo_requests (name, phone, email, course, preferred_date, preferred_time, mode, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'New') RETURNING *`,
      [
        name,
        phone,
        email,
        course,
        preferred_date || null,
        preferred_time || null,
        mode || 'Online',
        message || '',
      ]
    );
    res.status(201).json({
      message: 'Thank you for requesting a demo class! Our team will contact you shortly.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error saving demo request:', err);
    res.status(500).json({ error: 'Server error submitting demo request.' });
  }
});

// GET /api/enquiries/demo - Admin
router.get('/demo', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM demo_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching demo requests.' });
  }
});

// PUT /api/enquiries/demo/:id/status - Admin
router.put('/demo/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE demo_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

// ----------------------------------------------------
// 3. INTERNSHIP APPLICATIONS
// ----------------------------------------------------
// POST /api/enquiries/internship
router.post('/internship', async (req, res) => {
  const { name, email, phone, college, qualification, graduation_year, technology, message } = req.body;
  if (!name || !email || !phone || !technology) {
    return res.status(400).json({ error: 'Name, email, phone, and internship technology are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO internship_applications (name, email, phone, college, qualification, graduation_year, technology, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'New') RETURNING *`,
      [
        name,
        email,
        phone,
        college || '',
        qualification || '',
        graduation_year || '',
        technology,
        message || '',
      ]
    );
    res.status(201).json({
      message: 'Thank you for applying for an internship! Our team will contact you shortly.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error saving internship application:', err);
    res.status(500).json({ error: 'Server error submitting internship application.' });
  }
});

// GET /api/enquiries/internship - Admin
router.get('/internship', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM internship_applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching internship applications.' });
  }
});

// PUT /api/enquiries/internship/:id/status - Admin
router.put('/internship/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE internship_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

// ----------------------------------------------------
// 4. CAMPUS / COLLEGE ENQUIRIES
// ----------------------------------------------------
// POST /api/enquiries/campus
router.post('/campus', async (req, res) => {
  const { college_name, contact_person, designation, phone, email, num_students, required_training, message } = req.body;
  if (!college_name || !contact_person || !phone || !email) {
    return res.status(400).json({ error: 'College name, contact person, phone, and email are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO campus_enquiries (college_name, contact_person, designation, phone, email, num_students, required_training, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'New') RETURNING *`,
      [
        college_name,
        contact_person,
        designation || '',
        phone,
        email,
        num_students || '',
        required_training || '',
        message || '',
      ]
    );
    res.status(201).json({
      message: 'Thank you for partnering with Vision Spark Solutions! Our campus team will get in touch shortly.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error saving campus enquiry:', err);
    res.status(500).json({ error: 'Server error submitting campus enquiry.' });
  }
});

// GET /api/enquiries/campus - Admin
router.get('/campus', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campus_enquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching campus enquiries.' });
  }
});

// PUT /api/enquiries/campus/:id/status - Admin
router.put('/campus/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE campus_enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

// ----------------------------------------------------
// 5. UPDATE ANY ENQUIRY (Admin)
// ----------------------------------------------------
router.put('/:table/:id', requireAuth, requireAdmin, async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['course_enquiries', 'demo_requests', 'internship_applications', 'campus_enquiries', 'contact_messages'];
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table specified.' });
  }

  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields provided for update.' });
  }

  // Build the SET clause dynamically
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    // Only allow updating actual columns (we might want to restrict this list in a real app, but this works for now)
    // Common fields: name, email, phone, message, status, course, etc.
    if (key !== 'id' && key !== 'created_at') {
      setClauses.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  values.push(id); // For the WHERE clause

  try {
    const query = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({ error: 'Server error updating record.' });
  }
});

// ----------------------------------------------------
// 6. DELETE ANY ENQUIRY (Admin)
// ----------------------------------------------------
router.delete('/:table/:id', requireAuth, requireAdmin, async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['course_enquiries', 'demo_requests', 'internship_applications', 'campus_enquiries', 'contact_messages'];
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table specified.' });
  }

  try {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    res.json({ message: 'Record deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting record.' });
  }
});

module.exports = router;
