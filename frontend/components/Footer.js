import Link from 'next/link';
import { COMPANY_INFO, COURSES } from '../lib/coursesData';

const programs = [
  { label: 'Python Programming', href: '/courses/python-programming' },
  { label: 'Full Stack Web Dev', href: '/courses/full-stack-web-development-mern' },
  { label: 'AI & Machine Learning', href: '/courses/ai-and-machine-learning' },
  { label: 'Data Science', href: '/courses/data-science' },
  { label: 'Cloud & DevOps', href: '/courses/cloud-and-devops' },
  { label: 'Cyber Security', href: '/courses/cyber-security' },
  { label: 'Generative AI', href: '/courses/generative-ai' },
];

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Internships', href: '/internships' },
  { label: 'Campus Training', href: '/campus-training' },
  { label: 'Contact', href: '/contact' },
];

const socials = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.025-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${COMPANY_INFO.whatsappMessage}`,
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-slate-100 overflow-hidden">

      {/* ── Dynamic Gradient Separator ── */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#01155C] via-[#0054FF] to-[#FC5302]" />

      {/* ── Main footer grid ── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-1 space-y-5">
          <Link href="/">
            <img src="/logo_transparent.png" alt="Vision Spark" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            Premier technology training, internships, campus programs and placement support — built for India's next generation of engineers.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-[#01155C] hover:text-white transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="pt-2 space-y-2">
            <a
              href={`tel:${COMPANY_INFO.phoneClean}`}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#FC5302] transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-base">📞</span>
              {COMPANY_INFO.phone}
            </a>
            <a
              href={COMPANY_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#01155C] transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base">📍</span>
              View on Google Maps ↗
            </a>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#FC5302] mb-5">Programs</h4>
          <ul className="space-y-3">
            {programs.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-sm font-medium text-slate-600 hover:text-[#01155C] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#FC5302] transition-colors flex-shrink-0" />
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#01155C] mb-5">Company</h4>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-medium text-slate-600 hover:text-[#01155C] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#01155C] transition-colors flex-shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support + Contact */}
        <div className="space-y-5">
          <h4 className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#01155C] mb-5">Support</h4>
          
          <div className="bg-[#01155C]/5 border border-[#01155C]/10 rounded-2xl p-5 space-y-2">
            <p className="text-xs font-bold text-[#01155C] uppercase tracking-wider">Office Hours</p>
            <p className="text-sm text-slate-600 font-medium">Mon – Sat: 9:00 AM – 7:00 PM</p>
            <p className="text-sm text-slate-600 font-medium">Sunday: By Appointment Only</p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p className="font-medium">
            © {new Date().getFullYear()} <span className="text-[#01155C] font-bold">Vision Spark Solutions India Pvt. Ltd.</span> — All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs font-semibold">
            <Link href="/privacy" className="hover:text-[#01155C] transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-slate-200" />
            <Link href="/terms" className="hover:text-[#01155C] transition-colors">Terms of Service</Link>
            <span className="w-px h-3 bg-slate-200" />
            <Link href="/contact" className="hover:text-[#01155C] transition-colors">Support</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
