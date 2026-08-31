const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let useSqlite = false;
let sqliteDb = null;
let pgPool = null;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 1500,
  });
}

function initSqlite() {
  const dbPath = path.join(__dirname, '..', 'vision_spark.sqlite');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // 1. Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone TEXT,
        city TEXT,
        college TEXT,
        qualification TEXT,
        graduation_year TEXT,
        interested_course TEXT,
        role TEXT NOT NULL DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Courses table
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT,
        description TEXT,
        short_description TEXT,
        duration TEXT,
        price REAL DEFAULT 0,
        image_url TEXT,
        level TEXT DEFAULT 'Beginner to Advanced',
        rating REAL DEFAULT 4.9,
        studentsEnrolled INTEGER DEFAULT 0,
        technologies TEXT,
        learnings TEXT,
        career_opportunities TEXT,
        modules TEXT,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Batches
    db.run(`
      CREATE TABLE IF NOT EXISTS batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        mode TEXT DEFAULT 'online',
        seats_total INTEGER DEFAULT 30,
        seats_filled INTEGER DEFAULT 0,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // 4. Enrollments (For logged in users)
    db.run(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_id INTEGER,
        batch_id INTEGER,
        status TEXT DEFAULT 'pending',
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // 4b. Guest Enrollments
    db.run(`
      CREATE TABLE IF NOT EXISTS guest_enrollments (
        id TEXT PRIMARY KEY,
        course_title TEXT NOT NULL,
        mode TEXT NOT NULL,
        mode_name TEXT NOT NULL,
        amount_paid TEXT NOT NULL,
        student_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Course Enquiries
    db.run(`
      CREATE TABLE IF NOT EXISTS course_enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT NOT NULL,
        course TEXT NOT NULL,
        preferred_mode TEXT DEFAULT 'Online',
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Contact Messages
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Demo Class Requests
    db.run(`
      CREATE TABLE IF NOT EXISTS demo_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        course TEXT NOT NULL,
        preferred_date TEXT,
        preferred_time TEXT,
        mode TEXT DEFAULT 'Online',
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Internship Applications
    db.run(`
      CREATE TABLE IF NOT EXISTS internship_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        college TEXT,
        qualification TEXT,
        graduation_year TEXT,
        technology TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Campus Enquiries
    db.run(`
      CREATE TABLE IF NOT EXISTS campus_enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        college_name TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        designation TEXT,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        num_students TEXT,
        required_training TEXT,
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 10. Blog Posts
    db.run(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author_id INTEGER,
        image_url TEXT,
        published INTEGER DEFAULT 1,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);

    // 11. Services
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        image_url TEXT,
        technologies TEXT,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 12. Projects
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        technologies TEXT,
        github_url TEXT,
        live_url TEXT,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 13. Conversations (Chatbot Memory)
    db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 14. Messages (Chatbot Memory)
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
      )
    `);

    // Initial Seed Check
    db.get('SELECT COUNT(*) as count FROM courses', async (err, row) => {
      if (err) return;
      if (!row || row.count === 0) {
        console.log('[SQLite DB] Seeding 10 Master Courses, Services, Projects & Admin User...');

        // --- Seed Courses ---
        const insertCourse = db.prepare(`
          INSERT INTO courses (title, slug, category, description, short_description, duration, price, image_url, level, rating, technologies)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insertCourse.run('Python Programming', 'python-programming', 'Software Development', 'Master Python fundamentals, OOPs, data structures, file handling, and projects.', 'From basics to advanced Python — the most in-demand language for AI, Data Science & web backends.', '2 Months', 14999, 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80', 'Beginner to Advanced', 4.9, JSON.stringify(['Python', 'OOP', 'File I/O', 'NumPy', 'Flask']));
        insertCourse.run('Data Structures & Algorithms', 'data-structures-and-algorithms', 'Computer Science & Placement', 'Master Time & Space complexity, Trees, Graphs, Greedy, DP & LeetCode problem solving.', 'Crack top product company interviews with solid DSA fundamentals and competitive problem solving.', '2.5 Months', 19999, 'https://images.unsplash.com/photo-1516116211223-4c714242e600?auto=format&fit=crop&w=800&q=80', 'Intermediate', 4.9, JSON.stringify(['Arrays', 'Trees', 'Graphs', 'DP', 'LeetCode']));
        insertCourse.run('Full Stack Web Development (MERN)', 'full-stack-web-development-mern', 'Web Development', 'Build web apps with HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, & MongoDB.', 'Become a full-stack developer — build complete, production-grade web applications end-to-end.', '3 Months', 24999, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'Beginner to Advanced', 4.9, JSON.stringify(['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript']));
        insertCourse.run('Data Science', 'data-science', 'Data Science', 'Transform data with Python, Pandas, NumPy, Matplotlib, Seaborn, Statistics & Machine Learning.', 'Analyze real datasets and build predictive models using industry-standard Python data science tools.', '3 Months', 27999, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 'Intermediate', 4.9, JSON.stringify(['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn']));
        insertCourse.run('Artificial Intelligence & Machine Learning', 'ai-and-machine-learning', 'AI & Data Science', 'Deep Learning, Neural Networks, TensorFlow, Keras, PyTorch, Computer Vision & NLP.', 'Master AI/ML from theory to deployment — neural networks, CV, NLP and real-world AI projects.', '3.5 Months', 34999, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', 'Advanced', 5.0, JSON.stringify(['TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'NLP']));
        insertCourse.run('Generative AI', 'generative-ai', 'Artificial Intelligence', 'LLMs, Prompt Engineering, OpenAI/Gemini APIs, LangChain, RAG architecture & AI Agents.', 'Build real-world Gen AI applications using LLMs, RAG pipelines, and AI Agents with modern APIs.', '2 Months', 32999, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Intermediate to Advanced', 5.0, JSON.stringify(['LangChain', 'OpenAI API', 'Gemini API', 'RAG', 'Prompt Engineering']));
        insertCourse.run('Cloud & DevOps', 'cloud-and-devops', 'Cloud Infrastructure', 'Linux, Git, Docker, Kubernetes, CI/CD pipelines with Jenkins & AWS Cloud Services.', 'Deploy, scale and automate applications on AWS using modern DevOps tools and practices.', '2.5 Months', 29999, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 'Intermediate', 4.8, JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Linux']));
        insertCourse.run('Cyber Security', 'cyber-security', 'Security', 'Ethical Hacking, OWASP Top 10, Network Security, Wireshark, Metasploit & Pen Testing.', 'Learn to think like a hacker and defend systems — ethical hacking and penetration testing.', '2 Months', 27999, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', 'Intermediate', 4.8, JSON.stringify(['Wireshark', 'Metasploit', 'Kali Linux', 'OWASP', 'Nmap']));
        insertCourse.run('CRT / Campus Recruitment Training', 'crt-campus-recruitment-training', 'Career & Placement', 'Quantitative Aptitude, Logical Reasoning, Verbal Ability, Coding & Technical/HR Interviews.', 'Get campus placement ready with aptitude, coding rounds, group discussions and mock interviews.', '1.5 Months', 9999, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Beginner', 4.9, JSON.stringify(['Aptitude', 'Reasoning', 'Coding', 'HR Interview', 'Group Discussion']));
        insertCourse.run('Database & Data Storage Technologies', 'database-and-data-storage-technologies', 'Database & Backend', 'SQL, RDBMS, MySQL, PostgreSQL, NoSQL, MongoDB, Redis, Indexing & Cloud DBs.', 'Master both SQL and NoSQL databases — the backbone of every modern application backend.', '2 Months', 16999, 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80', 'Beginner to Intermediate', 4.8, JSON.stringify(['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL']));
        insertCourse.finalize();

        // --- Seed Services ---
        const insertService = db.prepare(`
          INSERT INTO services (title, description, icon, image_url, technologies, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        insertService.run('Custom Web Development', 'We design and build fast, modern, responsive websites and web apps tailored to your brand and business goals — from landing pages to full-scale enterprise portals.', '🌐', 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80', JSON.stringify(['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'MongoDB']), 1);
        insertService.run('Mobile App Development', 'Cross-platform iOS & Android mobile applications built with React Native — beautiful UX, real-time features, and production-ready performance.', '📱', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', JSON.stringify(['React Native', 'Expo', 'Firebase', 'REST APIs']), 2);
        insertService.run('AI & Automation Solutions', 'Integrate cutting-edge AI into your business — chatbots, document automation, data extraction, intelligent dashboards and custom LLM-powered workflows.', '🤖', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Python', 'LangChain', 'OpenAI API', 'Gemini API', 'FastAPI']), 3);
        insertService.run('ERP & Billing Software', 'Custom-built ERP systems, POS, billing, inventory and payroll software for small businesses, hospitals, schools and retail chains across Andhra Pradesh.', '🏭', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Python', 'PostgreSQL', 'React', 'Electron']), 4);
        insertService.run('UI/UX Design', 'Professional, pixel-perfect UI/UX design — wireframes, prototypes and production-ready Figma designs that convert visitors into customers.', '🎨', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Figma', 'Adobe XD', 'Framer', 'Tailwind CSS']), 5);
        insertService.run('Cloud & DevOps Consulting', 'End-to-end cloud infrastructure setup on AWS — CI/CD pipelines, Docker containerization, Kubernetes orchestration and 24/7 monitoring.', '☁️', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']), 6);
        insertService.finalize();

        // --- Seed Projects ---
        const insertProject = db.prepare(`
          INSERT INTO projects (title, description, image_url, technologies, sort_order)
          VALUES (?, ?, ?, ?, ?)
        `);
        insertProject.run('EdTech Learning Platform', 'A full-featured online learning management system with course catalog, video streaming, quizzes, student dashboard, and payment integration — built for Vision Spark.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Next.js', 'Node.js', 'SQLite', 'Tailwind CSS', 'Gemini AI']), 1);
        insertProject.run('Hospital Management System', 'A comprehensive HMS with patient registration, OPD/IPD management, billing, pharmacy, lab reports and doctor dashboards for a multi-specialty clinic.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', JSON.stringify(['React', 'Python', 'FastAPI', 'PostgreSQL', 'Electron']), 2);
        insertProject.run('AI Resume Analyzer', 'An intelligent resume screening tool using LLMs that ranks candidates, extracts skills, and suggests improvements — built for an HR tech startup.', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Python', 'LangChain', 'Gemini API', 'FastAPI', 'React']), 3);
        insertProject.run('E-Commerce Platform', 'A production-grade multi-vendor e-commerce platform with product management, cart, payment gateway (Razorpay), and seller analytics dashboard.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', JSON.stringify(['MERN Stack', 'Razorpay', 'Redux', 'Cloudinary']), 4);
        insertProject.run('Smart Inventory & Billing', 'A desktop + web hybrid billing and inventory management system for a retail chain with 5 branches — real-time stock sync, GST billing and daily reports.', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Python', 'React', 'Electron', 'SQLite', 'PDF generation']), 5);
        insertProject.run('WhatsApp AI Chatbot', 'A context-aware WhatsApp chatbot for a real estate firm — answers property queries, schedules visits, and generates leads using Gemini AI + Twilio API.', 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80', JSON.stringify(['Node.js', 'Twilio', 'Gemini API', 'MongoDB']), 6);
        insertProject.finalize();

        // --- Seed Admin User ---
        const adminHash = await bcrypt.hash('Admin@123', 10);
        db.run(
          `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
          ['Vision Spark Admin', 'admin@visionspark.in', adminHash, 'admin']
        );

        console.log('[SQLite DB] Seeding complete.');
      }
    });
  });

  return db;
}

function convertPgToSqlite(sql) {
  let converted = sql.replace(/\$\d+/g, '?');
  converted = converted.replace(/RETURNING\s+[\w\s,*]+/gi, '');
  converted = converted.replace(/=\s*TRUE/gi, '= 1').replace(/=\s*FALSE/gi, '= 0');
  return converted;
}

const query = async (text, params = []) => {
  if (!useSqlite && pgPool) {
    try {
      const res = await pgPool.query(text, params);
      return res;
    } catch (err) {
      if (['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(err.code) || err.message.includes('connect ECONNREFUSED')) {
        console.warn('[DB] PostgreSQL unavailable. Using SQLite local database.');
        useSqlite = true;
        sqliteDb = initSqlite();
      } else {
        throw err;
      }
    }
  }

  if (useSqlite || !pgPool) {
    if (!sqliteDb) {
      useSqlite = true;
      sqliteDb = initSqlite();
    }

    const sqliteSql = convertPgToSqlite(text);
    const trimmedSql = text.trim().toUpperCase();

    return new Promise((resolve, reject) => {
      if (trimmedSql.startsWith('SELECT')) {
        sqliteDb.all(sqliteSql, params, (err, rows) => {
          if (err) return reject(err);
          const formattedRows = (rows || []).map(r => {
            const copy = { ...r };
            if (copy.is_active !== undefined) copy.is_active = Boolean(copy.is_active);
            if (copy.published !== undefined) copy.published = Boolean(copy.published);
            return copy;
          });
          resolve({ rows: formattedRows });
        });
      } else if (trimmedSql.startsWith('INSERT')) {
        sqliteDb.run(sqliteSql, params, function (err) {
          if (err) return reject(err);
          const lastID = this.lastID;
          if (text.toUpperCase().includes('RETURNING')) {
            const tableMatch = text.match(/INSERT\s+INTO\s+(\w+)/i);
            const tableName = tableMatch ? tableMatch[1] : null;
            if (tableName) {
              sqliteDb.get(`SELECT * FROM ${tableName} WHERE id = ?`, [lastID], (err2, row) => {
                if (err2 || !row) resolve({ rows: [{ id: lastID }] });
                else {
                  if (row.is_active !== undefined) row.is_active = Boolean(row.is_active);
                  resolve({ rows: [row] });
                }
              });
              return;
            }
          }
          resolve({ rows: [{ id: lastID }] });
        });
      } else if (trimmedSql.startsWith('UPDATE') || trimmedSql.startsWith('DELETE')) {
        sqliteDb.run(sqliteSql, params, function (err) {
          if (err) return reject(err);
          const lastIdParam = params.length > 0 ? params[params.length - 1] : null;
          if (text.toUpperCase().includes('RETURNING')) {
            resolve({ rows: [{ id: lastIdParam }] });
            return;
          }
          resolve({ rows: [] });
        });
      } else {
        sqliteDb.run(sqliteSql, params, (err) => {
          if (err) return reject(err);
          resolve({ rows: [] });
        });
      }
    });
  }
};

module.exports = {
  query,
};
