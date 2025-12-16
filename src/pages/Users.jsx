import { useEffect, useState } from 'react';
import api from '../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('customer');

  const fetchUsers = () => {
    // Calls GET /api/admin/users?userType=customer
    api.get(`/admin/users?userType=${role}`)
      .then(res => setUsers(res.data.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchUsers(); }, [role]);

  const toggleUser = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`, { isActive: !currentStatus });
      fetchUsers(); // Refresh list
    } catch(err) { alert("Failed"); }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1>User Management</h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className={`btn ${role === 'customer' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRole('customer')}>Customers</button>
            <button className={`btn ${role === 'delivery_partner' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRole('delivery_partner')}>Delivery Partners</button>
        </div>
      </div>

      <div className="grid-cols-1" style={{ display: 'grid', gap: '15px' }}>
        {users.map(user => (
            <div key={user._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0 }}>{user.fullName}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{user.email}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Phone: {user.phoneNumber || 'N/A'}</p>
                </div>
                <button 
                    className={user.isActive ? "btn btn-outline" : "btn btn-success"}
                    onClick={() => toggleUser(user._id, user.isActive)}
                    style={{ borderColor: user.isActive ? 'red' : 'green', color: user.isActive ? 'red' : 'white' }}
                >
                    {user.isActive ? "Block" : "Activate"}
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};
export default Users;