import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import storage from '../utils/storage';

export default function RequireAuth({ children, adminOnly = false }) {
  const location = useLocation();
  const user = React.useMemo(() => {
    try {
      const raw = storage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  if (!user) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname, error: 'Please login to continue' }} />
    );
  }
  if (adminOnly && user.role !== 'admin') {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname, error: 'Admin access required' }} />
    );
  }
  return children;
}
