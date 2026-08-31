import { useState, useEffect, useRef } from 'react';
import { COURSES, COMPANY_INFO } from '../lib/coursesData';

export default function EnquiryModal({ isOpen, onClose, defaultCourse = '', mode = 'enquiry' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: defaultCourse || COURSES[0].title,
    preferred_mode: 'Online',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // --- HTML5 Canvas Form Focus Animation ("Focusss") ---
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !formRef.current) return;

    const SPACING = 16;
    const RADIUS = 8;
    const CHECK_RADIUS = RADIUS * 1.8;
    const CHECK_SIZE = 10;
    const CHECK_LENGTH = Math.ceil(10 * 1.8);
    const TAIL_LENGTH = 8;

    const HEAD_COLOR = '#FC5302'; // vsOrange
    const TAIL_COLOR = '#0054FF'; // vsBlue

    const head = { r: RADIUS, tr: RADIUS, x: 0, y: 0, tx: 0, ty: 0, vx: 0 };
    const tail = [];
    const checkmarks = new Map();

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let width, height, dpr, currentFocus;

    const resize = () => {
      if (!formRef.current) return;
      dpr = window.devicePixelRatio || 1;
      width = formRef.current.offsetWidth;
      height = formRef.current.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.scale(dpr, dpr);
    };

    const focus = (element) => {
      const previousFocus = currentFocus;
      if (element) currentFocus = element;
      if (!currentFocus || !currentFocus.matches('input, select, textarea, button')) return;

      head.tx = currentFocus.offsetLeft - SPACING - RADIUS;
      head.ty = currentFocus.offsetTop + currentFocus.offsetHeight / 2;

      if (isNaN(head.x) || head.x === 0) {
        head.x = head.tx;
        head.y = head.ty;
      }

      if (currentFocus !== previousFocus) {
        head.vx = -8 - Math.abs(head.tx - head.x) / 5;
      }
    };

    const validate = (element) => {
      let valid = false;
      if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        valid = element.value.length > 0;
      } else {
        switch (element.getAttribute('type')) {
          case 'email': valid = /(.+)@(.+){2,}\.(.+){2,}/.test(element.value); break;
          case 'tel': valid = element.value.length >= 10; break;
          default: valid = element.value.length > 0; break;
        }
      }

      if (element.classList) {
        element.classList.toggle('valid', valid);
      }
      if (checkmarks.has(element)) {
        checkmarks.get(element).tv = valid ? 1 : 0;
      }
    };

    const paint = () => {
      context.clearRect(0, 0, width, height);

      if (currentFocus) {
        tail.push({ ...head });
        if (tail.length > TAIL_LENGTH) tail.shift();

        if (tail.length > 3) {
          context.beginPath();
          context.moveTo(tail[0].x, tail[0].y);
          let i;
          for (i = 2; i < tail.length - 2; i++) {
            const p1 = tail[i];
            const p2 = tail[i + 1];
            context.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
          }
          context.quadraticCurveTo(tail[i].x, tail[i].y, tail[i + 1].x, tail[i + 1].y);
          context.lineWidth = RADIUS;
          context.lineCap = 'round';
          context.strokeStyle = TAIL_COLOR;
          context.stroke();
        }

        head.tr = currentFocus.classList?.contains('valid') ? CHECK_RADIUS : RADIUS;
        head.x += (head.tx - head.x) * 0.2;
        head.y += (head.ty - head.y) * 0.2;
        head.r += (head.tr - head.r) * 0.2;
        head.vx *= 0.8;
        head.x += head.vx;

        context.beginPath();
        context.arc(head.x, head.y, head.r, 0, Math.PI * 2);
        context.fillStyle = HEAD_COLOR;
        context.fill();
      }

      for (let [inputElement, checkmark] of checkmarks) {
        checkmark.v += (checkmark.tv - checkmark.v) * 0.2;
        if (checkmark.v > 0.05) {
          const midX = inputElement.offsetLeft - CHECK_SIZE / 2 - SPACING - 3;
          const midY = inputElement.offsetTop + inputElement.offsetHeight / 2 + 1;

          context.save();
          context.beginPath();
          context.moveTo(midX + CHECK_SIZE / 2, midY - CHECK_SIZE / 2);
          context.lineTo(midX - 1, midY + CHECK_SIZE / 2 - 1);
          context.lineTo(midX - CHECK_SIZE / 2, midY);

          context.lineWidth = 3;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.setLineDash([CHECK_LENGTH, CHECK_LENGTH]);
          context.lineDashOffset = CHECK_LENGTH + Math.round(checkmark.v * CHECK_LENGTH);

          context.globalCompositeOperation = 'lighter';
          context.strokeStyle = '#555';
          context.stroke();

          context.globalCompositeOperation = 'source-over';
          context.strokeStyle = '#fff';
          context.stroke();
          context.restore();
        }
      }
    };

    const animate = () => {
      paint();
      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Setup Event Listeners within the form scope
    const inputs = formRef.current.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      checkmarks.set(input, { v: 0, tv: 0 });
      input.addEventListener('focus', (e) => focus(e.target));
      input.addEventListener('input', (e) => validate(e.target));
      input.addEventListener('change', (e) => validate(e.target));
    });

    const formRefCurrent = formRef.current;
    
    resize();
    animate();

    const handleResize = () => {
      resize();
      focus(currentFocus);
      paint();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      inputs.forEach(input => {
        input.removeEventListener('focus', (e) => focus(e.target));
        input.removeEventListener('input', (e) => validate(e.target));
        input.removeEventListener('change', (e) => validate(e.target));
      });
    };
  }, [isOpen, successMsg]); 
  // Re-run if successMsg changes because the form disappears.

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const endpoint = mode === 'demo' ? `${API_URL}/enquiries/demo` : `${API_URL}/enquiries/course`;

    try {
      const payload =
        mode === 'demo'
          ? {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              course: formData.course,
              preferred_date: formData.preferred_date,
              preferred_time: formData.preferred_time,
              mode: formData.preferred_mode,
              message: formData.message,
            }
          : {
              name: formData.name,
              mobile: formData.phone,
              email: formData.email,
              course: formData.course,
              preferred_mode: formData.preferred_mode,
              message: formData.message,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSuccessMsg('Thank you for contacting Vision Spark Solutions. Our team will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        course: COURSES[0].title,
        preferred_mode: 'Online',
        preferred_date: '',
        preferred_time: '',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 text-xl font-bold w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 z-50"
        >
          ✕
        </button>

        <h3 className="text-xl font-extrabold text-[#01155C] mb-1 flex items-center gap-2 font-display relative z-10">
          <span className="spark-mark" />
          <span>{mode === 'demo' ? 'Book a Free Demo Class' : 'Enquire About Course'}</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6 relative z-10">
          {COMPANY_INFO.name} — Industry Technology Training &amp; Placements
        </p>

        {successMsg ? (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl text-center space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <p className="text-emerald-800 font-semibold text-sm leading-relaxed">{successMsg}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <div ref={formRef} className="relative z-10 w-full pl-6">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none -translate-x-6" style={{ zIndex: 50 }} />
            
            <form onSubmit={handleSubmit} className="space-y-4 relative z-50">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                  >
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Training Mode</label>
                  <select
                    name="preferred_mode"
                    value={formData.preferred_mode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                  >
                    <option value="Online">Online Interactive</option>
                    <option value="Offline">Offline Classroom</option>
                  </select>
                </div>
              </div>

              {mode === 'demo' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time</label>
                    <select
                      name="preferred_time"
                      value={formData.preferred_time}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                    >
                      <option value="">Select Time Slot</option>
                      <option value="Morning (10:00 AM)">Morning (10:00 AM)</option>
                      <option value="Afternoon (02:00 PM)">Afternoon (02:00 PM)</option>
                      <option value="Evening (06:00 PM)">Evening (06:00 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message (Optional)</label>
                <textarea
                  name="message"
                  rows="2"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white transition-colors relative z-20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-vsOrange text-white font-bold text-sm shadow-md shadow-vsOrange/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 relative z-20"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <span>{mode === 'demo' ? 'Submit Demo Class Booking' : 'Submit Course Enquiry'}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
