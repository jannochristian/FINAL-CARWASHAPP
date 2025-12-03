import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import BookingCard from '../components/BookingCard';
import ServiceCard from '../components/ServiceCard';

const DashboardPage = ({ user, bookings, services, onLogout, refreshBookings }) => {
  const [activeTab, setActiveTab] = useState('book');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const userBookings = bookings.filter(b => b.user_id === user.id);

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-gray-700 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-40 h-40 bg-gray-600 rounded-full filter blur-2xl opacity-20 animate-ping"></div>
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-gray-700 rounded-full filter blur-2xl opacity-20 animate-ping"></div>

      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md shadow-lg p-6 flex justify-between items-center sticky top-0 z-20 rounded-b-3xl">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          🚿 Welcome, {user.name}
        </h1>
        <button 
          onClick={onLogout} 
          className="text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full shadow-lg font-semibold transition-all transform hover:scale-105"
        >
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 p-4 bg-black/70 backdrop-blur-md shadow-md mx-6 mt-6 rounded-3xl justify-center relative z-10">
        {['book', 'bookings', 'services'].map(tab => (
          <button
            key={tab}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === tab 
              ? 'bg-gray-700 text-white shadow-xl scale-105' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'book' ? '📅 Book Service' : tab === 'bookings' ? `📋 My Bookings (${userBookings.length})` : '🧼 Services'}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="p-6 space-y-10 max-w-7xl mx-auto relative z-10">
        {/* Book Service */}
        {activeTab === 'book' && (
          <>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowBookingForm(!showBookingForm)} 
                className="bg-gray-700 text-white px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transform transition-all font-semibold"
              >
                {showBookingForm ? '❌ Cancel' : '➕ New Booking'}
              </button>
            </div>
            {showBookingForm && (
              <div className="bg-black/70 backdrop-blur-md rounded-3xl shadow-2xl p-6 mt-6 border border-gray-600">
                <BookingForm 
                  user={user} 
                  services={services} 
                  closeForm={() => setShowBookingForm(false)}
                  refreshBookings={refreshBookings}
                />
              </div>
            )}
          </>
        )}

        {/* My Bookings */}
        {activeTab === 'bookings' && (
          <div className="grid gap-6 md:grid-cols-2">
            {userBookings.length === 0 ? (
              <div className="bg-black/70 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center text-gray-300 font-medium text-lg">
                <p className="mb-4">You have no bookings yet!</p>
                <button 
                  onClick={() => setActiveTab('book')} 
                  className="bg-gray-700 text-white px-6 py-3 rounded-full shadow-xl hover:scale-105 transform transition-all font-semibold"
                >
                  Book Your First Service
                </button>
              </div>
            ) : (
              userBookings.map(b => (
                <BookingCard 
                  key={b.id} 
                  booking={b} 
                  refreshBookings={refreshBookings}
                />
              ))
            )}
          </div>
        )}

        {/* Services */}
        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-6">
            {services.map(s => (
              <div key={s.id} className="bg-black/70 backdrop-blur-md rounded-3xl shadow-2xl p-6 hover:scale-105 transform transition-all duration-300 border border-gray-600">
                <ServiceCard service={s} onBook={() => {
                  setActiveTab('book');
                  setShowBookingForm(true);
                }} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;