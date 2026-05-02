import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Landing       from './pages/Landing';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/Dashboard';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks         from './pages/Tasks';
import Users         from './pages/Users';

const AUTH_ROUTES = ['/', '/login', '/register'];

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  // Wrap authenticated pages with sidebar layout
  const AppLayout = ({ children }) => (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      {children}
    </div>
  );

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/:id" element={
        <ProtectedRoute><AppLayout><ProjectDetail /></AppLayout></ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute adminOnly><AppLayout><Users /></AppLayout></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
    </Routes>
  );
}
