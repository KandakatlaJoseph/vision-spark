import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminFormModal from '../components/AdminFormModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stats, setStats] = useState({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTabContent(activeTab);
  }, [activeTab]);

  const fetchTabContent = async (tab) => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('vs_token') || localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      if (tab === 'dashboard') {
        const endpoints = [
          { key: 'enrollments', url: '/enrollments/guest' },
          { key: 'course_enquiries', url: '/enquiries/course' },
          { key: 'demo_requests', url: '/enquiries/demo' },
          { key: 'courses', url: '/courses' }
        ];
        
        let newStats = {};
        for (let ep of endpoints) {
          const res = await fetch(`${API_URL}${ep.url}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const json = await res.json();
            newStats[ep.key] = Array.isArray(json) ? json.length : 0;
          }
        }
        setStats(newStats);
        setData([]);
      } else {
        let endpoint = '';
        if (tab === 'course_enrollments') endpoint = `${API_URL}/enrollments/guest`;
        else if (tab === 'course_enquiries') endpoint = `${API_URL}/enquiries/course`;
        else if (tab === 'demo_requests') endpoint = `${API_URL}/enquiries/demo`;
        else if (tab === 'internship_applications') endpoint = `${API_URL}/enquiries/internship`;
        else if (tab === 'campus_enquiries') endpoint = `${API_URL}/enquiries/campus`;
        else if (tab === 'contact_messages') endpoint = `${API_URL}/contact`;
        else if (tab === 'courses') endpoint = `${API_URL}/courses/admin/all`;
        else if (tab === 'services') endpoint = `${API_URL}/services/admin/all`;
        else if (tab === 'projects') endpoint = `${API_URL}/projects/admin/all`;

        if (!endpoint) return;

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          router.push('/login');
          return;
        }

        const resData = await res.json();
        if (res.ok) {
          setData(Array.isArray(resData) ? resData : []);
          setHasUnsavedChanges(false);
        } else {
          setError(resData.error || 'Failed to load data.');
        }
      }
    } catch (err) {
      setError('Error connecting to backend database server.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('vs_token') || localStorage.getItem('token');
    
    let endpoint = '';
    if (activeTab === 'course_enrollments') endpoint = `${API_URL}/enrollments/guest/${id}/status`;
    else if (activeTab === 'course_enquiries') endpoint = `${API_URL}/enquiries/course/${id}/status`;
    else if (activeTab === 'demo_requests') endpoint = `${API_URL}/enquiries/demo/${id}/status`;
    else if (activeTab === 'internship_applications') endpoint = `${API_URL}/enquiries/internship/${id}/status`;
    else if (activeTab === 'campus_enquiries') endpoint = `${API_URL}/enquiries/campus/${id}/status`;

    if (!endpoint) return;

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
      } else {
        alert('Failed to update status.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating status.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const token = localStorage.getItem('vs_token') || localStorage.getItem('token');
    try {
      let endpoint = '';
      if (activeTab === 'course_enrollments') endpoint = `${API_URL}/enrollments/guest/${id}`;
      else if (activeTab === 'courses') endpoint = `${API_URL}/courses/${id}`;
      else if (activeTab === 'services') endpoint = `${API_URL}/services/${id}`;
      else if (activeTab === 'projects') endpoint = `${API_URL}/projects/${id}`;
      else if (activeTab === 'contact_messages') endpoint = `${API_URL}/contact/${id}`;
      else if (activeTab === 'course_enquiries') endpoint = `${API_URL}/enquiries/course/${id}`;
      else if (activeTab === 'demo_requests') endpoint = `${API_URL}/enquiries/demo/${id}`;
      else if (activeTab === 'internship_applications') endpoint = `${API_URL}/enquiries/internship/${id}`;
      else if (activeTab === 'campus_enquiries') endpoint = `${API_URL}/enquiries/campus/${id}`;

      if (!endpoint) { alert('Delete not supported for this section.'); return; }

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setData(data.filter(item => item.id !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to delete.');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting record.');
    }
  };

  const handleReorder = async (index, direction) => {
    if (!['courses', 'services', 'projects'].includes(activeTab)) return;

    const newData = [...data];
    if (direction === 'up' && index > 0) {
      const temp = newData[index - 1];
      newData[index - 1] = newData[index];
      newData[index] = temp;
    } else if (direction === 'down' && index < newData.length - 1) {
      const temp = newData[index + 1];
      newData[index + 1] = newData[index];
      newData[index] = temp;
    } else {
      return;
    }

    setData(newData);
    setHasUnsavedChanges(true);
  };

  const handleSaveOrder = async () => {
    const updates = data.map((item, idx) => ({ id: item.id, sort_order: idx + 1 }));
    const token = localStorage.getItem('vs_token') || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${activeTab}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        fetchTabContent(activeTab);
      } else {
        alert('Failed to save order');
      }
    } catch (e) {
      console.error('Save order failed', e);
    }
  };

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.studentName && item.studentName.toLowerCase().includes(term)) ||
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      (item.phone && item.phone.toLowerCase().includes(term)) ||
      (item.courseTitle && item.courseTitle.toLowerCase().includes(term)) ||
      (item.course && item.course.toLowerCase().includes(term)) ||
      (item.modeName && item.modeName.toLowerCase().includes(term)) ||
      (item.id && String(item.id).toLowerCase().includes(term)) ||
      (item.title && item.title.toLowerCase().includes(term))
    );
  });

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-600 border border-gray-200';
    const s = status.toLowerCase();
    if (s.includes('new') || s.includes('pending')) return 'bg-blue-50 text-blue-600 border border-blue-200';
    if (s.includes('confirm') || s.includes('enroll') || s.includes('active')) return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    if (s.includes('contacted') || s.includes('progress')) return 'bg-amber-50 text-amber-600 border border-amber-200';
    if (s.includes('cancel') || s.includes('inactive')) return 'bg-red-50 text-red-600 border border-red-200';
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '📊', group: 'MAIN' },
    
    { id: 'course_enquiries', label: 'Course Enquiries', icon: '📚', group: 'LEADS' },
    { id: 'demo_requests', label: 'Demo Requests', icon: '🎯', group: 'LEADS' },
    { id: 'internship_applications', label: 'Internships', icon: '💼', group: 'LEADS' },
    { id: 'campus_enquiries', label: 'Campus Enquiries', icon: '🏫', group: 'LEADS' },
    { id: 'contact_messages', label: 'Contact Messages', icon: '📬', group: 'LEADS' },

    { id: 'course_enrollments', label: 'Course Enrollments', icon: '⚡', group: 'ENROLLMENTS' },

    { id: 'courses', label: 'Manage Courses', icon: '📝', group: 'CONTENT' },
    { id: 'services', label: 'Manage Services', icon: '💻', group: 'CONTENT' },
    { id: 'projects', label: 'Manage Projects', icon: '🚀', group: 'CONTENT' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex sticky top-[88px] h-[calc(100vh-88px)] shadow-sm z-10">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#01155C] flex items-center gap-2">
            <span className="text-amber-500">⚡</span> Admin Portal
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase font-semibold tracking-wider">Vision Spark Solutions</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {['MAIN', 'LEADS', 'ENROLLMENTS', 'CONTENT'].map((group) => (
            <div key={group} className="mb-6">
              <div className="px-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group}</div>
              <ul className="space-y-1">
                {sidebarLinks.filter(l => l.group === group).map(link => (
                  <li key={link.id}>
                    <button
                      onClick={() => setActiveTab(link.id)}
                      className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                        activeTab === link.id
                          ? 'bg-amber-50 text-amber-600 border-r-4 border-amber-500 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#01155C]'
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.removeItem('vs_token');
              localStorage.removeItem('token');
              router.push('/admin/login');
            }}
            className="w-full py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-semibold text-sm rounded-xl transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-gray-50/50">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#01155C] capitalize">
              {sidebarLinks.find(l => l.id === activeTab)?.label}
            </h1>
          </div>
          
          {activeTab !== 'dashboard' && (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 w-64 transition-all duration-200 placeholder-gray-400 shadow-inner"
              />
              {['courses', 'services', 'projects'].includes(activeTab) && (
                <button
                  onClick={handleSaveOrder}
                  disabled={!hasUnsavedChanges}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm border ${
                    hasUnsavedChanges
                      ? 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600 animate-pulse'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title={hasUnsavedChanges ? 'Click to save the new order to the website' : 'Reorder using ▲▼ buttons, then save'}
                >
                  💾 Save Order {hasUnsavedChanges && '⚠️'}
                </button>
              )}
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 text-sm font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all duration-200"
              >
                ➕ Add New
              </button>
              <button
                onClick={() => fetchTabContent(activeTab)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:text-[#01155C] hover:bg-gray-200 transition-colors shadow-sm"
                title="Refresh"
              >
                🔄
              </button>
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2 shadow-sm">
              <span className="text-red-500">⚠️</span> {error}
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Enrollments</div>
                <div className="text-4xl font-extrabold text-[#01155C]">{stats.enrollments !== undefined ? stats.enrollments : '-'}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Course Enquiries</div>
                <div className="text-4xl font-extrabold text-amber-500">{stats.course_enquiries !== undefined ? stats.course_enquiries : '-'}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Demo Requests</div>
                <div className="text-4xl font-extrabold text-emerald-500">{stats.demo_requests !== undefined ? stats.demo_requests : '-'}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Active Courses</div>
                <div className="text-4xl font-extrabold text-[#01155C]">{stats.courses !== undefined ? stats.courses : '-'}</div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
              {loading ? (
                <div className="p-16 text-center text-gray-500 font-medium">Loading records...</div>
              ) : filteredData.length === 0 ? (
                <div className="p-16 text-center text-gray-500 font-medium bg-gray-50/50">
                  No records found for this category.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">ID & Date</th>
                        <th className="px-6 py-4">Primary Info</th>
                        <th className="px-6 py-4">Context / Topic</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData.map((row) => (
                        <tr key={row.id} className="hover:bg-blue-50/50 transition-colors group">
                          
                          {/* ID & Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-[#01155C] font-extrabold block">#{row.id}</span>
                            <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
                              {row.date || (row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recent')}
                            </span>
                          </td>

                          {/* Primary Info */}
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">
                              {row.studentName || row.name || row.contact_person || row.title || row.college_name || 'N/A'}
                            </div>
                            {(row.email || row.category) && (
                              <div className="text-gray-500 text-xs mt-0.5">{row.email || row.category}</div>
                            )}
                            {(row.phone || row.mobile || row.price) && (
                              <div className="text-emerald-600 font-mono font-bold text-xs mt-1 flex items-center gap-1">
                                {row.phone || row.mobile ? `📞 ${row.phone || row.mobile}` : `₹${row.price}`}
                              </div>
                            )}
                          </td>

                          {/* Context / Topic */}
                          <td className="px-6 py-4 max-w-[200px]">
                            <div className="font-semibold text-gray-800 truncate">
                              {row.courseTitle || row.course || row.technology || row.subject || (row.description ? 'Description' : 'General Enquiry')}
                            </div>
                            {(row.message || row.description || row.short_description || row.modeName || row.amountPaid) && (
                              <div className="text-gray-500 text-xs mt-1 line-clamp-2" title={row.message || row.description || row.short_description}>
                                {row.amountPaid && <span className="font-bold text-amber-600 mr-2">Paid: {row.amountPaid}</span>}
                                {row.message || row.short_description || row.description || row.modeName}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {['course_enrollments', 'course_enquiries', 'demo_requests', 'internship_applications', 'campus_enquiries'].includes(activeTab) ? (
                              <select
                                value={row.status || 'New'}
                                onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm transition-colors duration-200 ${getStatusColor(row.status || 'New')}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Enrolled">Enrolled</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm inline-block ${
                                  row.is_active || row.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}
                              >
                                {row.status || (row.is_active ? 'Active' : 'Inactive')}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              {['courses', 'services', 'projects'].includes(activeTab) && (
                                <div className="flex flex-col mr-2 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                  <button onClick={() => handleReorder(data.indexOf(row), 'up')} className="text-gray-500 hover:bg-gray-200 hover:text-[#01155C] px-2 py-0.5 text-[10px] transition-colors">▲</button>
                                  <button onClick={() => handleReorder(data.indexOf(row), 'down')} className="text-gray-500 hover:bg-gray-200 hover:text-[#01155C] px-2 py-0.5 text-[10px] border-t border-gray-200 transition-colors">▼</button>
                                </div>
                              )}
                              
                              <button
                                onClick={() => {
                                  setEditingItem(row);
                                  setIsModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 font-bold text-xs transition-all duration-200 shadow-sm"
                              >
                                Edit
                              </button>
                              
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 font-bold text-xs transition-all duration-200 shadow-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <AdminFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        initialData={editingItem}
        onSave={() => fetchTabContent(activeTab)}
      />
    </div>
  );
}
