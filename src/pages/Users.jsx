import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Users & Delivery</h1>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
          Total: {users.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={user._id} 
              className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{user.fullName}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {/* Fallback for created date if available in your API */}
                <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                  <Calendar size={12} />
                  <span>ID: {user._id.slice(-6)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;