import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { COMPANY_INFO } from '../lib/coursesData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef(null);
  const linkRefs = useRef({});

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Courses', href: '/courses' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ];

  const moreLinks = [
    { name: '💼 Internships', href: '/internships' },
    { name: '🏫 Campus Training', href: '/campus-training' }
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  // Update gliding indicator position
  useEffect(() => {
    const activeHref = navLinks.find(l => isActive(l.href))?.href;
    if (activeHref && linkRefs.current[activeHref] && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = linkRefs.current[activeHref].getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1
      });
    } else {
      setIndicatorStyle(s => ({ ...s, opacity: 0 }));
    }
  }, [router.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "py-0"
            : "py-2"
        )}
      >
        {/* Glass pill wrapper */}
        <div className={cn(
          "mx-auto transition-all duration-500",
          scrolled
            ? "max-w-full bg-white/80 backdrop-blur-2xl shadow-[0_2px_32px_rgba(0,0,0,0.10)] border-b border-white/60"
            : "max-w-[1380px] mt-3 rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-white/80"
        )}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[68px]">

              {/* Logo */}
              <Link href="/" className="flex items-center flex-shrink-0 mr-6 group">
                <motion.img
                  src="/logo_transparent.png"
                  alt="Vision Spark Solutions"
                  className="h-11 w-auto object-contain"
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                />
              </Link>

              {/* Desktop Nav */}
              <nav ref={navRef} className="hidden lg:flex items-center relative gap-0.5">
                {/* Gliding background pill indicator */}
                <motion.div
                  className="absolute h-[42px] rounded-xl bg-[#01155C]/8 pointer-events-none"
                  animate={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: indicatorStyle.opacity }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />

                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      ref={el => linkRefs.current[link.href] = el}
                      className={cn(
                        "relative px-5 py-2.5 text-[15.5px] font-semibold transition-colors duration-200 flex items-center rounded-xl whitespace-nowrap z-10",
                        active
                          ? "text-[#01155C]"
                          : "text-slate-600 hover:text-[#01155C]"
                      )}
                    >
                      {link.name}
                      {/* Active dot */}
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vsOrange"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}

                {/* More Dropdown */}
                <div
                  className="relative z-10"
                  onMouseEnter={() => setMoreDropdownOpen(true)}
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <button className={cn(
                    "px-5 py-2.5 text-[15.5px] font-semibold transition-colors duration-200 flex items-center gap-1.5 rounded-xl",
                    moreLinks.some(l => isActive(l.href.replace(/[^/\w-]/g, '')))
                      ? "text-[#01155C]"
                      : "text-slate-600 hover:text-[#01155C] hover:bg-[#01155C]/5"
                  )}>
                    More
                    <motion.svg
                      animate={{ rotate: moreDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-3.5 h-3.5 mt-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {moreDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-2xl rounded-2xl py-1.5 z-50 overflow-hidden"
                      >
                        {moreLinks.map((link) => {
                          const href = link.href;
                          const label = link.name;
                          const active = router.pathname.startsWith(href);
                          return (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setMoreDropdownOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-4 py-3 text-[14px] font-medium transition-all",
                                active
                                  ? "text-[#01155C] bg-blue-50/80 font-semibold"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-[#01155C]"
                              )}
                            >
                              {label}
                              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vsOrange flex-shrink-0" />}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* Right CTAs */}
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <motion.a
                  href={`tel:${COMPANY_INFO.phoneClean}`}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 border border-slate-200/70 text-slate-700 text-[15.5px] font-medium hover:border-[#01155C]/40 hover:text-[#01155C] transition-all"
                >
                  <span className="text-[13px]">📞</span>
                  <span>{COMPANY_INFO.phone}</span>
                </motion.a>

                <motion.a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${COMPANY_INFO.whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[15.5px] font-medium hover:bg-emerald-100 transition-all"
                >
                  <span className="text-[13px]">💬</span>
                  <span>WhatsApp</span>
                </motion.a>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 mx-1" />

                {user ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setProfileDropdownOpen(true)}
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 focus:outline-none"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#01155C] via-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/25 ring-2 ring-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <motion.svg
                        animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-3 h-3 text-slate-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </motion.button>

                    <AnimatePresence>
                      {profileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full right-0 mt-2 w-68 bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-2xl rounded-2xl py-1.5 z-50 overflow-hidden"
                          style={{ minWidth: '260px' }}
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#01155C] via-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-md shadow-blue-500/20">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-[15px] font-bold text-slate-900 truncate">{user.name}</span>
                              <span className="block text-[13px] text-slate-500 truncate">{user.email}</span>
                              <span className={cn(
                                "inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide",
                                user.role === 'admin'
                                  ? "bg-[#01155C] text-white"
                                  : "bg-amber-100 text-amber-700"
                              )}>
                                {user.role === 'admin' ? '⚡ Administrator' : '🎓 Student'}
                              </span>
                            </div>
                          </div>

                          {/* Admin links */}
                          {user.role === 'admin' && (
                            <Link
                              href="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50/80 hover:text-[#01155C] transition-colors"
                            >
                              <span className="text-base">🛡️</span>
                              <span>Admin Panel</span>
                              <svg className="ml-auto w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                          )}

                          {/* Student links */}
                          {user.role !== 'admin' && (
                            <>
                              <Link
                                href="/dashboard"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-blue-50/80 hover:text-[#01155C] transition-colors"
                              >
                                <span className="text-base">📊</span>
                                <span>My Dashboard</span>
                                <svg className="ml-auto w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </Link>
                              <Link
                                href="/dashboard?tab=settings"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-blue-50/80 hover:text-[#01155C] transition-colors"
                              >
                                <span className="text-base">⚙️</span>
                                <span>Profile Settings</span>
                                <svg className="ml-auto w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </Link>
                            </>
                          )}

                          <div className="border-t border-slate-100 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50/70 transition-colors"
                            >
                              <span className="text-base">🚪</span>
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-[15px] font-semibold text-slate-700 hover:text-[#01155C] transition-colors rounded-xl hover:bg-slate-100/70"
                    >
                      Log In
                    </Link>
                    <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}>
                      <Link
                        href="/signup"
                        className="px-5 py-2.5 text-[15px] font-bold rounded-xl bg-[#01155C] text-white shadow-md shadow-[#01155C]/20 hover:bg-blue-900 transition-all"
                      >
                        Register
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/80 border border-slate-200/60 text-slate-700 focus:outline-none shadow-sm"
              >
                <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {mobileMenuOpen ? '✕' : '☰'}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-5 space-y-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between py-3 px-4 rounded-xl font-semibold text-sm transition-all",
                      active
                        ? "bg-[#01155C]/5 text-[#01155C] border border-[#01155C]/10"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{link.name}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-vsOrange" />}
                  </Link>
                );
              })}

              <div className="py-2 border-y border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-4 block mb-1 tracking-wider">More Programs</span>
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex py-2.5 px-4 rounded-xl font-medium text-sm transition-colors",
                      router.pathname.startsWith(link.href) ? "text-[#01155C] bg-blue-50/60" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="flex gap-2 pt-2">
                <a href={`tel:${COMPANY_INFO.phoneClean}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">
                  📞 Call Us
                </a>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${COMPANY_INFO.whatsappMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
