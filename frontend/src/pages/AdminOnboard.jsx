import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/admin-onboard.css';

const AdminOnboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Technician',
    serviceArea: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await api.post('/admin/create-user', formData);
      setMessage('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'Technician', serviceArea: '' });
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
            </select>
          </div>
          
          {formData.role === 'Technician' && (
            <div className="form-group">
              <label>Service Area (Optional)</label>
              <input 
                type="text" 
                value={formData.serviceArea} 
                onChange={e => setFormData({...formData, serviceArea: e.target.value})} 
                placeholder="e.g. Area_A"
              />
            </div>
          )}
          
          <button type="submit" className="login-btn" style={{ marginTop: '0.5rem' }}>Create User</button>
        </form>
      </div>
    </div>
  );
};

export default AdminOnboard;
