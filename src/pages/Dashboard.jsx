import { useEffect, useState } from 'react';
import api from '../api/axios';
import { FaStore, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    // Fetch all restaurants to calculate stats since backend doesn't have a specific stats endpoint
    api.get('/admin/restaurants?limit=1000') // Fetch plenty for stats
      .then(res => {
        const data = res.data.data;
        // Logic to count based on documents verification status
        const pending = data.filter(r => r.documents?.verificationStatus === 'pending').length;
        const approved = data.filter(r => r.documents?.verificationStatus === 'approved').length;
        const rejected = data.filter(r => r.documents?.verificationStatus === 'rejected').length;
        setStats({ total: data.length, pending, approved, rejected });
      })
      .catch(err => console.error(err));
  }, []);

  const StatCard = ({ title, count, icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ background: color, padding: '15px', borderRadius: '50%', color: 'white', display: 'flex' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)' }}>{count}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{title}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard Overview</h1>
      <div className="grid-cols-1 grid-cols-4" style={{ display: 'grid', gap: '20px' }}>
        <StatCard title="Total Restaurants" count={stats.total} icon={<FaStore size={24} />} color="#3b82f6" />
        <StatCard title="Pending Review" count={stats.pending} icon={<FaClock size={24} />} color="#eab308" />
        <StatCard title="Approved" count={stats.approved} icon={<FaCheckCircle size={24} />} color="#22c55e" />
        <StatCard title="Rejected" count={stats.rejected} icon={<FaTimesCircle size={24} />} color="#ef4444" />
      </div>
    </div>
  );
};
export default Dashboard;