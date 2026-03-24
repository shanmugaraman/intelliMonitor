import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';
import { Zap, LayoutDashboard, FileText, UserPlus, LogOut, Wrench } from 'lucide-react';
import '../styles/app.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}>
          <Zap size={24} />
        </div>
        <span>IntelliPower</span>
      </div>

      <nav className="sidebar-nav">
        {user.role === 'Admin' ? (
          <>
            <NavLink to="/" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/logs" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={20} /> System Logs
            </NavLink>
            <NavLink to="/onboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UserPlus size={20} /> Onboard User
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <Wrench size={20} /> My Tickets
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
