import { useState } from 'react';
import { COMPANY_INFO } from '../lib/coursesData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit message.');

      setSuccessMsg('Thank you for contacting Vision Spark Solutions. Our team will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">GET IN TOUCH</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Contact Vision Spark Solutions
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Have questions about technology courses, internships, or campus partnerships? Speak with our team.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1 w-full">
        
        {/* Contact Info & Map */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold text-vsOrange tracking-wider uppercase font-display">OFFICIAL DETAILS</span>
            <h2 className="text-2xl font-extrabold text-[#01155C] mt-1 mb-4 font-display">
              Vision Spark Solutions India Pvt. Limited
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Our support helpline and counselors are available to answer your course and placement queries.
            </p>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vsOrange/10 text-vsOrange text-xl flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-semibold uppercase">Official Phone Number</span>
                    <span className="text-[#01155C] font-extrabold text-base">{COMPANY_INFO.phone}</span>
                  </div>
                </div>
                <a
                  href={`tel:${COMPANY_INFO.phoneClean}`}
                  className="px-4 py-2 rounded-xl bg-vsOrange text-white font-bold text-xs hover:bg-orange-600 shadow-xs"
                >
                  Call Now
                </a>
              </div>

              {/* WhatsApp Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 text-xl flex items-center justify-center border border-emerald-100">
                    💬
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-semibold uppercase">WhatsApp Chat</span>
                    <span className="text-emerald-700 font-bold text-sm">{COMPANY_INFO.phone}</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${COMPANY_INFO.whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-xs"
                >
                  WhatsApp Us
                </a>
              </div>

              {/* Location Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vsBlue/10 text-vsBlue text-xl flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-semibold uppercase">Official Address</span>
                    <p className="text-[#01155C] font-bold text-xs">{COMPANY_INFO.address}</p>
                    <a
                      href={COMPANY_INFO.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-vsOrange font-bold text-xs hover:underline inline-block mt-1"
                    >
                      Open Google Maps Directions ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 text-xl flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-semibold uppercase">Working Hours</span>
                    <p className="text-[#01155C] font-bold text-xs">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p className="text-slate-500 text-[11px]">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Location Destination */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white h-72 relative shadow-lg group">
            <a
              href={COMPANY_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 z-10 px-3.5 py-2 bg-white text-vsBlue font-bold text-xs rounded-xl shadow-md hover:bg-slate-50 transition-all flex items-center gap-1.5 border border-slate-200"
            >
              <span>Open in Maps</span>
              <span className="text-vsBlue font-normal">↗</span>
            </a>
            <iframe
              title="Vision Spark Solutions Location"
              src="https://maps.google.com/maps?q=N%20M%20K%20D%20Complex%20Chirala%20Jandrapeta&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl h-fit">
          <h3 className="text-xl font-extrabold text-[#01155C] mb-2 font-display">Send Us a Direct Message</h3>
          <p className="text-xs text-slate-600 mb-6">Fill out the form below and our team will get back to you shortly.</p>

          {successMsg ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl flex items-center justify-center mx-auto">✓</div>
              <p className="text-emerald-800 font-bold text-sm">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
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
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Course Enquiry / Internship Inquiry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your query or message here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-vsOrange focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-vsOrange text-white font-extrabold text-sm shadow-md shadow-vsOrange/20 hover:bg-orange-600 transition-all"
              >
                {loading ? 'Submitting Message...' : 'Submit Message'}
              </button>
            </form>
          )}
        </div>

      </section>
    </div>
  );
}

