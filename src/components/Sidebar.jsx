import { NavLink } from 'react-router-dom';
import { FaChartPie, FaStore, FaUsers } from 'react-icons/fa';

const Sidebar = () => { 
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8 }}></div>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>OrderNow <span style={{ color: 'var(--primary)' }}>Admin</span></h2>
      </div>

      <nav>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaChartPie /> Dashboard
        </NavLink>
        <NavLink to="/restaurants" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaStore /> Restaurants
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaUsers /> Users & Delivery
        </NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;