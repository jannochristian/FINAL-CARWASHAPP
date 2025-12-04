import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashBoardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSignUpPage from './pages/AdminSignUpPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { supabase } from './supabaseClient';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch bookings when user or admin logs in
  useEffect(() => {
    if (currentUser || currentAdmin) {
      fetchBookings();
    }
  }, [currentUser, currentAdmin]);

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

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleAdminLogin = (admin) => {
    setCurrentAdmin(admin);
    setCurrentPage('admin-dashboard');
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    setBookings([]);
    setCurrentPage('home');
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    setBookings([]);
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Home/Landing Page
  if (currentPage === 'home') {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-gray-900 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-gray-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

        {/* Landing Content */}
        <div className="relative z-10 text-center space-y-8 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Carwash Booking System
          </h1>
          <p className="text-xl text-blue-300 mb-8">
            Professional car care at your fingertips
          </p>

          {/* User/Customer Section */}
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl border-2 border-gray-700 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Customer Portal</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all hover:scale-105"
              >
                Customer Login
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all hover:scale-105"
              >
                Customer Sign Up
              </button>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-blue-900/50 backdrop-blur-md p-8 rounded-3xl border-2 border-blue-500/50">
            <h2 className="text-2xl font-bold text-white mb-4">🔐 Admin Portal</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('admin-login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all hover:scale-105"
              >
                Admin Login
              </button>
              <button
                onClick={() => setCurrentPage('admin-signup')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all hover:scale-105"
              >
                Create Admin Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Customer Routes */}
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleUserLogin} 
          goSignUp={() => setCurrentPage('signup')}
          goHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'signup' && (
        <SignUpPage 
          goLogin={() => setCurrentPage('login')}
          goHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'dashboard' && currentUser && (
        <DashboardPage
          user={currentUser}
          bookings={bookings}
          setBookings={setBookings}
          services={services}
          onLogout={handleUserLogout}
          refreshBookings={fetchBookings}
        />
      )}

      {/* Admin Routes */}
      {currentPage === 'admin-login' && (
        <AdminLoginPage 
          onLogin={handleAdminLogin} 
          goSignUp={() => setCurrentPage('admin-signup')}
          goHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'admin-signup' && (
        <AdminSignUpPage 
          goLogin={() => setCurrentPage('admin-login')}
          goHome={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'admin-dashboard' && currentAdmin && (
        <AdminDashboardPage
          admin={currentAdmin}
          bookings={bookings}
          refreshBookings={fetchBookings}
          onLogout={handleAdminLogout}
        />
      )}
    </div>
  );
};

export default App;