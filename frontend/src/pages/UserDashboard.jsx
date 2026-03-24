import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../utils/authContext';
import { PlusCircle, MapPin, AlertCircle, Clock, CheckCircle, Send, Zap } from 'lucide-react';
import '../styles/app.css';

const UserDashboard = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [areas, setAreas] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchInitialData = async () => {
    try {
      const [ticketsRes, areasRes] = await Promise.all([
        api.get('/ticket'),
        api.get('/area')
      ]);
      setTickets(ticketsRes.data);
      setAreas(areasRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchInitialData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await api.post('/ticket', { description, location });
      setDescription('');
      setLocation('');
      setMessage({ type: 'success', text: 'Ticket submitted successfully!' });
      fetchInitialData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit ticket' });
    } finally {
      setSubmitting(false);
    }
  };

  const statusIcons = {
    'OPEN': <AlertCircle size={16} className="status-icon open" />,
    'ASSIGNED': <Clock size={16} className="status-icon assigned" />,
    'IN_PROGRESS': <Clock size={16} className="status-icon progress" />,
    'RESOLVED': <CheckCircle size={16} className="status-icon resolved" />
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Welcome, {user.name}</h1>
        <p>Report power outages or electrical issues in your area.</p>
      </header>

      <div className="dashboard-grid">
        <section className="card report-card">
          <div className="card-header">
            <PlusCircle size={20} />
            <h2>Report New Issue</h2>
          </div>
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label>Location / Area</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required 
                >
                  <option value="">Select Area</option>
                  {areas.map(area => (
                    <option key={area._id} value={area.name}>{area.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description of the Issue</label>
              <textarea 
                placeholder="Describe the problem in detail..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {message && (
              <div className={`message-banner ${message.type}`}>
                {message.text}
              </div>
            )}
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : <><Send size={18} /> Submit Report</>}
            </button>
          </form> 
        </section>

        <section className="card tickets-card">
          <div className="card-header">
            <AlertCircle size={20} />
            <h2>My Recent Reports</h2>
          </div>
          <div className="ticket-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <p>Loading your reports...</p>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p className="empty-state">No reports found.</p>
              </div>
            ) : (
              tickets.map(ticket => (
                  <div key={ticket._id} className="ticket-item" style={{ 
                    backgroundColor: 'var(--bg-color)', 
                    padding: '1.25rem', 
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    border: '1px solid var(--border-color)'
                  }}>
                  <div className="ticket-info">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{ticket.description}</h3>
                    <div className="ticket-meta" style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {ticket.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`status-badge ${ticket.status.toLowerCase()}`} style={{ 
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '9999px',
                    color: 'white',
                    backgroundColor: ticket.status === 'RESOLVED' ? 'var(--green)' : 
                                     ticket.status === 'IN_PROGRESS' ? 'var(--primary)' :
                                     ticket.status === 'ASSIGNED' ? 'var(--yellow)' : 'var(--text-secondary)'
                  }}>
                    {statusIcons[ticket.status]}
                    {ticket.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
