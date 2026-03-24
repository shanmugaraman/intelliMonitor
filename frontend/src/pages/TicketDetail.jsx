import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatDate, getStatusColor, formatTime } from '../utils/helpers';
import '../styles/ticket-detail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedActive, setElapsedActive] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchTicket = async () => {
    try {
      const { data } = await api.get('/ticket/assigned');
      const t = data.find(t => t._id === id);
      if (t) setTicket(t);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch ticket detail', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    let interval;
    if (ticket && ticket.status === 'IN_PROGRESS') {
      const activeLog = ticket.workLogs.find(log => !log.endTime);
      if (activeLog) {
        interval = setInterval(() => {
          const start = new Date(activeLog.startTime).getTime();
          setElapsedActive(Math.floor((Date.now() - start) / 1000));
        }, 1000);
      }
    } else {
      setElapsedActive(0);
    }
    return () => clearInterval(interval);
  }, [ticket]);

  if (loading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  const handleStart = async () => {
    try {
      const { data } = await api.post('/ticket/start', { id });
      setTicket(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error starting work');
    }
  };

  const handleStop = async () => {
    try {
      const { data } = await api.post('/ticket/stop', { id });
      setTicket(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error stopping work');
    }
  };

  const handleResolve = async () => {
    try {
      const { data } = await api.post('/ticket/resolve', { id, notes });
      setTicket(data);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error resolving ticket');
    }
  };

  const h = String(Math.floor(elapsedActive / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsedActive % 3600) / 60)).padStart(2, '0');
  const s = String(elapsedActive % 60).padStart(2, '0');

  return (
    <div className="ticket-detail-view">
      <div className="back-link" onClick={() => navigate(-1)}>
        &larr; Back to Tickets
      </div>

      <div className="detail-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Ticket #{ticket._id.substring(18)}</h1>
            <span className="status-badge" style={{ backgroundColor: getStatusColor(ticket.status) }}>
              {ticket.status}
            </span>
          </div>
        </div>

        <div className="timer-section">
          {ticket.status !== 'RESOLVED' && (
            <>
              <div className="timer-display">
                {ticket.status === 'IN_PROGRESS' ? `${h}:${m}:${s}` : '00:00:00'}
              </div>
              <div className="timer-controls">
                <button 
                  className="control-btn btn-start" 
                  disabled={ticket.status === 'IN_PROGRESS'}
                  onClick={handleStart}
                >
                  Start Work
                </button>
                <button 
                  className="control-btn btn-stop" 
                  disabled={ticket.status !== 'IN_PROGRESS'}
                  onClick={handleStop}
                >
                  Stop Work
                </button>
                <button 
                  className="control-btn btn-resolve"
                  onClick={() => setIsModalOpen(true)}
                >
                  Resolve Issue
                </button>
              </div>
            </>
          )}
          {ticket.status === 'RESOLVED' && (
            <div style={{ color: 'var(--green)', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ✓ Ticket Resolved
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="info-group">
            <span className="info-label">Location</span>
            <span className="info-value">{ticket.location}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Device ID</span>
            <span className="info-value">{ticket.deviceId}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Created At</span>
            <span className="info-value">{formatDate(ticket.createdAt)}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Total Historic Work Time</span>
            <span className="info-value">{formatTime(ticket.totalWorkTimeMinutes)}</span>
          </div>
        </div>

        <div className="work-logs">
          <h3>Work Session History</h3>
          {ticket.workLogs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No sessions recorded yet.</p>
          ) : (
            ticket.workLogs.map((log, index) => (
              <div key={index} className="log-item">
                <div>
                  <strong>Session {index + 1}</strong>
                  <br/>
                  <span style={{ color: 'var(--text-secondary)' }}>Started: {formatDate(log.startTime)}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {log.endTime ? (
                    <>
                      <strong>{formatTime(log.durationMinutes)}</strong>
                      <br/>
                      <span style={{ color: 'var(--text-secondary)' }}>Ended: {formatDate(log.endTime)}</span>
                    </>
                  ) : (
                    <strong style={{ color: 'var(--primary)' }}>Active Now</strong>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Resolve Ticket</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Add any final notes about the resolution before closing this ticket.
            </p>
            <textarea 
              placeholder="Resolution notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="filter-btn" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="control-btn btn-resolve" 
                style={{ padding: '0.5rem 1.5rem' }}
                onClick={handleResolve}
              >
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
