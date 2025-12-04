import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import BookingCalendar from '../components/BookingCalendar';
import AdminBookingCard from '../components/AdminBookingCard';

const AdminDashboardPage = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [stats, setStats] = useState({ 
    pending: 0, 
    confirmed: 0, 
    completed: 0, 
    cancelled: 0,
    total: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const bookingData = data || [];
      setBookings(bookingData);
      
      // Calculate stats
      const pendingCount = bookingData.filter(b => b.status === 'pending').length;
      const confirmedCount = bookingData.filter(b => b.status === 'confirmed').length;
      const completedCount = bookingData.filter(b => b.status === 'completed').length;
      const cancelledCount = bookingData.filter(b => b.status === 'cancelled').length;
      const totalRevenue = bookingData
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.payment_amount || 0), 0);

      setStats({
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
        total: bookingData.length,
        revenue: totalRevenue
      });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      alert('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date, dateBookings) => {
    setSelectedDate(date);
    setSelectedDateBookings(dateBookings);
    if (dateBookings.length > 0) {
      setActiveTab('calendar');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className="text-white text-2xl font-semibold">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-gray-700 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-40 h-40 bg-gray-600 rounded-full filter blur-2xl opacity-20 animate-ping"></div>
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-gray-700 rounded-full filter blur-2xl opacity-20 animate-ping"></div>
      
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md shadow-lg p-6 flex justify-between items-center sticky top-0 z-20 rounded-b-3xl">
        <div>
          <h1 className="text-3xl font-bold">🛡️ Welcome, Admin</h1>
        </div>
        <button 
          onClick={onLogout} 
          className="text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full shadow-lg font-semibold transition-all transform hover:scale-105"
        >
          Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 p-4 bg-black/70 backdrop-blur-md shadow-md mx-6 mt-6 rounded-3xl justify-center relative z-10">
        {[
          { id: 'overview', label: '📊 Overview', count: null },  
          { id: 'bookings', label: '📋 All Bookings', count: bookings.length },
          { id: 'calendar', label: '📅 Calendar', count: null }
        ].map(tab => (
          <button
            key={tab.id}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === tab 
              ? 'bg-gray-700 text-white shadow-xl scale-105' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        
        {/* ──────────────────────────────────────────────── */}
        {/* OVERVIEW TAB */}
        {/* ──────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

              <div className="bg-yellow-600/20 border-2 border-yellow-500 p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-yellow-300 font-semibold mb-2">⏳ Pending</h3>
                    <p className="text-4xl font-bold">{stats.pending}</p>
                  </div>
                  <div className="text-5xl">⏳</div>
                </div>
              </div>

              <div className="bg-green-600/20 border-2 border-green-500 p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-green-300 font-semibold mb-2">✅ Confirmed</h3>
                    <p className="text-4xl font-bold">{stats.confirmed}</p>
                  </div>
                  <div className="text-5xl">✅</div>
                </div>
              </div>

              <div className="bg-blue-600/20 border-2 border-blue-500 p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-300 font-semibold mb-2">🎉 Completed</h3>
                    <p className="text-4xl font-bold">{stats.completed}</p>
                  </div>
                  <div className="text-5xl">🎉</div>
                </div>
              </div>

              <div className="bg-red-600/20 border-2 border-red-500 p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-red-300 font-semibold mb-2">❌ Cancelled</h3>
                    <p className="text-4xl font-bold">{stats.cancelled}</p>
                  </div>
                  <div className="text-5xl">❌</div>
                </div>
              </div>

              <div className="bg-purple-600/20 border-2 border-purple-500 p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-purple-300 font-semibold mb-2">📦 Total Bookings</h3>
                    <p className="text-4xl font-bold">{stats.total}</p>
                  </div>
                  <div className="text-5xl">📦</div>
                </div>
              </div>

              <div className="bg-orange-600/20 border-2 border-orange-500 p-6 rounded-2xl backdrop-blur-md hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-orange-300 font-semibold mb-2">💰 Total Revenue</h3>
                    <p className="text-4xl font-bold">₱{stats.revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-5xl">💰</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────── */}
        {/* CALENDAR TAB */}
        {/* ──────────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div className="bg-gray-800/40 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <BookingCalendar bookings={bookings} onDateClick={handleDateClick} />

            {selectedDate && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">
                  Bookings for {formatDate(new Date(selectedDate))}
                </h2>

                {selectedDateBookings.length === 0 ? (
                  <p className="text-gray-300">No bookings for this date.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDateBookings.map((booking) => (
                      <AdminBookingCard 
                        key={booking.id}
                        booking={booking}
                        onUpdate={fetchBookings}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────── */}
        {/* ALL BOOKINGS TAB */}
        {/* ──────────────────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">All Bookings</h2>

            {bookings.length === 0 ? (
              <p className="text-gray-300">No bookings yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <AdminBookingCard 
                    key={booking.id}
                    booking={booking}
                    onUpdate={fetchBookings}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboardPage;
