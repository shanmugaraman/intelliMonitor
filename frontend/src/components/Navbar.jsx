import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';
import { Zap } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Zap size={24} />
        Intelli Power
      </Link>

      <div className="nav-links">
        {user.role === 'Admin' && (
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/logs" className="nav-link">Logs</Link>
            <Link to="/onboard" className="nav-link">Onboard User</Link>
          </>
        )}
        {user.role === 'Technician' && (
          <>
            <Link to="/" className="nav-link">My Tickets</Link>
          </>
        )}
      </div>

      <div className="nav-links">
        <div className="nav-user">
          <span className="nav-user-name">{user.name}</span>
          <span className="nav-user-role">{user.role}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
