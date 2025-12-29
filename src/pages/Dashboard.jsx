import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Store, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api.get('/admin/restaurants?limit=1000')
      .then(res => {
        const data = res.data.data || [];
        setRestaurants(data);
        
        // Calculate stats based on isEmailVerified
        const total = data.length;
        const approved = data.filter(r => r.isEmailVerified === true).length;
        const pending = data.filter(r => !r.isEmailVerified).length;
        
        // Note: Rejected applications are deleted, so they won't appear here usually,
        // unless we keep soft-deleted records (which the current backend deletes permanently).
        // We'll calculate rejected if your backend preserves them, otherwise it's 0.
        const rejected = 0; 

        setStats({ total, pending, approved, rejected });
      })
      .catch(err => console.error(err));
  }, []);

  const StatCard = ({ title, count, icon: Icon, bgClass, darkBgClass, colorClass }) => (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 flex items-center gap-4"
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

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">All Restaurants</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Owner</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {restaurants.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{r.restaurantName}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{r.ownerFullName}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase 
                                    ${r.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                                `}>
                                    {r.isEmailVerified ? 'Approved' : 'Pending'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <Link to={`/restaurants/${r._id}`} className="text-primary hover:underline text-sm font-semibold">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {restaurants.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-6 text-slate-400">No data available</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;