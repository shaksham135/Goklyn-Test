import React, { useState, useEffect } from 'react';
import { FiGrid, FiMessageSquare, FiBriefcase, FiRefreshCw, FiMenu, FiX } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import CrudTable from '../components/admin/CrudTable';

const sections = [
  { id: 'projects', label: 'Projects', icon: <FiGrid /> },
  { id: 'testimonials', label: 'Testimonials', icon: <FiMessageSquare /> },
  { id: 'internships', label: 'Internships', icon: <FiBriefcase /> },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('projects');
  const [showAnim, setShowAnim] = useState(true);
  useEffect(() => {
    setShowAnim(true);
  }, [activeSection]);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formState, setFormState] = useState({
    projects: { show: false, selectedItem: null },
    testimonials: { show: false, selectedItem: null },
    internships: { show: false, selectedItem: null }
  });

  const handleFormState = (section, updates) => {
    setFormState(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="admin-layout">
      {/* Hamburger for mobile */}
      <button
        className={`sidebar-toggle${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FiMenu />
      </button>
      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`sidebar${sidebarOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="admin-title">Admin</h1>
          {/* Close button for mobile */}
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>
        <AdminSidebar
          sections={sections}
          activeSection={activeSection}
          setActiveSection={(id) => {
            setActiveSection(id);
            setSidebarOpen(false); // Auto-close on selection (mobile)
          }}
        />
      </div>

      <div className="admin-dashboard-main" style={{flex:1, minHeight:'100vh', background:'#f8fafc', transition:'margin-left 0.3s', marginLeft: sidebarOpen ? 0 : 0}}>
        {/* Changed Dashboard to Admin in section header */}
        <div className="dashboard-header" style={{position:'sticky',top:0,zIndex:20,background:'#fff',borderBottom:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
          <div className="header-content">
            <h2 className="admin-h2"><span style={{fontSize:'1.4rem'}}>{sections.find(s => s.id === activeSection)?.icon}</span> Admin - {sections.find(s => s.id === activeSection)?.label}</h2>
            <button className="btn btn-outline-primary btn-sm" style={{marginLeft:'20px'}} onClick={refreshData}><FiRefreshCw /> Refresh</button>
          </div>
        </div>
        <div
          key={activeSection}
          className={showAnim ? "dashboard-section-anim" : ""}
          style={{padding:'32px 24px 24px 24px', minHeight:'calc(100vh - 70px)'}}
          onAnimationEnd={() => setShowAnim(false)}
        >
          <CrudTable section={activeSection} formState={formState[activeSection]} onFormStateChange={(updates) => handleFormState(activeSection, updates)} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .admin-layout {
            display: flex;
            min-height: 100vh;
            background-color: #f5f7fa;
          }

          .sidebar {
            width: 250px;
            background: #2c3e50;
            color: white;
            padding: 20px 0;
            transition: width 0.2s, transform 0.3s cubic-bezier(0.4,0,0.2,1);
            position: relative;
            z-index: 1000;
          }
          @media (max-width: 900px) {
            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              height: 100vh;
              transform: translateX(-100%);
              z-index: 9998;
              width: 80vw;
              max-width: 320px;
              box-shadow: 2px 0 16px rgba(44,62,80,0.18);
            }
            .sidebar.mobile-open {
              transform: translateX(0);
              z-index: 9998;
            }
          }

          .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid #3e4e60;
            margin-bottom: 20px;
          }

          .sidebar-header h1 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            padding: 10px 0;
          }

          .main-content {
            flex: 1;
            overflow-x: auto;
            background: #ffffff;
            padding: 20px;
            transition: padding 0.2s;
          }

          .admin-header {
            background: #f8fafc;
            padding: 15px 25px;
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: padding 0.2s;
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
          }

          .admin-h2 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 600;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 0;
            margin-bottom: 15px;
            transition: font-size 0.2s;
          }

          .refresh-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #3498db;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s, font-size 0.2s, padding 0.2s;
          }

          .refresh-btn:hover {
            background: #2980b9;
          }

          .refresh-btn:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
          }

          .dashboard-section-anim {
            animation: fadeScaleSlideIn 0.6s cubic-bezier(.22,1,.36,1);
          }
          @keyframes fadeScaleSlideIn {
            0% {
              opacity: 0;
              transform: scale(0.96) translateY(60px);
            }
            60% {
              opacity: 0.7;
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .sidebar-toggle {
            display: none;
            position: fixed;
            top: 18px;
            left: 18px;
            z-index: 10000;
            background: #3498db;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 14px;
            font-size: 24px;
            box-shadow: 0 2px 8px rgba(44,62,80,0.14);
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s;
            outline: none;
          }
          .sidebar-toggle:active,
          .sidebar-toggle.open {
            background: #2980b9;
          }

          .sidebar-close {
            display: none;
            background: none;
            border: none;
            color: #fff;
            font-size: 2rem;
            position: absolute;
            top: 16px;
            right: 12px;
            z-index: 9999;
            cursor: pointer;
            outline: none;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.22);
            z-index: 9997;
            animation: fadeIn 0.2s;
            pointer-events: auto;
          }
          .sidebar-overlay:not(:has(+ .sidebar.mobile-open)) {
            display: none;
            pointer-events: none;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @media (max-width: 900px) {
            .sidebar-toggle {
              display: block;
            }
            .sidebar-close {
              display: block;
            }
          
            .admin-main {
              padding: 10px;
            }
            .main-content {
              padding: 10px;
            }
            .admin-header {
              padding: 10px 12px;
            }
          }

          @media (max-width: 768px) {
            .admin-layout {
              flex-direction: column;
            }
            .sidebar {
              width: 100%;
              padding: 10px 0;
              border-bottom: 1px solid #3e4e60;
            }
            .main-content {
              padding: 8px;
            }
            .header-content {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }
          }

          @media (max-width: 600px) {
            .admin-h2 {
              font-size: 1.1rem;
              padding: 6px 0;
            }
            .sidebar-header h1 {
              font-size: 1.1rem;
              padding: 6px 0;
            }
            .refresh-btn {
              font-size: 0.8rem;
              padding: 4px 8px;
            }
            .admin-header {
              padding: 8px 6px;
            }
            .admin-main {
              padding: 5px;
            }
            .main-content {
              padding: 4px;
            }
          }
        `
      }} />
    </div>
  );
};

export default AdminDashboard;
