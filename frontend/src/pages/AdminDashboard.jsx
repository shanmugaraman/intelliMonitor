import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Ticket, Activity, CheckCircle, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getStatusColor } from '../utils/helpers';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeTickets: 0,
    resolvedTickets: 0,
    avgResolutionTimeHours: 0,
    statusDistribution: [],
    locationDistribution: [],
    recentTickets: []
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

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Dashboard Overview</h1>
      
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
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Tickets by Status</h3>
          <div style={{ height: 300 }}>
            {stats.statusDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)'}}>No Data</div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Top Incident Locations</h3>
          <div style={{ height: 300 }}>
            {stats.locationDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.locationDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="Tickets" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
              <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)'}}>No Data</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
