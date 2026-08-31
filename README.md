# Vision Spark Solutions India Pvt Ltd — Platform

An enterprise-grade, dynamic platform built for an EdTech and Software Training startup.

**Technology Stack:**
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Node.js, Express.js REST API
- **Database:** SQLite (auto-configured & zero-setup — no external DB required)
- **AI Integration:** Google Gemini & OpenRouter (Context-injected RAG Counselor)

---

## How to Run the Project (Local Development)

This project has two parts that need to run simultaneously: the **Backend API** and the **Frontend Website**. Open **two separate terminal windows**.

### Step 1: Start the Backend Server (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

*You should see: `Vision Spark API running on port 5000` and SQLite DB connected. Leave this terminal open.*

### Step 2: Start the Frontend Website (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

*You should see: `ready - started server on http://localhost:3000`. Leave this terminal open.*

### Step 3: View the Website

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

The backend auto-creates the SQLite database on first run and seeds it with 10 master courses and an admin user.

---

## AI Chatbot Setup (Optional)

The built-in AI counselor chatbot works without any API keys (falls back to smart rule-based responses). To enable full AI responses:

1. Copy `frontend/.env.local.example` to `frontend/.env.local`
2. Add your API key(s):
   - **Google Gemini** (FREE, 1500 req/day): Get key at [aistudio.google.com](https://aistudio.google.com/app/apikey)
   - **OpenRouter** (FREE tier): Get key at [openrouter.ai](https://openrouter.ai)
3. Restart the frontend dev server.

---

## Managing Content (Admin Panel)

1. Go to **http://localhost:3000/admin**
2. Login with: `admin@visionspark.in` / `Admin@123`
3. Use the **Courses**, **Services**, and **Projects** tabs to:
   - **Add New**: Create items that instantly appear on the public site.
   - **Edit**: Update prices, descriptions, and syllabus structures.
   - **Reorder**: Use ▲ / ▼ arrows to arrange items. Click **Save Order** when done.
4. Use **Enquiries**, **Enrollments**, and **Contact Messages** tabs to manage leads.

---

## Project Structure

```
vision-spark/
├── backend/                   # Express.js REST API
│   ├── config/db.js           # SQLite auto-setup, seeding, and PG fallback
│   ├── middleware/auth.js     # JWT auth middleware (requireAuth, requireAdmin)
│   ├── routes/                # API route handlers
│   │   ├── auth.js            # /api/auth — register, login, /me
│   │   ├── courses.js         # /api/courses — CRUD + reorder
│   │   ├── enrollments.js     # /api/enrollments — user & guest enrollments
│   │   ├── enquiries.js       # /api/enquiries — course, demo, internship, campus
│   │   ├── services.js        # /api/services — CRUD + reorder
│   │   ├── projects.js        # /api/projects — CRUD + reorder
│   │   ├── blog.js            # /api/blog — CRUD
│   │   └── contact.js         # /api/contact — messages
│   └── server.js              # Express app entry point
├── database/
│   └── schema.sql             # Full SQLite schema reference (12 tables)
└── frontend/                  # Next.js 14 app
    ├── components/            # Reusable UI components
    ├── lib/                   # Shared utilities (api.js, auth.js, coursesData.js)
    ├── pages/                 # Next.js file-system routes
    └── styles/globals.css     # Global styles + design tokens
```

---

## Troubleshooting

- **"Port is in use"**: Run `npx kill-port 5000` or `npx kill-port 3000`, then restart.
- **Blank page after compiling**: Refresh the browser — this is a known Next.js dev HMR quirk.
- **Admin login fails**: Delete `backend/vision_spark.sqlite` and restart the backend to re-seed.

---

*Built for Vision Spark Solutions India Pvt. Ltd.*
