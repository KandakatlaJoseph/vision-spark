const pool = require('../../config/db');

async function getVisionSparkContext() {
  try {
    const [cRes, sRes, pRes] = await Promise.all([
      pool.query(`SELECT title, price, duration, level FROM courses WHERE is_active = 1 ORDER BY sort_order ASC`),
      pool.query(`SELECT title, description FROM services WHERE is_active = 1 ORDER BY sort_order ASC`),
      pool.query(`SELECT title FROM projects WHERE is_active = 1 ORDER BY sort_order ASC`)
    ]);

    const courses = cRes.rows || [];
    const services = sRes.rows || [];
    const projects = pRes.rows || [];

    const courseList = courses.map(c => `- ${c.title} (${c.duration}, ₹${c.price}, ${c.level})`).join('\n');
    const serviceList = services.map(s => `- ${s.title}: ${s.description}`).join('\n');
    const projectList = projects.map(p => `- ${p.title}`).join('\n');

    return {
      courses: courseList,
      services: serviceList,
      projects: projectList
    };
  } catch (err) {
    console.error('Error fetching context:', err);
    return { courses: '', services: '', projects: '' };
  }
}

module.exports = {
  getVisionSparkContext
};
