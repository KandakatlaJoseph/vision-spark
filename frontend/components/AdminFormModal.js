import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p className="text-gray-500 text-sm py-4">Loading Rich Text Editor...</p> });

export default function AdminFormModal({ isOpen, onClose, activeTab, initialData, onSave }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formMode, setFormMode] = useState('basic'); // 'basic', 'details'

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        technologies: Array.isArray(initialData.technologies) ? initialData.technologies.join(', ') : initialData.technologies,
        modules: initialData.modules ? JSON.stringify(initialData.modules, null, 2) : '',
        learnings: initialData.learnings ? JSON.stringify(initialData.learnings, null, 2) : '',
        career_opportunities: initialData.career_opportunities ? JSON.stringify(initialData.career_opportunities, null, 2) : '',
      });
    } else {
      setFormData({});
    }
    setFormMode('basic'); // Reset tab on open
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData };
      
      const parseJsonField = (field) => {
        if (payload[field] && typeof payload[field] === 'string') {
          try {
            payload[field] = JSON.parse(payload[field]);
          } catch (err) {
            throw new Error(`Invalid JSON in ${field}`);
          }
        }
      };

      if (['courses', 'services', 'projects'].includes(activeTab)) {
        if (payload.technologies && typeof payload.technologies === 'string') {
          payload.technologies = payload.technologies.split(',').map(t => t.trim()).filter(Boolean);
        }
        if (activeTab === 'courses') {
          parseJsonField('modules');
          parseJsonField('learnings');
          parseJsonField('career_opportunities');
        }
      }

      const token = localStorage.getItem('vs_token') || localStorage.getItem('token');
      const method = initialData ? 'PUT' : 'POST';
      let endpoint = '';

      if (activeTab === 'course_enrollments') {
        endpoint = initialData ? `${API_URL}/enrollments/guest/${initialData.id}` : `${API_URL}/enrollments/guest`;
      } else if (['course_enquiries', 'demo_requests', 'internship_applications', 'campus_enquiries', 'contact_messages'].includes(activeTab)) {
        endpoint = initialData ? `${API_URL}/enquiries/${activeTab}/${initialData.id}` : `${API_URL}/enquiries/${activeTab}`;
      } else {
        endpoint = initialData ? `${API_URL}/${activeTab}/${initialData.id}` : `${API_URL}/${activeTab}`;
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save');
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (name, label, type = 'text', required = false) => (
    <div>
      <label className="block text-xs font-bold text-gray-600 capitalize mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
      />
    </div>
  );

  const renderTextarea = (name, label, rows = 3) => (
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-gray-600 capitalize mb-1">{label}</label>
      <textarea
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        rows={rows}
        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
      ></textarea>
    </div>
  );

  const renderQuill = (name, label) => (
    <div className="col-span-1 md:col-span-2">
      <label className="block text-xs font-bold text-gray-600 capitalize mb-2">{label}</label>
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 text-gray-800">
        <ReactQuill 
          theme="snow" 
          value={formData[name] || ''} 
          onChange={handleQuillChange}
          className="h-64 mb-12"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image', 'video'],
              ['clean']
            ]
          }}
        />
      </div>
    </div>
  );

  const renderFields = () => {
    switch (activeTab) {
      case 'course_enrollments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('studentName', 'Student Name', 'text', true)}
            {renderField('email', 'Email', 'email', true)}
            {renderField('phone', 'Phone Number', 'tel', true)}
            {renderField('courseTitle', 'Course Title', 'text', true)}
            {renderField('mode', 'Mode (online/offline)')}
            {renderField('amountPaid', 'Amount Paid')}
            {renderField('paymentMethod', 'Payment Method')}
            {renderField('status', 'Status')}
          </div>
        );
      case 'course_enquiries':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('name', 'Name', 'text', true)}
            {renderField('mobile', 'Mobile', 'tel', true)}
            {renderField('email', 'Email', 'email', true)}
            {renderField('course', 'Course', 'text', true)}
            {renderField('preferred_mode', 'Preferred Mode')}
            {renderField('status', 'Status')}
            {renderTextarea('message', 'Message')}
          </div>
        );
      case 'demo_requests':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('name', 'Name', 'text', true)}
            {renderField('phone', 'Phone', 'tel', true)}
            {renderField('email', 'Email', 'email', true)}
            {renderField('course', 'Course', 'text', true)}
            {renderField('preferred_date', 'Preferred Date', 'date')}
            {renderField('preferred_time', 'Preferred Time', 'time')}
            {renderField('status', 'Status')}
            {renderTextarea('message', 'Message')}
          </div>
        );
      case 'internship_applications':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('name', 'Name', 'text', true)}
            {renderField('email', 'Email', 'email', true)}
            {renderField('phone', 'Phone', 'tel', true)}
            {renderField('technology', 'Technology', 'text', true)}
            {renderField('college', 'College')}
            {renderField('qualification', 'Qualification')}
            {renderField('graduation_year', 'Graduation Year')}
            {renderField('status', 'Status')}
            {renderTextarea('message', 'Message')}
          </div>
        );
      case 'campus_enquiries':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('college_name', 'College Name', 'text', true)}
            {renderField('contact_person', 'Contact Person', 'text', true)}
            {renderField('phone', 'Phone', 'tel', true)}
            {renderField('email', 'Email', 'email', true)}
            {renderField('designation', 'Designation')}
            {renderField('num_students', 'Number of Students')}
            {renderField('required_training', 'Required Training')}
            {renderField('status', 'Status')}
            {renderTextarea('message', 'Message')}
          </div>
        );
      case 'contact_messages':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('name', 'Name', 'text', true)}
            {renderField('email', 'Email', 'email', true)}
            {renderField('phone', 'Phone', 'tel', true)}
            {renderField('subject', 'Subject')}
            {renderField('status', 'Status')}
            {renderTextarea('message', 'Message')}
          </div>
        );
      case 'courses':
      case 'services':
      case 'projects':
        return (
          <div className="flex flex-col gap-6">
            {/* TABS */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setFormMode('basic')}
                className={`text-sm font-bold pb-2 transition-all duration-200 border-b-2 ${formMode === 'basic' ? 'text-amber-600 border-amber-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setFormMode('details')}
                className={`text-sm font-bold pb-2 transition-all duration-200 border-b-2 ${formMode === 'details' ? 'text-amber-600 border-amber-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                Advanced Details & Description
              </button>
            </div>

            {formMode === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                {renderField('title', 'Title', 'text', true)}
                {activeTab === 'courses' && renderField('slug', 'Slug', 'text', true)}
                {renderField('category', 'Category')}
                {activeTab === 'courses' && renderField('price', 'Price', 'number', true)}
                <div className="md:col-span-2">{renderField('image_url', 'Image URL')}</div>
                <div className="md:col-span-2">{renderField('technologies', 'Technologies (comma separated)')}</div>
                <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active !== 0} onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="w-5 h-5 rounded bg-white border-gray-300 text-amber-500 focus:ring-amber-500" />
                  <label htmlFor="is_active" className="text-sm font-bold text-gray-800">Active (Visible on Website)</label>
                </div>
              </div>
            )}

            {formMode === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                {renderQuill('description', 'Rich Description (HTML)')}
                
                {activeTab === 'courses' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Modules (JSON Array)</label>
                      <textarea name="modules" value={formData.modules || ''} onChange={handleChange} rows="6" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-blue-600 font-mono text-xs whitespace-pre focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-200"></textarea>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getFormTitle = () => {
    let title = activeTab.replace('_', ' ');
    return `${initialData ? 'Edit' : 'Add'} ${title}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md overflow-y-auto pt-24 pb-12">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-4xl my-auto transform transition-all animate-fade-in-up">
        
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#01155C] capitalize">
            {getFormTitle()}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition-colors">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl flex items-center gap-2"><span className="text-red-500">⚠️</span> {error}</div>}

          {renderFields()}

          <div className="flex items-center justify-end gap-3 pt-8 mt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 shadow-md shadow-amber-500/20 transition-all duration-200">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
