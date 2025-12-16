import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState(''); // Default to '' (All Statuses)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [filter, page]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // If filter is empty string, backend returns all statuses
      const res = await api.get(`/admin/restaurants?status=${filter}&page=${page}&limit=10`);
      setRestaurants(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1>Restaurants</h1>
        
        {/* FILTER DROPDOWN */}
        <select 
          value={filter} 
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          style={{ width: 'auto', padding: '10px', minWidth: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Verification</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <div className="grid-cols-1" style={{ display: 'grid', gap: '15px' }}>
          {restaurants.length === 0 ? (
            <div className="card">No restaurants found.</div>
          ) : (
            restaurants.map((rest) => (
              <div key={rest._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{rest.restaurantName}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Owner: {rest.ownerFullName}</p>
                  <div style={{ marginTop: '5px' }}>
                    <span className={`badge ${rest.documents?.verificationStatus || 'pending'}`}>
                      {rest.documents?.verificationStatus || 'Unknown'}
                    </span>
                    {rest.isActive ? 
                      <span className="badge approved" style={{ marginLeft: '10px' }}>Active</span> : 
                      <span className="badge rejected" style={{ marginLeft: '10px' }}>Inactive</span>
                    }
                  </div>
                </div>
                <Link to={`/restaurants/${rest._id}`}>
                  <button className="btn btn-primary">Manage</button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-outline">Prev</button>
        <span style={{ display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-outline">Next</button>
      </div>
    </div>
  );
};
export default Restaurants;