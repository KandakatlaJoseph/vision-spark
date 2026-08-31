import { useState } from 'react';
import EnquiryModal from '../components/EnquiryModal';
import { COMPANY_INFO } from '../lib/coursesData';

export default function Careers() {
  const [modalOpen, setModalOpen] = useState(false);

  const modules = [
    { title: 'Quantitative Aptitude', topics: ['Number Systems', 'Percentages', 'Profit & Loss', 'Time & Work', 'Speed, Distance & Time', 'Permutations & Combinations'] },
    { title: 'Logical Reasoning', topics: ['Coding-Decoding', 'Blood Relations', 'Seating Arrangements', 'Puzzles & Syllogisms', 'Data Sufficiency', 'Series & Pattern Analysis'] },
    { title: 'Verbal Ability & Grammar', topics: ['Grammar Fundamentals', 'Vocabulary Enhancement', 'Reading Comprehension', 'Sentence Correction', 'Professional Email Etiquette'] },
    { title: 'Technical Coding & DSA', topics: ['Data Structures & Arrays', 'Algorithms & Problem Solving', 'Object-Oriented Programming', 'SQL Queries & Joins', 'Live Code Debugging'] },
    { title: 'Technical & HR Interview Prep', topics: ['Core Computer Science Concepts', 'Project Presentation Techniques', 'Behavioral HR Questions', 'Salary Negotiation', 'Confidence & Communication'] },
    { title: 'Resume & Branding', topics: ['ATS-Compliant Resume Creation', 'LinkedIn Profile Optimization', 'GitHub Portfolio Showcase', 'Cold Emailing & Networking'] },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">CAMPUS & INDUSTRY PLACEMENT</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Career &amp; Placement Preparation
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Master aptitude, reasoning, technical coding rounds, resume building, and mock interviews to land your dream tech job.
          </p>
        </div>
      </section>

      {/* Placement Pillars */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-[#01155C] font-display">Comprehensive 6-Pillar Career Syllabus</h2>
          <p className="text-xs text-slate-600 mt-2">Designed to make candidates 100% industry ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:border-vsBlue/40 transition-all">
              <span className="w-8 h-8 rounded-xl bg-vsOrange/10 text-vsOrange text-xs font-extrabold flex items-center justify-center border border-vsOrange/20 font-display">
                0{idx + 1}
              </span>
              <h3 className="text-xl font-bold text-[#01155C] font-display">{m.title}</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {m.topics.map((t, tIdx) => (
                  <li key={tIdx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Become Industry Ready CTA */}
      <section className="py-16 bg-gradient-to-r from-[#01155C] via-[#0054FF] to-[#FC5302] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">Become Industry Ready Today</h2>
          <p className="text-sm font-medium opacity-90 leading-relaxed max-w-2xl mx-auto">
            Join Vision Spark Solutions placement preparation program and unlock expert mock interviews, ATS resume reviews, and direct guidance.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-white text-[#01155C] font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all"
            >
              Enquire For CRT &amp; Placement Prep
            </button>
            <a
              href={`tel:${COMPANY_INFO.phoneClean}`}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-xl hover:bg-emerald-500 transition-all"
            >
              Call Counselor ({COMPANY_INFO.phone})
            </a>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCourse="CRT / Campus Recruitment Training"
        mode="enquiry"
      />
    </div>
  );
}

