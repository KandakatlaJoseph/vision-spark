import { useState } from 'react';

export default function EnrollmentModal({ isOpen, onClose, course }) {
  if (!isOpen || !course) return null;

  const [selectedMode, setSelectedMode] = useState('online'); // 'online' or 'offline'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'gpay'
  });
  const [submitted, setSubmitted] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState('');

  const pricing = {
    online: { price: '₹2,999', original: '₹5,999', discount: '50% OFF', name: 'Online Live Interactive Batch' },
    offline: { price: '₹9,999', original: '₹19,999', discount: '50% OFF', name: 'Offline On-Campus Classroom (Chirala Center)' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    const id = 'VS-ENR-' + Math.floor(100000 + Math.random() * 900000);
    setEnrollmentId(id);

    const enrollmentRecord = {
      id,
      courseTitle: course.title,
      mode: selectedMode,
      modeName: pricing[selectedMode].name,
      amountPaid: pricing[selectedMode].price,
      studentName: formData.name,
      email: formData.email,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${API_URL}/enrollments/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentRecord),
      });
      // Optionally still store locally for immediate personal history if wanted, but not needed
    } catch (err) {
      console.error('Error saving enrollment to DB', err);
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', paymentMethod: 'gpay' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transition-all">
        
        {/* Modal Header */}
        <div className="bg-[#01155C] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-vsOrange">COURSE ENROLLMENT</span>
            <h3 className="text-lg font-extrabold font-display leading-tight">{course.title}</h3>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          /* Confirmation Receipt View */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
              ✓
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Enrollment Confirmed!</span>
              <h4 className="text-xl font-extrabold text-[#01155C] mt-1 font-display">Welcome to Vision Spark!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your seat has been reserved. Booking ID: <strong className="text-vsOrange font-mono">{enrollmentId}</strong>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Student Name:</span>
                <strong className="text-slate-800">{formData.name}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Training Mode:</span>
                <strong className="text-vsOrange">{pricing[selectedMode].name}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Fee Amount:</span>
                <strong className="text-emerald-600 font-bold text-sm">{pricing[selectedMode].price}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Helpline:</span>
                <strong className="text-slate-800">+91 7815981081</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Our academic coordinator will reach out to you at <strong>{formData.phone}</strong> with batch schedule details.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-vsOrange text-white font-extrabold text-xs shadow-md shadow-vsOrange/20 hover:bg-orange-600 transition-all"
            >
              Done & Return to Courses
            </button>
          </div>
        ) : (
          /* Mode Selection & Student Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Mode Selector Radio Cards */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Training Mode & Price:</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Online Mode Option */}
                <div
                  onClick={() => setSelectedMode('online')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedMode === 'online'
                      ? 'border-vsOrange bg-orange-50/60 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#01155C]">💻 Online Mode</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">50% OFF</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-vsOrange font-display">₹2,999</span>
                    <span className="text-xs text-slate-400 line-through">₹5,999</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Live Interactive Batches + Project Code</p>
                </div>

                {/* Offline Mode Option */}
                <div
                  onClick={() => setSelectedMode('offline')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedMode === 'offline'
                      ? 'border-vsOrange bg-orange-50/60 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#01155C]">🏫 Offline Campus</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">50% OFF</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-vsOrange font-display">₹9,999</span>
                    <span className="text-xs text-slate-400 line-through">₹19,999</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Chirala On-Site Classroom + Lab</p>
                </div>

              </div>
            </div>

            {/* Student Info Fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-vsOrange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-vsOrange"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-vsOrange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-vsOrange bg-white"
                >
                  <option value="gpay">UPI / Google Pay / PhonePe</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="pay_at_center">Pay at Chirala Center (Offline)</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-vsOrange text-white font-extrabold text-xs shadow-lg shadow-vsOrange/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm Enrollment for {pricing[selectedMode].price}</span>
                <span>→</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
