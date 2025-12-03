import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashBoardPage';
import { supabase } from './supabaseClient';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch bookings when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error.message);
      alert('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBookings([]);
    setCurrentPage('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} goSignUp={() => setCurrentPage('signup')} />
      )}

      {currentPage === 'signup' && (
        <SignUpPage goLogin={() => setCurrentPage('login')} />
      )}

      {currentPage === 'dashboard' && currentUser && (
        <DashboardPage
          user={currentUser}
          bookings={bookings}
          setBookings={setBookings}
          services={services}
          onLogout={handleLogout}
          refreshBookings={fetchBookings}
        />
      )}
    </div>
  );
};

export default App;