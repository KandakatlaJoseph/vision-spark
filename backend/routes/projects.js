const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC');
    const projects = result.rows.map(p => ({
      ...p,
      technologies: p.technologies ? JSON.parse(p.technologies) : []
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
    const projects = result.rows.map(p => ({
      ...p,
      technologies: p.technologies ? JSON.parse(p.technologies) : []
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, image_url, technologies, github_url, live_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, image_url, technologies, github_url, live_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, image_url, JSON.stringify(technologies || []), github_url, live_url]
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
      await pool.query('UPDATE projects SET sort_order = $1 WHERE id = $2', [u.sort_order, u.id]);
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, image_url, technologies, github_url, live_url, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET title=$1, description=$2, image_url=$3, technologies=$4, github_url=$5, live_url=$6, is_active=$7 WHERE id=$8 RETURNING *`,
      [title, description, image_url, JSON.stringify(technologies || []), github_url, live_url, is_active, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
