import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import BookingHistory from './pages/BookingHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';
import storage from './utils/storage';

function AppShell() {
  const location = useLocation();
  const [user, setUser] = React.useState(() => {
    try {
      const raw = storage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    storage.removeItem('token');
    storage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const linkClass = (path) =>
    [
      'px-3 py-2 rounded-lg text-sm font-semibold transition',
      'text-gray-700 hover:text-blue-700 hover:bg-blue-50',
      location.pathname === path ? 'bg-blue-50 text-blue-700 shadow-inner' : ''
    ].join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition inline-flex items-center gap-2"
              >
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white font-bold shadow-md">
                  SF
                </span>
                <span>Sports Facility Court Booking Platform</span>
              </Link>
              </div>
            <div className="flex items-center space-x-3">
              {user && (
                <Link to="/" className={linkClass('/')}>
                  Home
                </Link>
              )}
              {user && (
                <Link to="/history" className={linkClass('/history')}>
                  {user.role === 'admin' ? 'All Bookings' : 'My Bookings'}
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className={linkClass('/admin')}>
                  Admin
                </Link>
              )}
              {!user && (
                <>
                  <Link to="/login" className={linkClass('/login')}>
                    Login
                  </Link>
                  <Link to="/register" className={linkClass('/register')}>
                    Register
                  </Link>
                </>
              )}
              {user && (
                <div className="flex items-center space-x-2 pl-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 shadow-sm" aria-hidden />
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-white hover:bg-red-500 transition shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/history"
            element={
              <RequireAuth>
                <BookingHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth adminOnly>
                <AdminDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;

