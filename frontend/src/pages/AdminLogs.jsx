import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate, getStatusColor, formatTime } from '../utils/helpers';
import '../styles/logs.css';

const AdminLogs = () => {
  const [logs, setLogs] = useState({ tickets: [], alerts: [] });
  const [activeTab, setActiveTab] = useState('tickets');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/admin/logs');
        setLogs(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch logs', error);
      }
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>System Logs</h1>
      {lastUpdated && (
        <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Last updated: {formatDate(lastUpdated)}
        </p>
      )}
      
      <div className="logs-container">
        <div className="logs-tabs">
          <button 
            className={`log-tab ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets ({logs.tickets.length})
          </button>
          <button 
            className={`log-tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            IoT Alerts ({logs.alerts.length})
          </button>
        </div>

        <div className="table-wrapper">
          {activeTab === 'tickets' ? (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Technician</th>
                  <th>Work Time</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {logs.tickets.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 500 }}>{t.deviceId}</td>
                    <td>{t.location}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(t.status) }}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.assignedTo ? t.assignedTo.name : 'Unassigned'}</td>
                    <td>{formatTime(t.totalWorkTimeMinutes)}</td>
                    <td>{formatDate(t.createdAt)}</td>
                  </tr>
                ))}
                {logs.tickets.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No tickets found</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Device ID</th>
                  <th>Location</th>
                  <th>Linked Ticket</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.alerts.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{a._id.substring(18)}</td>
                    <td style={{ fontWeight: 500 }}>{a.deviceId}</td>
                    <td>{a.location}</td>
                    <td>{a.ticketId ? 'Yes' : 'No'}</td>
                    <td>{formatDate(a.createdAt)}</td>
                  </tr>
                ))}
                {logs.alerts.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No alerts found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
