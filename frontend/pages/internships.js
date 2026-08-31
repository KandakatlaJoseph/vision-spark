import { useState } from 'react';
import { COMPANY_INFO, COURSES } from '../lib/coursesData';

export default function Internships() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    qualification: '',
    graduation_year: '',
    technology: 'Full Stack Development (MERN)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const res = await fetch(`${API_URL}/enquiries/internship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application.');

      setSuccessMsg('Thank you for contacting Vision Spark Solutions. Our team will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        qualification: '',
        graduation_year: '',
        technology: 'Full Stack Development (MERN)',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">CAREER ACCELERATION</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Industry Internship Programs
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Project-based internships designed to provide real-world technology experience, mentorship, and career readiness.
          </p>
        </div>
      </section>

      {/* Internship Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-vsOrange/10 text-vsOrange text-xl flex items-center justify-center mb-4">
            💻
          </div>
          <h3 className="text-base font-bold text-[#01155C] mb-1 font-display">Project-Based Learning</h3>
          <p className="text-xs text-slate-600">Work on live production application modules under senior guidance.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-vsBlue/10 text-vsBlue text-xl flex items-center justify-center mb-4">
            👨‍🏫
          </div>
          <h3 className="text-base font-bold text-[#01155C] mb-1 font-display">Dedicated Mentor</h3>
          <p className="text-xs text-slate-600">1-on-1 mentorship for code reviews, architectural guidance, and debugging.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-vsOrange/10 text-vsOrange text-xl flex items-center justify-center mb-4">
            📜
          </div>
          <h3 className="text-base font-bold text-[#01155C] mb-1 font-display">Internship Certificate</h3>
          <p className="text-xs text-slate-600">Earn an official, verified Internship Certificate from Vision Spark Solutions.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-vsBlue/10 text-vsBlue text-xl flex items-center justify-center mb-4">
            🚀
          </div>
          <h3 className="text-base font-bold text-[#01155C] mb-1 font-display">Career Guidance</h3>
          <p className="text-xs text-slate-600">Resume review, LinkedIn optimization, and placement preparation assistance.</p>
        </div>
      </section>

      {/* Internship Application Form */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-extrabold text-[#01155C] text-center mb-2 font-display">Apply for Technology Internship</h2>
            <p className="text-xs text-slate-600 text-center mb-8">
              Fill out your details to apply. Our internship coordinator will contact you shortly.
            </p>

            {successMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl flex items-center justify-center mx-auto">✓</div>
                <p className="text-emerald-800 font-bold text-sm">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{errorMsg}</div>}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">College / Organization</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="College Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="B.Tech, BCA, MCA, BSC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      name="graduation_year"
                      value={formData.graduation_year}
                      onChange={handleChange}
                      placeholder="e.g. 2025, 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Internship Technology Track *</label>
                  <select
                    name="technology"
                    value={formData.technology}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  >
                    <option value="Python Development">Python Development</option>
                    <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
                    <option value="Full Stack Development (MERN)">Full Stack Development (MERN)</option>
                    <option value="Data Science & Analytics">Data Science &amp; Analytics</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence &amp; ML</option>
                    <option value="Generative AI & LLMs">Generative AI &amp; LLMs</option>
                    <option value="Cloud & DevOps Engineering">Cloud &amp; DevOps Engineering</option>
                    <option value="Cyber Security & Ethical Hacking">Cyber Security &amp; Ethical Hacking</option>
                    <option value="Database Engineering">Database Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Project Interests</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your goals or past projects..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-vsOrange text-white font-extrabold text-sm shadow-md shadow-vsOrange/20 hover:bg-orange-600 transition-all"
                >
                  {loading ? 'Submitting Application...' : 'Submit Internship Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

