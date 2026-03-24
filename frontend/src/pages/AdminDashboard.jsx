import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Ticket, Activity, CheckCircle, Clock, MapPin, List, TrendingUp, Zap } from 'lucide-react';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeTickets: 0,
    resolvedTickets: 0,
    avgResolutionTimeHours: 0,
    recentTickets: [],
    areaStats: [],
    techStats: []
  });

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/analytics');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-open';
      case 'ASSIGNED': return 'badge-assigned';
      case 'IN_PROGRESS': return 'badge-progress';
      case 'RESOLVED': return 'badge-resolved';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Ticket size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Tickets</div>
            <div className="stat-value">{stats.totalTickets}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Tickets</div>
            <div className="stat-value">{stats.activeTickets}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Resolved Tickets</div>
            <div className="stat-value">{stats.resolvedTickets}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Avg Resolution</div>
            <div className="stat-value">{stats.avgResolutionTimeHours}h</div>
          </div>
        </div>
      </div>

      <div className="analytics-row">
        <section className="card">
          <div className="card-title">
            <List size={20} />
            Recent Tickets
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Device / Issue</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{ticket.deviceId || 'Manual'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {ticket.description?.substring(0, 30)}...
                      </div>
                    </td>
                    <td>{ticket.location}</td>
                    <td><span className={`status-badge ${getStatusClass(ticket.status)}`}>{ticket.status}</span></td>
                    <td>{ticket.assignedTo?.name || '-'}</td>
                  </tr>
                ))}
                {stats.recentTickets.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No recent tickets</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-title">
            <MapPin size={20} />
            Area Breakdown
          </div>
          <div className="bar-container">
            {stats.areaStats.map(area => (
              <div key={area._id} className="bar-item">
                <div className="bar-header">
                  <span>{area._id}</span>
                  <span style={{ fontWeight: 600 }}>{area.count}</span>
                </div>
                <div className="bar-bg">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(area.count / stats.totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {stats.areaStats.length === 0 && <p>No data available</p>}
          </div>

          <div className="card-title" style={{ marginTop: '2rem' }}>
            <TrendingUp size={20} />
            Top Technicians
          </div>
          <div className="bar-container">
            {stats.techStats.map(tech => (
              <div key={tech._id} className="bar-item">
                <div className="bar-header">
                  <span>{tech.name}</span>
                  <span style={{ fontWeight: 600 }}>{tech.count}</span>
                </div>
              </div>
            ))}
            {stats.techStats.length === 0 && <p>No data available</p>}
          </div>
        </section>
      </div>
      
      <div className="dashboard-info" style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.75rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Zap size={24} style={{ color: 'var(--primary)' }} />
        <div>
          <h3>System Status</h3>
          <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            All core monitors are active. Analyzing real-time alerts from Madurai districts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
