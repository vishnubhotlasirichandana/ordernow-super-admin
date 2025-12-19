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

  const StatCard = ({ title, count, icon: Icon, colorClass, bgClass, darkBgClass }) => (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors"
    >
      <div className={`p-4 rounded-xl ${bgClass} ${darkBgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{count}</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard title="Total Restaurants" count={stats.total} icon={Store} bgClass="bg-blue-50" darkBgClass="dark:bg-blue-900/20" colorClass="text-blue-600 dark:text-blue-400" />
        <StatCard title="Pending Review" count={stats.pending} icon={Clock} bgClass="bg-amber-50" darkBgClass="dark:bg-amber-900/20" colorClass="text-amber-600 dark:text-amber-400" />
        <StatCard title="Approved" count={stats.approved} icon={CheckCircle} bgClass="bg-green-50" darkBgClass="dark:bg-green-900/20" colorClass="text-green-600 dark:text-green-400" />
        <StatCard title="Rejected" count={stats.rejected} icon={XCircle} bgClass="bg-red-50" darkBgClass="dark:bg-red-900/20" colorClass="text-red-600 dark:text-red-400" />
      </motion.div>
    </div>
  );
};
export default Dashboard;