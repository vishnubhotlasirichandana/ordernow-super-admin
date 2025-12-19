import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Store, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    api.get('/admin/restaurants?limit=1000')
      .then(res => {
        const data = res.data.data || [];
        const pending = data.filter(r => r.documents?.verificationStatus === 'pending').length;
        const approved = data.filter(r => r.documents?.verificationStatus === 'approved').length;
        const rejected = data.filter(r => r.documents?.verificationStatus === 'rejected').length;
        setStats({ total: data.length, pending, approved, rejected });
      })
      .catch(err => console.error(err));
  }, []);

  const StatCard = ({ title, count, icon: Icon, colorClass, bgClass }) => (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex items-center gap-4"
    >
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">{count}</h3>
        <p className="text-slate-500 font-medium">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard title="Total Restaurants" count={stats.total} icon={Store} bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard title="Pending Review" count={stats.pending} icon={Clock} bgClass="bg-amber-50" colorClass="text-amber-600" />
        <StatCard title="Approved" count={stats.approved} icon={CheckCircle} bgClass="bg-green-50" colorClass="text-green-600" />
        <StatCard title="Rejected" count={stats.rejected} icon={XCircle} bgClass="bg-red-50" colorClass="text-red-600" />
      </motion.div>
    </div>
  );
};
export default Dashboard;