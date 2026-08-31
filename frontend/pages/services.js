import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <Head>
        <title>Services | Vision Spark Solutions</title>
      </Head>

      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2 block">CLIENT SERVICES</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mt-2 mb-6">
            We Build Digital <span className="text-amber-500">Excellence</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From modern websites to enterprise billing software, Vision Spark delivers custom tech solutions using all types of modern tech stacks to help your business scale.
          </p>
          <div className="mt-8">
            <Link href="/quote" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all">
              Request a Project Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all group shadow-xl shadow-slate-200/50 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-xl shadow-lg">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                      {service.description}
                    </p>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Tech Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {(service.technologies || []).map((t, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-amber-500 to-amber-600 border-t border-amber-400">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Have a project in mind?</h2>
          <p className="text-slate-900 max-w-xl mx-auto font-medium">
            Whether you need a simple landing page, complex full-stack ERP system, or custom billing software, our team of developers is ready to bring your vision to life.
          </p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-all mt-4">
            <span>Contact Our Team</span>
            <span>→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
