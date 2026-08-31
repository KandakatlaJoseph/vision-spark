const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - public list
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM courses WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC'
    );
    // Parse JSON fields
    const courses = result.rows.map(c => ({
      ...c,
      technologies: c.technologies ? JSON.parse(c.technologies) : [],
      learnings: c.learnings ? JSON.parse(c.learnings) : [],
      career_opportunities: c.career_opportunities ? JSON.parse(c.career_opportunities) : [],
      modules: c.modules ? JSON.parse(c.modules) : []
    }));
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/admin/all - admin list
router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM courses ORDER BY sort_order ASC, created_at DESC'
    );
    // Parse JSON fields
    const courses = result.rows.map(c => ({
      ...c,
      technologies: c.technologies ? JSON.parse(c.technologies) : [],
      learnings: c.learnings ? JSON.parse(c.learnings) : [],
      career_opportunities: c.career_opportunities ? JSON.parse(c.career_opportunities) : [],
      modules: c.modules ? JSON.parse(c.modules) : []
    }));
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/:slug - public detail (includes batches)
router.get('/:slug', async (req, res) => {
  try {
    const courseResult = await pool.query('SELECT * FROM courses WHERE slug = $1', [req.params.slug]);
    if (courseResult.rows.length === 0) return res.status(404).json({ error: 'Course not found' });

    let course = courseResult.rows[0];
    course.technologies = course.technologies ? JSON.parse(course.technologies) : [];
    course.learnings = course.learnings ? JSON.parse(course.learnings) : [];
    course.career_opportunities = course.career_opportunities ? JSON.parse(course.career_opportunities) : [];
    course.modules = course.modules ? JSON.parse(course.modules) : [];

    const batches = await pool.query('SELECT * FROM batches WHERE course_id = $1 ORDER BY start_date', [
      course.id,
    ]);

    res.json({ ...course, batches: batches.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/courses - admin create
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { 
    title, slug, category, description, short_description, duration, 
    price, image_url, level, rating, studentsEnrolled, 
    technologies, learnings, career_opportunities, modules 
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO courses (
        title, slug, category, description, short_description, duration, price, 
        image_url, level, rating, studentsEnrolled, technologies, learnings, 
        career_opportunities, modules
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        title, slug, category, description, short_description, duration, price, 
        image_url, level, rating || 5.0, studentsEnrolled || 0,
        JSON.stringify(technologies || []), JSON.stringify(learnings || []), 
        JSON.stringify(career_opportunities || []), JSON.stringify(modules || [])
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating course' });
  }
});

// PUT /api/courses/reorder - admin reorder (MUST be before /:id to avoid shadowing)
router.put('/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { updates } = req.body;
  if (!updates || !Array.isArray(updates)) return res.status(400).json({ error: 'Invalid payload' });
  try {
    for (const u of updates) {
      await pool.query('UPDATE courses SET sort_order = $1 WHERE id = $2', [u.sort_order, u.id]);
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error reordering courses' });
  }
});

// PUT /api/courses/:id - admin update
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { 
    title, slug, category, description, short_description, duration, 
    price, image_url, level, rating, studentsEnrolled, 
    technologies, learnings, career_opportunities, modules, is_active 
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE courses SET 
        title=$1, slug=$2, category=$3, description=$4, short_description=$5, 
        duration=$6, price=$7, image_url=$8, level=$9, rating=$10, 
        studentsEnrolled=$11, technologies=$12, learnings=$13, 
        career_opportunities=$14, modules=$15, is_active=$16 
       WHERE id=$17 RETURNING *`,
      [
        title, slug, category, description, short_description, duration, price, 
        image_url, level, rating, studentsEnrolled, 
        JSON.stringify(technologies || []), JSON.stringify(learnings || []), 
        JSON.stringify(career_opportunities || []), JSON.stringify(modules || []),
        is_active, req.params.id
      ]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating course' });
  }
});

// DELETE /api/courses/:id - admin delete
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id=$1', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting course' });
  }
});

module.exports = router;
