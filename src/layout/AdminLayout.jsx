import { useState, useContext } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Store, Users, LogOut, Menu, Sun, Moon } from 'lucide-react';

export default function AdminLayout() {
  const { admin, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme(); 
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/restaurants', icon: Store, label: 'Pending Verifications' }, // Updated Label
    { to: '/users', icon: Users, label: 'Users & Delivery' },
  ];

  return (
    <div className="flex h-screen bg-surface dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      
      {/* 📱 MOBILE OVERLAY (Click to close sidebar) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 📱 RESPONSIVE SIDEBAR */}
      <motion.aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 
          bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 
          shadow-2xl lg:shadow-none 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-primary">
              OrderNow<span className="text-slate-800 dark:text-white">Admin</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)} // Close sidebar on click (mobile)
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary/10 text-primary-600 dark:text-primary-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'}
                `}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={18} /> 
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* 📱 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        
        {/* Mobile Header (Hamburger Menu) */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800 dark:text-white">
             {navItems.find(i => i.to === location.pathname)?.label || 'Dashboard'}
          </span>
          <div className="w-8" /> {/* Spacer to center title */}
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}