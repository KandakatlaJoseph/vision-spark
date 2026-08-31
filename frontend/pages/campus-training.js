import { useState } from 'react';

export default function CampusTraining() {
  const [formData, setFormData] = useState({
    college_name: '',
    contact_person: '',
    designation: '',
    phone: '',
    email: '',
    num_students: '',
    required_training: 'Full Stack Development Workshop',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    { title: 'Technical Workshops', desc: 'Hands-on intensive technology workshops tailored for engineering and computer science students.' },
    { title: 'AI & Machine Learning Workshops', desc: 'Practical machine learning, neural networks, and generative AI code labs.' },
    { title: 'Python Bootcamps', desc: 'Core Python, Data Structures, OOPs, and problem-solving training modules.' },
    { title: 'Full Stack Web Development', desc: 'End-to-end MERN stack web app building workshops.' },
    { title: 'Cyber Security Workshops', desc: 'Ethical hacking, OWASP Top 10 vulnerabilities, and network security awareness.' },
    { title: 'Generative AI Workshops', desc: 'Prompt engineering, LLMs, LangChain, and RAG architecture for colleges.' },
    { title: 'CRT & Placement Training', desc: 'Aptitude, logical reasoning, verbal ability, coding rounds, and mock interviews.' },
    { title: 'Hackathons & Coding Competitions', desc: 'Organizing and mentoring college-wide technology hackathons.' },
    { title: 'Final Year Project Guidance', desc: 'End-to-end technical guidance and mentorship for final year degree projects.' },
    { title: 'Faculty Development Programs (FDP)', desc: 'Upskilling faculty members in modern AI, Cloud, and Software Engineering frameworks.' },
  ];

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
      const res = await fetch(`${API_URL}/enquiries/campus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry.');

      setSuccessMsg('Thank you for contacting Vision Spark Solutions. Our team will contact you shortly.');
      setFormData({
        college_name: '',
        contact_person: '',
        designation: '',
        phone: '',
        email: '',
        num_students: '',
        required_training: 'Full Stack Development Workshop',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting campus enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">INSTITUTIONAL PARTNERSHIPS</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Campus Training &amp; Workshops
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Empowering colleges and universities with expert technical workshops, placement readiness programs, and hackathons.
          </p>
        </div>
      </section>

      {/* Services Offered Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-[#01155C] font-display">Campus Offerings &amp; Services</h2>
          <p className="text-slate-600 text-xs mt-2">Tailored training solutions for academic institutions across India.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-vsBlue/40 transition-all shadow-sm">
              <div className="text-vsOrange font-extrabold text-sm mb-2 font-display">0{idx + 1}.</div>
              <h3 className="text-base font-bold text-[#01155C] mb-2 font-display">{srv.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner With Vision Spark Solutions Form */}
      <section id="partner-form" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-extrabold text-[#01155C] text-center mb-2 font-display">Partner With Vision Spark Solutions</h2>
            <p className="text-xs text-slate-600 text-center mb-8">
              Submit your college training requirements. Our campus relations director will reach out promptly.
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / University Name *</label>
                  <input
                    type="text"
                    name="college_name"
                    required
                    value={formData.college_name}
                    onChange={handleChange}
                    placeholder="Official Name of College or Institution"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      name="contact_person"
                      required
                      value={formData.contact_person}
                      onChange={handleChange}
                      placeholder="Principal, TPO, HOD, Professor"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Training & Placement Officer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tpo@college.edu.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Approx. Number of Students</label>
                    <input
                      type="text"
                      name="num_students"
                      value={formData.num_students}
                      onChange={handleChange}
                      placeholder="e.g. 100, 250, 500+"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Required Training / Workshop</label>
                    <select
                      name="required_training"
                      value={formData.required_training}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                    >
                      <option value="Technical Workshop">Technical Workshop</option>
                      <option value="AI/ML Workshop">AI &amp; Machine Learning Workshop</option>
                      <option value="Python Training">Python Bootcamps</option>
                      <option value="Full Stack Training">Full Stack Development</option>
                      <option value="Cyber Security Workshop">Cyber Security Workshop</option>
                      <option value="Generative AI Workshop">Generative AI Workshop</option>
                      <option value="CRT & Placement Training">CRT &amp; Placement Training</option>
                      <option value="Hackathon Organization">Hackathon Organization</option>
                      <option value="Faculty Development Program">Faculty Development Program</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Requirements / Schedule Details</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Preferred dates, venue details, or custom curriculum requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-vsOrange text-white font-extrabold text-sm shadow-md shadow-vsOrange/20 hover:bg-orange-600 transition-all"
                >
                  {loading ? 'Submitting Proposal...' : 'Submit Institutional Campus Proposal'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

