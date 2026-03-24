import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/admin-onboard.css';

const AdminOnboard = () => {
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    serviceArea: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data } = await api.get('/area');
        setAreas(data);
      } catch (err) {
        console.error('Failed to fetch areas');
      }
    };
    fetchAreas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await api.post('/admin/create-user', formData);
      setMessage('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'User', serviceArea: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Onboard New User</h1>
      
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
    </div>
  );
};

export default AdminOnboard;
