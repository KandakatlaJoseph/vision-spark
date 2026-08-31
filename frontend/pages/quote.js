import { useState } from 'react';
import Head from 'next/head';

export default function Quote() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Custom Web Application',
    budget: 'Not Sure',
    description: '',
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

    // Construct the payload to match the backend contact schema
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: `Project Quote: ${formData.projectType}`,
      message: `Budget: ${formData.budget}\n\nProject Details:\n${formData.description}`,
    };

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote request.');

      setSuccessMsg('Thank you for requesting a project quote! Our development team will review your requirements and get back to you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: 'Custom Web Application',
        budget: 'Not Sure',
        description: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting quote request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Head>
        <title>Request a Project Quote | Vision Spark Solutions</title>
      </Head>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2 block">CLIENT SERVICES</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 mb-4 font-display">
            Request a Project Quote
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Tell us a little bit about your project requirements, and we will get back to you with a personalized technical proposal and cost estimate.
          </p>
        </div>
      </section>

      <section className="py-16 flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          
          {successMsg ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto">✓</div>
              <h3 className="text-xl font-bold text-emerald-900">Quote Request Sent</h3>
              <p className="text-emerald-800 text-sm max-w-md mx-auto leading-relaxed">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{errorMsg}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Project Type *</label>
                  <select
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors shadow-sm"
                  >
                    <option value="Custom Web Application">Custom Web Application</option>
                    <option value="E-Commerce Platform">E-Commerce Platform</option>
                    <option value="Billing / ERP Software">Billing / ERP Software</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Corporate Website">Corporate Website</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Estimated Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors shadow-sm"
                  >
                    <option value="Not Sure">Not Sure Yet</option>
                    <option value="Under ₹50,000">Under ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
                    <option value="Over ₹5,00,000">Over ₹5,00,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Project Description *</label>
                <textarea
                  name="description"
                  required
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe your project, timeline, and any specific requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold text-sm shadow-xl shadow-amber-500/30 hover:brightness-110 transition-all"
              >
                {loading ? 'Submitting Request...' : 'Submit Request for Quote'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
