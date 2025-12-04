import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminBookingCard = ({ booking, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    const statusText =
      newStatus === 'confirmed'
        ? 'accept'
        : newStatus === 'cancelled'
        ? 'decline'
        : newStatus === 'completed'
        ? 'mark as completed'
        : 'update';

    if (!window.confirm(`Are you sure you want to ${statusText} this booking?`)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      alert(`Booking ${statusText}ed successfully!`);
      onUpdate && onUpdate();
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    confirmed: 'bg-green-500/20 text-green-300 border-green-500',
    completed: 'bg-blue-500/20 text-blue-300 border-blue-500',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500'
  };

  const statusIcons = {
    pending: '⏳',
    confirmed: '✅',
    completed: '🎉',
    cancelled: '❌'
  };

  return (
    <div className="bg-black/70 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-xl text-white">{booking.service}</h3>
          <p className="text-gray-400 text-sm">Customer: {booking.user_name}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusColors[booking.status]}`}
        >
          <span>{statusIcons[booking.status]}</span>
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-gray-300 text-sm">
        <p>🚗 {booking.vehicle} • {booking.plate}</p>
        <p>📅 {booking.date} • 🕐 {booking.time}</p>
        <p>📍 {booking.location}</p>
        <p className="text-blue-400 font-bold text-lg">💰 ₱{booking.price}</p>

        {/* PAYMENT */}
        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
          <p className="font-semibold text-white mb-1">Payment Details:</p>
          <p>Method: {booking.payment_method}</p>
          <p>Amount Paid: ₱{booking.payment_amount}</p>

          <span
            className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
              booking.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-green-500/20 text-green-300'
            }`}
          >
            {booking.status === 'pending' ? 'Payment Pending' : 'Payment Received'}
          </span>
        </div>
      </div>

      {/* BUTTONS */}
      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusUpdate('confirmed')}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
          >
            ✓ Accept
          </button>
          <button
            onClick={() => handleStatusUpdate('cancelled')}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
          >
            ✗ Decline
          </button>
        </div>
      )}

      {booking.status === 'confirmed' && (
        <button
          onClick={() => handleStatusUpdate('completed')}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          ✓ Mark as Completed
        </button>
      )}

      {booking.status === 'completed' && (
        <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-3 text-center">
          <p className="text-blue-300 font-semibold">🎉 Booking Completed</p>
        </div>
      )}

      {booking.status === 'cancelled' && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 text-center">
          <p className="text-red-300 font-semibold">❌ Booking Cancelled</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookingCard;
