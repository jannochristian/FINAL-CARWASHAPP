import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { supabase } from '../supabaseClient';

const BookingCard = ({ booking, refreshBookings }) => {
  const [loading, setLoading] = useState(false);

  const cancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) throw error;

      alert('Booking cancelled successfully');
      
      // Refresh bookings list
      if (refreshBookings) {
        await refreshBookings();
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/70 backdrop-blur-md text-white p-6 rounded-3xl shadow-2xl border border-gray-600 hover:scale-105 transform transition-all">
      <h3 className="font-semibold text-xl mb-2">{booking.service}</h3>
      <p className="text-gray-300 mb-1">{booking.vehicle} • {booking.plate}</p>
      <p className="text-gray-400 mb-1">📅 {booking.date} 🕐 {booking.time}</p>
      <p className="text-gray-400 mb-2">📍 {booking.location}</p>
      <p className="text-blue-400 font-bold text-lg mb-3">₱{booking.price}</p>

      <div className="mb-3">
        <StatusBadge status={booking.status} />
      </div>

      <div className="bg-gray-800/50 p-3 rounded-xl mb-3">
        <p className="text-sm text-gray-300">
          <span className="font-semibold">Payment:</span> {booking.payment_method}
        </p>
        <p className="text-sm text-gray-300">
          <span className="font-semibold">Amount:</span> ₱{booking.payment_amount}
        </p>
      </div>

      <button
        onClick={cancelBooking}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Cancelling...' : 'Cancel Booking'}
      </button>
    </div>
  );
};

export default BookingCard;