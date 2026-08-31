import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import EnquiryModal from '../../components/EnquiryModal';
import CourseRating from '../../components/CourseRating';
import EnrollmentModal from '../../components/EnrollmentModal';
import CurriculumJourney from '../../components/CurriculumJourney';
import { COURSES, COMPANY_INFO } from '../../lib/coursesData';

export default function CourseDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('enquiry');
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [expandedModule, setExpandedModule] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`http://localhost:5000/api/courses/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (!data.modules || data.modules.length === 0) {
          const fallback = COURSES.find(c => c.slug === slug);
          if (fallback) data.modules = fallback.modules;
        }
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        const fallback = COURSES.find(c => c.slug === slug);
        if (fallback) {
          setCourse(fallback);
        } else {
          setCourse(null);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vsOrange"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center py-32">
        <h2 className="text-2xl font-bold mb-4 font-display text-[#01155C]">Course Not Found</h2>
        <Link href="/courses" className="px-6 py-3 bg-vsOrange text-white font-bold rounded-xl shadow-md hover:bg-orange-600">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Course Hero */}
      <section className="py-16 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-vsOrange/10 text-vsOrange text-xs font-bold border border-vsOrange/20">
                {course.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">Duration: {course.duration}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#01155C] tracking-tight font-display">
              {course.title}
            </h1>
            
            <div className="mt-2">
              <CourseRating courseId={course.slug} initialRating={course.rating || 4.9} />
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {course.short_description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => { setModalMode('enquiry'); setModalOpen(true); }}
                className="px-6 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm hover:text-vsBlue transition-all"
              >
                Enquire Now
              </button>
              <button
                onClick={() => { setModalMode('demo'); setModalOpen(true); }}
                className="px-6 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all"
              >
                Book Demo Class
              </button>
              <button
                onClick={() => setEnrollmentOpen(true)}
                className="px-6 py-3 rounded-xl bg-vsOrange text-white font-extrabold text-sm shadow-md shadow-vsOrange/20 hover:bg-orange-600 transition-all flex items-center gap-1"
              >
                <span>Enroll Now</span>
                <span>⚡</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xl">
            <img src={course.image_url} alt={course.title} className="w-full h-44 object-cover rounded-2xl mb-2" />
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Skill Level</span>
                <span className="text-[#01155C] font-semibold">{course.level}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="text-[#01155C] font-semibold">{course.duration}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Help Desk</span>
                <a href={`tel:${COMPANY_INFO.phoneClean}`} className="text-vsOrange font-bold">{COMPANY_INFO.phone}</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Course Description Section */}
      {course.description && (
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100 w-full">
          <div 
            className="course-description-content prose prose-slate prose-lg max-w-none prose-headings:text-[#01155C] prose-a:text-vsOrange hover:prose-a:text-vsOrangeHover text-justify"
            dangerouslySetInnerHTML={{ 
              __html: course.description
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'") 
            }}
          />
          <style jsx global>{`
            .course-description-content p {
              text-align: justify !important;
            }
          `}</style>
        </section>
      )}

      {/* Interactive GSAP Curriculum Journey */}
      <CurriculumJourney modules={course.modules} />

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCourse={course.title}
        mode={modalMode}
      />

      <EnrollmentModal
        isOpen={enrollmentOpen}
        onClose={() => setEnrollmentOpen(false)}
        course={course}
      />
    </div>
  );
}

