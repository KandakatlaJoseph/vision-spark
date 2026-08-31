-- ============================================================
-- Vision Spark Solutions India Pvt Ltd
-- Database Schema (SQLite — matches config/db.js auto-setup)
-- ============================================================
-- This schema documents the actual SQLite tables used by the app.
-- The backend (config/db.js) creates all these tables automatically
-- on first startup using CREATE TABLE IF NOT EXISTS.
-- ============================================================

-- 1. Users (students & admins)
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    password_hash TEXT  NOT NULL,
    phone       TEXT,
    city        TEXT,
    college     TEXT,
    qualification TEXT,
    graduation_year TEXT,
    interested_course TEXT,
    role        TEXT    NOT NULL DEFAULT 'student', -- 'student' | 'admin'
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses (main content managed from Admin Panel)
CREATE TABLE IF NOT EXISTS courses (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT    NOT NULL,
    slug             TEXT    UNIQUE NOT NULL,
    category         TEXT,
    description      TEXT,
    short_description TEXT,
    duration         TEXT,
    price            REAL    DEFAULT 0,
    image_url        TEXT,
    level            TEXT,
    rating           REAL    DEFAULT 5.0,
    studentsEnrolled INTEGER DEFAULT 0,
    technologies     TEXT,   -- JSON array e.g. ["Python","NumPy"]
    learnings        TEXT,   -- JSON array of learning outcomes
    career_opportunities TEXT, -- JSON array of job roles
    modules          TEXT,   -- JSON array of {title, topics[]}
    is_active        INTEGER DEFAULT 1,  -- 1 = visible, 0 = hidden
    sort_order       INTEGER DEFAULT 0,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Batches (scheduling per course)
CREATE TABLE IF NOT EXISTS batches (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id    INTEGER,
    start_date   TEXT,
    end_date     TEXT,
    mode         TEXT    DEFAULT 'online', -- 'online' | 'offline' | 'hybrid'
    seats_total  INTEGER DEFAULT 30,
    seats_filled INTEGER DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. Enrollments (for logged-in student users)
CREATE TABLE IF NOT EXISTS enrollments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    course_id   INTEGER,
    batch_id    INTEGER,
    status      TEXT    DEFAULT 'pending', -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4b. Guest Enrollments (direct checkout without login)
CREATE TABLE IF NOT EXISTS guest_enrollments (
    id             TEXT    PRIMARY KEY,   -- e.g. "VS-ENR-123456"
    course_title   TEXT    NOT NULL,
    mode           TEXT    NOT NULL,      -- 'online' | 'offline'
    mode_name      TEXT    NOT NULL,
    amount_paid    TEXT    NOT NULL,      -- stored as formatted string e.g. "₹2,999"
    student_name   TEXT    NOT NULL,
    email          TEXT    NOT NULL,
    phone          TEXT    NOT NULL,
    payment_method TEXT    NOT NULL,      -- 'gpay' | 'card' | 'netbanking' | 'pay_at_center'
    status         TEXT    DEFAULT 'Confirmed',
    date           TEXT    NOT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Course Enquiries (from EnquiryModal — enquiry mode)
CREATE TABLE IF NOT EXISTS course_enquiries (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    mobile         TEXT    NOT NULL,
    email          TEXT    NOT NULL,
    course         TEXT    NOT NULL,
    preferred_mode TEXT    DEFAULT 'Online',
    message        TEXT,
    status         TEXT    DEFAULT 'New',  -- 'New' | 'Contacted' | 'Enrolled' | 'Closed'
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contact Messages (from /contact page)
CREATE TABLE IF NOT EXISTS contact_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    phone      TEXT,
    subject    TEXT,
    message    TEXT    NOT NULL,
    is_read    INTEGER DEFAULT 0,
    status     TEXT    DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Demo Class Requests (from EnquiryModal — demo mode)
CREATE TABLE IF NOT EXISTS demo_requests (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    phone          TEXT    NOT NULL,
    email          TEXT    NOT NULL,
    course         TEXT    NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    mode           TEXT    DEFAULT 'Online',
    message        TEXT,
    status         TEXT    DEFAULT 'New',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Internship Applications (from /internships page)
CREATE TABLE IF NOT EXISTS internship_applications (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    email           TEXT    NOT NULL,
    phone           TEXT    NOT NULL,
    college         TEXT,
    qualification   TEXT,
    graduation_year TEXT,
    technology      TEXT    NOT NULL,
    message         TEXT,
    status          TEXT    DEFAULT 'New',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Campus Training Enquiries (from /campus-training page)
CREATE TABLE IF NOT EXISTS campus_enquiries (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    college_name     TEXT    NOT NULL,
    contact_person   TEXT    NOT NULL,
    designation      TEXT,
    phone            TEXT    NOT NULL,
    email            TEXT    NOT NULL,
    num_students     TEXT,
    required_training TEXT,
    message          TEXT,
    status           TEXT    DEFAULT 'New',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Blog Posts (manageable from Admin Panel)
CREATE TABLE IF NOT EXISTS blog_posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    slug         TEXT    UNIQUE NOT NULL,
    content      TEXT    NOT NULL,
    excerpt      TEXT,
    author_id    INTEGER,
    image_url    TEXT,
    published    INTEGER DEFAULT 1,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 11. Services (managed from Admin Panel)
CREATE TABLE IF NOT EXISTS services (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    description  TEXT,
    icon         TEXT,
    image_url    TEXT,
    technologies TEXT,   -- JSON array
    is_active    INTEGER DEFAULT 1,
    sort_order   INTEGER DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Projects (managed from Admin Panel)
CREATE TABLE IF NOT EXISTS projects (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    description  TEXT,
    image_url    TEXT,
    technologies TEXT,   -- JSON array
    github_url   TEXT,
    live_url     TEXT,
    is_active    INTEGER DEFAULT 1,
    sort_order   INTEGER DEFAULT 0,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_courses_slug   ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_blog_slug      ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_order  ON courses(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(sort_order);

-- ============================================================
-- Default seed data is injected automatically by config/db.js
-- on first startup if the courses table is empty:
--   - 10 master courses
--   - Admin user: admin@visionspark.in / Admin@123
-- ============================================================
