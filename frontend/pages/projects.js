import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category || 'General'))];

  const filteredProjects = selectedCategory === 'All' ? projects : projects.filter(p => (p.category || 'General') === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">REAL-WORLD IMPLEMENTATION</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Practical Project Showcase
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-3">
            Explore hands-on technology projects built by students during Vision Spark Solutions training modules.
          </p>
        </div>
      </section>

      {/* Category Pills & Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-vsOrange text-white shadow-md shadow-vsOrange/20'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vsOrange"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-vsBlue/40 transition-all shadow-sm overflow-hidden">
                <div>
                  {proj.image_url && (
                    <img 
                      src={proj.image_url} 
                      alt={proj.title} 
                      className="w-full h-40 object-cover rounded-2xl mb-4" 
                    />
                  )}
                  {proj.category && (
                    <span className="px-3 py-1 rounded-full bg-vsOrange/10 text-vsOrange text-[11px] font-bold border border-vsOrange/20 inline-block mb-3">
                      {proj.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-[#01155C] mb-2 font-display">{proj.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>

                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-display">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.technologies || []).map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href="/courses"
                    className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-vsBlue hover:text-vsOrange text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Build Projects Like This</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

