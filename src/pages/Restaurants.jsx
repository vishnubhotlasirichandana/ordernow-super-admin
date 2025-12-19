import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [filter, page]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/restaurants?status=${filter}&page=${page}&limit=10`);
      setRestaurants(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Restaurants</h1>
        <div className="relative">
          <select 
            value={filter} 
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="w-full sm:w-64 appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary cursor-pointer shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Responsive Grid/List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {restaurants.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
              No restaurants found.
            </div>
          ) : (
            restaurants.map((rest, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={rest._id} 
                className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{rest.restaurantName}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${rest.documents?.verificationStatus === 'approved' ? 'bg-green-100 text-green-700' : 
                        rest.documents?.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {rest.documents?.verificationStatus || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">Owner: {rest.ownerFullName}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${rest.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${rest.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                    {rest.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <Link to={`/restaurants/${rest._id}`}>
                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-primary transition-colors">
                      Manage
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)} 
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-slate-600">Page {page} of {totalPages}</span>
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(p => p + 1)} 
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default Restaurants;