import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthContext } from './utils/authContext';
import { Zap } from 'lucide-react';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogs from './pages/AdminLogs';
import AdminOnboard from './pages/AdminOnboard';
import TechnicianTickets from './pages/TechnicianTickets';
import TicketDetail from './pages/TicketDetail';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-wrapper">
      <header className="mobile-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <div className="mobile-logo">
          <Zap size={24} />
          <span>IntelliPower</span>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <main className="main-content">
        <Routes>
          {user.role === 'Admin' ? (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/logs" element={<AdminLogs />} />
              <Route path="/onboard" element={<AdminOnboard />} />
            </>
          ) : (
            <>
              <Route path="/" element={<TechnicianTickets />} />
              <Route path="/ticket/:id" element={<TicketDetail />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppContent;
