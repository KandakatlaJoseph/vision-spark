import { useState } from 'react';
import Link from 'next/link';

const panels = [
  {
    id: 'courses',
    label: 'COURSES',
    tag: 'WHAT YOU LEARN',
    title: 'Industry-Aligned Courses Built for Real Jobs.',
    description:
      'Python, Full Stack, AI & ML, Data Science, Cloud & DevOps — every programme is built around what employers actually hire for, with live projects and mentor guidance from day one.',
    cta: { label: 'Browse All Courses →', href: '/courses' },
    bg: 'bg-[#F0F4FF]',
    accent: '#01155C',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'internships',
    label: 'INTERNSHIPS',
    tag: 'REAL EXPERIENCE',
    title: 'Work on Live Projects Before You Graduate.',
    description:
      'Our internship programs place you inside real companies and real codebases. Get your first professional experience, a certificate, and a project to show — not just a certificate to hide.',
    cta: { label: 'Explore Internships →', href: '/internships' },
    bg: 'bg-[#FFF7F0]',
    accent: '#FC5302',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'campus',
    label: 'CAMPUS',
    tag: 'FOR COLLEGES',
    title: 'Bring Industry-Standard Training to Your Campus.',
    description:
      'We partner with colleges across India to deliver tailor-made corporate readiness workshops, hackathons, and placement boot camps — directly on your campus.',
    cta: { label: 'Partner With Us →', href: '/campus-training' },
    bg: 'bg-[#F0FFF8]',
    accent: '#059669',
    image: 'https://images.unsplash.com/photo-1605711285791-0219e80e43a3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'placement',
    label: 'PLACEMENT',
    tag: 'GET HIRED',
    title: 'Placement Support That Actually Works.',
    description:
      'Resume reviews, mock interviews, referral network, LinkedIn optimisation — our dedicated placement cell works with you until you land the offer. 100% practical, zero fluff.',
    cta: { label: 'Learn About Placement →', href: '/careers' },
    bg: 'bg-[#FFFBF0]',
    accent: '#D97706',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
  },
];

export default function ChooseYourPath({ openEnquiry }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#FC5302] mb-4">
            <span className="w-5 h-px bg-[#FC5302]" />
            COMPARE BEFORE YOU COMMIT
            <span className="w-5 h-px bg-[#FC5302]" />
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#01155C] leading-[1.08]">
            CHOOSE WITH MORE<br />CLARITY
          </h2>
          <p className="mt-4 text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Explore our programmes side by side. Hover over each to see how it fits your goals — then decide.
          </p>
        </div>

        {/* Accordion Panels */}
        <div className="flex gap-3 h-[480px] sm:h-[520px]">
          {panels.map((panel, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={panel.id}
                onMouseEnter={() => setOpenIdx(idx)}
                onClick={() => setOpenIdx(idx)}
                className={`path-panel ${isOpen ? 'is-open' : ''} ${panel.bg} border border-slate-200/70 shadow-sm hover:shadow-md`}
                style={{ borderRadius: '20px' }}
              >
                {/* Background image (visible only when open) */}
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-[20px] transition-opacity duration-500"
                  style={{
                    backgroundImage: `url(${panel.image})`,
                    opacity: isOpen ? 1 : 0,
                  }}
                />
                {/* Overlay gradient when open */}
                {isOpen && (
                  <div className="absolute inset-0 rounded-[20px] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                )}

                {/* Closed label (vertical text) */}
                <span
                  className="panel-label text-[11px] font-extrabold tracking-[0.18em] uppercase"
                  style={{ color: isOpen ? 'transparent' : panel.accent }}
                >
                  {panel.label}
                </span>

                {/* Open content */}
                <div className="panel-content">
                  <span
                    className="inline-block text-[10px] font-extrabold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-3"
                    style={{ background: panel.accent, color: '#fff' }}
                  >
                    {panel.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    {panel.title}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4 max-w-sm hidden sm:block">
                    {panel.description}
                  </p>
                  <Link
                    href={panel.cta.href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-white border-b border-white/50 hover:border-white pb-0.5 transition-colors"
                  >
                    {panel.cta.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
