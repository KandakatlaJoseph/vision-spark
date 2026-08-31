import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { COMPANY_INFO, COURSES } from '../lib/coursesData';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(router.query.tab || 'overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(stored);
      // Admin should never land on the student dashboard
      if (parsedUser.role === 'admin') {
        router.replace('/admin');
        return;
      }
      setUser(parsedUser);
      setLoading(false);
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      <Head>
        <title>{user.role === 'admin' ? 'Admin Profile' : 'Student Dashboard'} | Vision Spark Solutions</title>
      </Head>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-1 block">
            {user.role === 'admin' ? 'ADMIN PORTAL' : 'LEARNING PORTAL'}
          </span>
          <h2 className="text-xl font-extrabold text-[#01155C] truncate">{user.name}</h2>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible hide-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors flex-shrink-0 ${activeTab === 'overview' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:text-[#01155C]'}`}
          >
            <span>📊</span> <span className="whitespace-nowrap">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors flex-shrink-0 ${activeTab === 'courses' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:text-[#01155C]'}`}
          >
            <span>📚</span> <span className="whitespace-nowrap">My Courses</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors flex-shrink-0 ${activeTab === 'certificates' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:text-[#01155C]'}`}
          >
            <span>🏆</span> <span className="whitespace-nowrap">Certificates</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 rounded-xl text-left text-sm font-bold flex items-center gap-3 transition-colors flex-shrink-0 ${activeTab === 'settings' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:text-[#01155C]'}`}
          >
            <span>⚙️</span> <span className="whitespace-nowrap">Profile Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 hidden md:block">
          <a 
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi, I need student support.`} 
            target="_blank" rel="noreferrer"
            className="w-full px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <span>💬</span> Student Support
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#01155C] text-white p-8 md:p-12 shadow-xl shadow-[#01155C]/20">
              <div className="relative z-10 space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold tracking-wider border border-amber-400/50 uppercase shadow-md">
                  {user.role === 'admin' ? 'Admin User' : 'Active Student'}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold font-display">
                  Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-sm md:text-base text-blue-200 max-w-xl">
                  {user.role === 'admin' 
                    ? 'Manage your personal profile settings and view your activity.' 
                    : 'Pick up right where you left off or explore new courses to expand your technology skill set.'}
                </p>
                <div className="pt-4">
                  {user.role === 'admin' ? (
                    <Link href="/admin" className="px-6 py-3 rounded-xl bg-amber-500 text-[#01155C] font-extrabold text-sm shadow-lg hover:bg-amber-400 transition-colors inline-block">
                      Go to Admin Dashboard →
                    </Link>
                  ) : (
                    <button onClick={() => setActiveTab('courses')} className="px-6 py-3 rounded-xl bg-amber-500 text-[#01155C] font-extrabold text-sm shadow-lg hover:bg-amber-400 transition-colors">
                      Continue Learning →
                    </button>
                  )}
                </div>
              </div>
              
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
              <div className="absolute bottom-0 right-20 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl"></div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <span className="text-3xl font-extrabold text-[#01155C]">2</span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1">Active Courses</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <span className="text-3xl font-extrabold text-amber-500">1</span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1">Completed</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <span className="text-3xl font-extrabold text-emerald-500">1</span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1">Certificates</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <span className="text-3xl font-extrabold text-vsBlue">85%</span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1">Avg. Score</span>
              </div>
            </div>

            {/* In Progress Mock UI */}
            <div>
              <h2 className="text-xl font-extrabold text-[#01155C] mb-4">Continue Learning</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="/assets/courses/python.jpg" alt="Python" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=400'; }} />
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <span className="text-[10px] font-bold text-amber-500 uppercase">Software Development</span>
                  <h3 className="text-lg font-bold text-slate-900">Python Programming Masterclass</h3>
                  <p className="text-xs text-slate-500">Next topic: Object Oriented Programming (OOP)</p>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto flex-shrink-0">
                  <button className="w-full px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-amber-500 hover:text-slate-900 transition-colors">
                    Resume Video
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-2xl font-extrabold text-[#01155C]">My Courses</h2>
              <p className="text-slate-500 text-sm">View all your enrolled and completed training programs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSES.slice(0, 4).map((c, i) => (
                <Link href={`/courses/${c.slug}`} key={c.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all group flex flex-col">
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                    <img src={c.image_url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white text-[9px] font-bold text-slate-700 shadow-sm">
                      {i === 0 ? 'Completed' : 'Enrolled'}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-amber-500 mb-1">{c.category}</span>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight mb-3 group-hover:text-vsBlue">{c.title}</h3>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className={`h-full ${i === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: i === 0 ? '100%' : '35%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{i === 0 ? '100% Completed' : '35% Completed'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-2xl font-extrabold text-[#01155C]">My Certificates</h2>
              <p className="text-slate-500 text-sm">Download your completion certificates to share on LinkedIn.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="w-48 h-32 bg-amber-50 rounded-xl border-2 border-amber-200 border-dashed flex flex-col items-center justify-center text-amber-600 flex-shrink-0">
                <span className="text-3xl mb-1">🎓</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Certificate</span>
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Python Programming Masterclass</h3>
                <p className="text-xs text-slate-500">Issued on: August 15, 2026 • Credential ID: VS-2026-PY882</p>
                <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button className="px-5 py-2.5 rounded-lg bg-[#01155C] text-white text-xs font-bold hover:bg-blue-900 transition-colors">
                    Download PDF
                  </button>
                  <button className="px-5 py-2.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold hover:brightness-110 transition-colors flex items-center gap-1.5">
                    <span>in</span> Add to Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-2xl font-extrabold text-[#01155C]">Profile Settings</h2>
              <p className="text-slate-500 text-sm">Manage your account details and password.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <button type="button" className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Phone Number</label>
                  <input type="tel" placeholder="Add phone number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="px-8 py-3 rounded-xl bg-amber-500 text-[#01155C] font-extrabold text-sm shadow-md hover:bg-amber-400 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
