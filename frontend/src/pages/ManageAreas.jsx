import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { MapPin, Plus, Trash2, AlertCircle } from 'lucide-react';
import '../styles/app.css';

const ManageAreas = () => {
  const [areas, setAreas] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchAreas = async () => {
    try {
      const { data } = await api.get('/area');
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAddArea = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post('/area', { name, description });
      setName('');
      setDescription('');
      setMessage({ type: 'success', text: 'Area added successfully!' });
      fetchAreas();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add area' });
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm('Are you sure you want to delete this area?')) return;
    try {
      await api.delete(`/area/${id}`);
      fetchAreas();
    } catch (error) {
      alert('Failed to delete area');
    }
  };

  return (
    <div className="manage-areas-container">
      <header className="page-header">
        <h1>Manage Service Areas</h1>
        <p>Define and manage the regions served by the platform.</p>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <section className="card">
          <div className="card-header">
            <Plus size={20} />
            <h2>Add New Area</h2>
          </div>
          <form onSubmit={handleAddArea} className="report-form">
            <div className="form-group">
              <label>Area Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Area_F"
                required 
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe the area..."
              />
            </div>
            {message && (
              <div className={`message-banner ${message.type}`}>
                {message.text}
              </div>
            )}
            <button type="submit" className="login-btn">Add Area</button>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <MapPin size={20} />
            <h2>Existing Areas</h2>
          </div>
          <div className="area-list">
            {loading ? (
              <p>Loading areas...</p>
            ) : areas.length === 0 ? (
              <p>No areas defined.</p>
            ) : (
              <table className="logs-table" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map(area => (
                    <tr key={area._id}>
                      <td><div style={{fontWeight: 600}}>{area.name}</div></td>
                      <td>{area.description}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteArea(area._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageAreas;
