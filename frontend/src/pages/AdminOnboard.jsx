import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/admin-onboard.css';

const AdminOnboard = () => {
  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    serviceArea: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [areasRes, usersRes] = await Promise.all([
          api.get('/area'),
          api.get('/admin/users')
        ]);
        setAreas(areasRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to fetch initial onboarding data');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await api.post('/admin/create-user', formData);
      setMessage('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'User', serviceArea: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Onboard New User</h1>
      
      <div className="onboard-layout">
        <div className="onboard-container">
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="onboard-form auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Initial Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="Technician">Technician</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            {formData.role === 'Technician' && (
              <div className="form-group">
                <label>Service Area (Optional)</label>
                <select
                  value={formData.serviceArea}
                  onChange={e => setFormData({...formData, serviceArea: e.target.value})}
                >
                  <option value="">Select Area</option>
                  {areas.map(area => (
                    <option key={area._id} value={area.name}>{area.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="login-btn" style={{ marginTop: '0.5rem' }}>Create User</button>
          </form>
        </div>

        <div className="onboard-users-panel">
          <div className="onboard-users-header">
            <h2>Onboarded Users</h2>
            <span>{users.length}</span>
          </div>

          {loadingUsers ? (
            <p className="users-empty">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="users-empty">No users available.</p>
          ) : (
            <div className="users-list">
              {users.map((user) => (
                <div key={user._id} className="user-item">
                  <div className="user-main">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="user-meta">
                    <span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span>
                    {user.serviceArea ? <small>{user.serviceArea}</small> : <small>General</small>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOnboard;
