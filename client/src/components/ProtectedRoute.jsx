import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" aria-label="Loading" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="page-center">
        <div className="empty-state">
          <h2>Admin access required</h2>
          <p>This area is only available to administrators.</p>
          <a className="button primary" href="/dashboard">
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
