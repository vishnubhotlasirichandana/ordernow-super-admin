import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import AdminLayout from './layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Users from './pages/Users';
import './styles/App.css';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!admin) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="restaurants/:id" element={<RestaurantDetails />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;