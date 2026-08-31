import { useEffect } from 'react';

export default function SyllabusModal({ isOpen, onClose, course, onEnquire, onEnroll }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !course) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in cursor-pointer"
    >
      <div className="relative bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto cursor-default">

        
        {/* Sticky Header */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-vsOrange/10 text-vsOrange text-xs font-bold border border-vsOrange/20">
                {course.category}
              </span>
              <span className="text-xs font-medium text-slate-500">⏱️ {course.duration}</span>
              <span className="text-xs font-bold text-amber-500">★ {course.rating}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#01155C] tracking-tight font-display">
              {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {course.short_description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-lg transition-colors flex-shrink-0"
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          
          {/* Tech Stack & Key Learnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-display">
                Technologies Covered:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {course.technologies.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-mono font-semibold shadow-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-display">
                Level & Target Audience:
              </span>
              <p className="text-xs font-bold text-[#01155C] bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
                {course.level}
              </p>
            </div>
          </div>

          {/* 5-Module Syllabus Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-vsOrange uppercase tracking-wider font-display">
                FULL 5-MODULE SYLLABUS
              </span>
              <span className="text-xs text-slate-500 font-medium">5 Modules • Comprehensive Curriculum</span>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-vsBlue/40 transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-vsOrange/10 text-vsOrange text-xs font-extrabold flex items-center justify-center border border-vsOrange/20 font-display flex-shrink-0">
                      0{mIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-[#01155C] font-display">
                      {mod.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-11">
                    {mod.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Ready to master {course.title}?
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => { onClose(); onEnquire(course.title, 'enquiry'); }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-vsBlue text-xs font-bold transition-all"
            >
              Enquire Now
            </button>
            <button
              onClick={() => { onClose(); onEnquire(course.title, 'demo'); }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-xs hover:bg-emerald-100 transition-all"
            >
              Free Demo
            </button>
            {onEnroll && (
              <button
                onClick={() => { onClose(); onEnroll(course); }}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-vsOrange text-white font-extrabold text-xs hover:bg-orange-600 shadow-md shadow-vsOrange/20 transition-all flex items-center justify-center gap-1"
              >
                <span>Enroll Now</span>
                <span>⚡</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
