import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const { admin, logout } = useContext(AuthContext);

  return (
    <div className="layout">
      {/* Sidebar is now static and always present */}
      <Sidebar />
      
      <div className="main-wrapper">
        <header style={{ 
          height: 'var(--header-height)', 
          background: 'white', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', // Aligns content to the right
          padding: '0 20px',
          position: 'fixed', top: 0, right: 0, 
          left: 'var(--sidebar-width)', // Header starts after sidebar
          zIndex: 40
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 600 }}>{admin?.fullName || 'Super Admin'}</span>
            <button onClick={logout} className="btn btn-outline" style={{ border: '1px solid #ddd', padding: '6px 12px' }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;