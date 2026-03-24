import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getStatusColor, formatTime } from '../utils/helpers';
import { Clock, Filter, CheckCircle, Activity, AlertCircle } from 'lucide-react';
import '../styles/technician.css';

const TechnicianTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/ticket/assigned');
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch assigned tickets', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000); // Auto-refresh every 3s
    return () => clearInterval(interval);
  }, []);

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  // Status counts
  const counts = {
    ALL: tickets.length,
    OPEN: tickets.filter(t => t.status === 'OPEN').length,
    ASSIGNED: tickets.filter(t => t.status === 'ASSIGNED').length,
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>My Field Tickets</h1>
      
      <div className="filter-bar">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          <Filter size={16} /> ALL ({counts.ALL})
        </button>
        <button 
          className={`filter-btn ${filter === 'OPEN' ? 'active' : ''}`}
          onClick={() => setFilter('OPEN')}
        >
          <AlertCircle size={16} /> OPEN ({counts.OPEN})
        </button>
        <button 
          className={`filter-btn ${filter === 'IN_PROGRESS' ? 'active' : ''}`}
          onClick={() => setFilter('IN_PROGRESS')}
        >
          <Activity size={16} /> WORKING ({counts.IN_PROGRESS})
        </button>
        <button 
          className={`filter-btn ${filter === 'RESOLVED' ? 'active' : ''}`}
          onClick={() => setFilter('RESOLVED')}
        >
          <CheckCircle size={16} /> DONE ({counts.RESOLVED})
        </button>
      </div>

      <div className="ticket-grid">
        {filteredTickets.map(ticket => (
          <div 
            key={ticket._id} 
            className="ticket-card"
            onClick={() => navigate(`/ticket/${ticket._id}`)}
          >
            <div className="ticket-header">
              <span className="ticket-id">#{ticket._id.substring(18)}</span>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(ticket.status) }}>
                {ticket.status}
              </span>
            </div>
            
            <div className="ticket-body">
              <div className="ticket-location">{ticket.location}</div>
              <div className="ticket-device" style={{ marginBottom: '0.5rem' }}>
                {ticket.deviceId ? `Device: ${ticket.deviceId}` : 'Manual Report'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ticket.description}
              </div>
            </div>
            
            <div className="ticket-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} />
                <span>{formatTime(ticket.totalWorkTimeMinutes)}</span>
              </div>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Action &rarr;</span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTickets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--card-bg)', borderRadius: '0.75rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No tickets match the selected filter.</h3>
        </div>
      )}
    </div>
  );
};

export default TechnicianTickets;
