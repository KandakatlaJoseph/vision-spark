import { COMPANY_INFO } from '../lib/coursesData';

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">ABOUT OUR COMPANY</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Vision Spark Solutions India Pvt. Limited
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Empowering students, freshers, and institutions through industry-focused technology training, internships, and career readiness.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Who We Are */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-vsOrange/10 text-vsOrange text-xs font-bold border border-vsOrange/20">
              WHO WE ARE
            </span>
            <h2 className="text-3xl font-extrabold text-[#01155C] tracking-tight font-display">
              Leading Technology Training &amp; Skill Development Platform
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              <strong>Vision Spark Solutions India Pvt. Limited</strong> is focused on technology training, practical learning, internships, project development and career readiness.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              We bridge the gap between academic education and actual industry tech stacks. Our programs are designed to equip students with hands-on skills in Python, Data Structures, Web Development, AI/ML, Data Science, Cloud &amp; DevOps, Cyber Security, and Database engineering.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-vsOrange/10 border border-vsOrange/20 text-vsOrange text-2xl flex items-center justify-center font-bold">
                🎯
              </div>
              <div>
                <h4 className="text-[#01155C] font-bold text-base">Direct Helpline</h4>
                <a href={`tel:${COMPANY_INFO.phoneClean}`} className="text-vsOrange font-extrabold text-lg hover:underline">
                  {COMPANY_INFO.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-slate-200 pt-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-2xl flex items-center justify-center font-bold">
                💬
              </div>
              <div>
                <h4 className="text-[#01155C] font-bold text-base">Official WhatsApp</h4>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${COMPANY_INFO.whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold text-sm hover:underline"
                >
                  Connect on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-vsOrange/40 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-vsOrange/10 text-vsOrange text-2xl flex items-center justify-center mb-6">
              🚀
            </div>
            <h3 className="text-2xl font-bold text-[#01155C] mb-3 font-display">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Help students develop practical technology skills and become industry-ready through project-based training, expert mentorship, and hands-on exposure.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-vsBlue/40 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-vsBlue/10 text-vsBlue text-2xl flex items-center justify-center mb-6">
              🌐
            </div>
            <h3 className="text-2xl font-bold text-[#01155C] mb-3 font-display">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Build a strong technology learning ecosystem connecting students, educational institutions and industry requirements for seamless employment.
            </p>
          </div>
        </div>

        {/* Our Approach */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">OUR METHODOLOGY</span>
            <h2 className="text-3xl font-extrabold text-[#01155C] mt-1 font-display">Our Core Approach</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-vsOrange font-bold text-base block mb-2 font-display">01. Practical Learning</span>
              <p className="text-xs text-slate-600 leading-relaxed">Focus on active coding, live debugging, and real environment setups.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-vsBlue font-bold text-base block mb-2 font-display">02. Project-Based Training</span>
              <p className="text-xs text-slate-600 leading-relaxed">Every module ends with real-world mini and capstone projects.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-vsOrange font-bold text-base block mb-2 font-display">03. Industry Curriculum</span>
              <p className="text-xs text-slate-600 leading-relaxed">Updated regularly to match the latest enterprise tech standards.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-vsBlue font-bold text-base block mb-2 font-display">04. Mentor Support</span>
              <p className="text-xs text-slate-600 leading-relaxed">Personalized guidance and doubt resolution from tech professionals.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-vsOrange font-bold text-base block mb-2 font-display">05. Career Preparation</span>
              <p className="text-xs text-slate-600 leading-relaxed">Aptitude, logical reasoning, technical interviews, and resume building.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-vsBlue font-bold text-base block mb-2 font-display">06. Continuous Growth</span>
              <p className="text-xs text-slate-600 leading-relaxed">Regular code reviews, assessments, and continuous skill tracking.</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

