const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC');
    const services = result.rows.map(s => ({
      ...s,
      technologies: s.technologies ? JSON.parse(s.technologies) : []
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC');
    const services = result.rows.map(s => ({
      ...s,
      technologies: s.technologies ? JSON.parse(s.technologies) : []
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, icon, image_url, technologies } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO services (title, description, icon, image_url, technologies) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, description, icon, image_url, JSON.stringify(technologies || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /reorder (MUST be before /:id to avoid Express shadowing)
router.put('/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { updates } = req.body;
  if (!updates || !Array.isArray(updates)) return res.status(400).json({ error: 'Invalid payload' });
  try {
    for (const u of updates) {
      await pool.query('UPDATE services SET sort_order = $1 WHERE id = $2', [u.sort_order, u.id]);
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, icon, image_url, technologies, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE services SET title=$1, description=$2, icon=$3, image_url=$4, technologies=$5, is_active=$6 WHERE id=$7 RETURNING *`,
      [title, description, icon, image_url, JSON.stringify(technologies || []), is_active, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
