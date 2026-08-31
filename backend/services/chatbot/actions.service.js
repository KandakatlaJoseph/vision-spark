const pool = require('../../config/db');

async function enrollStudent(args) {
  const { name, phone, course_name } = args;
  
  if (!name || !phone || !course_name) {
    return { success: false, message: "Missing required fields: name, phone, or course_name" };
  }

  try {
    const courseRes = await pool.query(
      `SELECT id, title FROM courses WHERE title LIKE '%' || ? || '%' LIMIT 1`,
      [course_name]
    );

    let courseId = null;
    let actualCourseName = course_name;

    if (courseRes.rows && courseRes.rows.length > 0) {
      courseId = courseRes.rows[0].id;
      actualCourseName = courseRes.rows[0].title;
    }

    // Insert enrollment record into course_enquiries
    await pool.query(
      `INSERT INTO course_enquiries (name, mobile, email, course, message, status) VALUES (?, ?, ?, ?, ?, 'New')`,
      [name, phone, 'chatbot@vision-spark.in', actualCourseName, 'Enrolled via AI Chatbot']
    );

    return { 
      success: true, 
      message: `Successfully created enrollment request for ${name} in ${actualCourseName}. Our team will contact them shortly at ${phone}.`
    };
  } catch (err) {
    console.error('Error in enrollStudent:', err);
    return { success: false, message: `Database error during enrollment: ${err.message}` };
  }
}

async function bookService(args) {
  const { name, phone, service_name } = args;
  
  if (!name || !phone || !service_name) {
    return { success: false, message: "Missing required fields: name, phone, or service_name" };
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, phone, subject, message, status) VALUES (?, ?, ?, ?, 'New')`,
      [name, phone, `Service Booking: ${service_name}`, `Automated AI booking for ${service_name} service.`]
    );

    return { 
      success: true, 
      message: `Successfully booked a demo for ${service_name} for ${name}. Our team will contact them at ${phone}.`
    };
  } catch (err) {
    console.error('Error in bookService:', err);
    return { success: false, message: `Database error during booking: ${err.message}` };
  }
}

module.exports = {
  enrollStudent,
  bookService
};
