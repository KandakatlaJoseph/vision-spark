import { useState, useEffect } from 'react';
import Link from 'next/link';
import EnquiryModal from '../../components/EnquiryModal';
import SyllabusModal from '../../components/SyllabusModal';
import EnrollmentModal from '../../components/EnrollmentModal';
import CourseRating from '../../components/CourseRating';

export default function CoursesCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal States
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [syllabusCourse, setSyllabusCourse] = useState(null);

  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState(null);

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter(c => c.category === selectedCategory);

  const openEnrollmentModal = (course) => {
    setEnrollmentCourse(course);
    setEnrollmentModalOpen(true);
  };

  const openSyllabusModal = (course) => {
    setSyllabusCourse(course);
    setSyllabusModalOpen(true);
  };

  const openEnquiryModal = (title) => {
    setSelectedCourseTitle(title);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Header Banner */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-vsOrange tracking-widest uppercase">MASTER CURRICULUM</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#01155C] tracking-tight mt-2 font-display">
            Industry Technology Courses
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
            Explore our 10 practical technology training programs with 5-module comprehensive syllabi and 50% discount offers!
          </p>
        </div>
      </section>

      {/* Filter Tabs & Catalog */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-vsOrange text-white shadow-md shadow-vsOrange/20'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vsOrange"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-vsBlue/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-xl group"
            >
              <Link href={`/courses/${course.slug}`} className="block">
                {/* Card Header Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-vsOrange text-[10px] font-bold border border-slate-200 shadow-xs">
                    {course.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold">
                    ⏱️ {course.duration}
                  </div>
                </div>

                <div className="p-5 space-y-3.5">
                  
                  {/* Interactive Star Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Level: {course.level}</span>
                    <CourseRating courseId={course.id} initialRating={course.rating} />
                  </div>

                  <h3 className="text-lg font-extrabold text-[#01155C] leading-snug font-display hover:text-vsOrange transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {course.short_description}
                  </p>

                  {/* Pricing Box (Online ₹2,999 vs Offline ₹9,999 - 50% OFF) */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-orange-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <span>💻 Online:</span>
                        <strong className="text-[#01155C] text-sm font-display">₹2,999</strong>
                        <span className="text-slate-400 line-through text-[11px]">₹5,999</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-vsOrange text-white text-[9px] font-extrabold">
                        50% OFF
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-orange-200/60">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <span>🏫 Offline:</span>
                        <strong className="text-[#01155C] text-sm font-display">₹9,999</strong>
                        <span className="text-slate-400 line-through text-[11px]">₹19,999</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-vsOrange text-white text-[9px] font-extrabold">
                        50% OFF
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-display">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1">
                      {(course.technologies || []).slice(0, 4).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </Link>

              {/* Action Buttons Footer */}
              <div className="p-5 pt-2 border-t border-slate-100 space-y-2.5">
                <Link
                  href={`/courses/${course.slug}`}
                  className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-vsBlue hover:text-vsOrange hover:border-vsOrange/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>📋 View 5-Module Syllabus</span>
                  <span>→</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEnquiryModal(course.title)}
                    className="py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-vsBlue text-xs font-bold transition-all"
                  >
                    Enquire Now
                  </button>

                  <button
                    onClick={() => openEnrollmentModal(course)}
                    className="py-2.5 rounded-xl bg-vsOrange text-white text-xs font-extrabold hover:bg-orange-600 shadow-md shadow-vsOrange/20 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Enroll Now</span>
                    <span>⚡</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
          </div>
        )}

      </section>

      {/* Syllabus Modal Popup */}
      <SyllabusModal
        isOpen={syllabusModalOpen}
        onClose={() => setSyllabusModalOpen(false)}
        course={syllabusCourse}
        onEnquire={openEnquiryModal}
        onEnroll={openEnrollmentModal}
      />

      {/* Enrollment Modal (Online ₹2,999 vs Offline ₹9,999) */}
      <EnrollmentModal
        isOpen={enrollmentModalOpen}
        onClose={() => setEnrollmentModalOpen(false)}
        course={enrollmentCourse}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultCourse={selectedCourseTitle}
        mode="enquiry"
      />
    </div>
  );
}
