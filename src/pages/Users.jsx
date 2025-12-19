import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Truck } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'delivery_partner'

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch based on the active tab role
      const res = await api.get(`/admin/users?userType=${activeTab}`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    if(!window.confirm(`Are you sure you want to ${currentStatus ? 'block' : 'activate'} this user?`)) return;
    try {
      await api.patch(`/admin/users/${id}/toggle-active`, { isActive: !currentStatus });
      fetchUsers(); // Refresh list
    } catch(err) { alert("Failed to update status"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users & Delivery</h1>
        
        {/* Tabs */}
        <div className="flex p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('customer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'customer' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <User size={16} /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('delivery_partner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'delivery_partner' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Truck size={16} /> Delivery Partners
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading {activeTab === 'customer' ? 'Customers' : 'Partners'}...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.length === 0 ? (
             <div className="col-span-full text-center py-10 text-slate-500 dark:text-slate-400">No users found in this category.</div>
          ) : (
            users.map((user, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={user._id} 
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-700 pb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary/10 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {activeTab === 'customer' ? <User size={20} /> : <Truck size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">{user.fullName}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{user.isActive ? 'Active' : 'Blocked'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{user.phoneNumber || 'No Phone'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => toggleUserStatus(user._id, user.isActive)}
                  className={`mt-2 w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                    user.isActive 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                  }`}
                >
                  {user.isActive ? 'Block User' : 'Activate User'}
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Users;