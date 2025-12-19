import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Layouts
import AdminLayout from './layout/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import Users from './pages/Users';
import RestaurantDetails from './pages/RestaurantDetails';

// Loading Placeholder
const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  
  if (loading) return <LoadingScreen />;
  if (!admin) return <Navigate to="/login" replace />;
  
  return children;
};

// Public Route (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (admin) return <Navigate to="/" replace />;

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="restaurants/:id" element={<RestaurantDetails />} />
            <Route path="users" element={<Users />} />
            
            {/* Catch all for 404 inside layout */}
            <Route path="*" element={<div className="p-8 text-center text-slate-500">Page not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}