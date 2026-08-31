const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/blog - public list
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, slug, excerpt, image_url, published_at FROM blog_posts
       WHERE published = TRUE ORDER BY published_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/blog/:slug - public detail
router.get('/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/blog - admin create
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, slug, content, excerpt, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, content, excerpt, image_url, author_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, slug, content, excerpt, image_url, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating post' });
  }
});

module.exports = router;
