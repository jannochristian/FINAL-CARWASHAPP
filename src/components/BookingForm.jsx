import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const BookingForm = ({ user, services, closeForm, refreshBookings }) => {
  const [data, setData] = useState({
    service: '',
    vehicle: '',
    plate: '',
    date: '',
    time: '',
    location: '',
    paymentMethod: '',
    amount: '',
    reference: ''
  });
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    // Validation
    if (
      !data.service ||
      !data.vehicle ||
      !data.plate ||
      !data.date ||
      !data.time ||
      !data.location ||
      !data.paymentMethod ||
      !data.amount
    ) {
      return alert('Please fill all fields including payment and location.');
    }

    setLoading(true);

    try {
      const serviceObj = services.find(s => s.name === data.service);

      if (!serviceObj) {
        alert('Invalid service selected');
        setLoading(false);
        return;
      }

      const paymentStatus = data.paymentMethod === 'Cash' ? 'pending' : 'paid';

      // Insert booking into Supabase
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            user_name: user.name,
            service: data.service,
            vehicle: data.vehicle,
            plate: data.plate,
            date: data.date,
            time: data.time,
            location: data.location,
            price: serviceObj.price,
            status: paymentStatus,
            payment_method: data.paymentMethod,
            payment_amount: parseFloat(data.amount),
          }
        ]);

      if (error) throw error;

      alert('Booking created successfully!');
      
      // Refresh bookings list
      if (refreshBookings) {
        await refreshBookings();
      }
      
      closeForm();
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-4 rounded shadow space-y-2">
      {/* Select Service */}
      <select
        value={data.service}
        onChange={e => setData({ ...data, service: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 disabled:opacity-50"
      >
        <option value="">Select Service</option>
        {services.map(s => (
          <option key={s.id} value={s.name}>
            {s.name} - ₱{s.price}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Vehicle"
        value={data.vehicle}
        onChange={e => setData({ ...data, vehicle: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 disabled:opacity-50"
      />

      <input
        type="text"
        placeholder="Plate Number"
        value={data.plate}
        onChange={e => setData({ ...data, plate: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 disabled:opacity-50"
      />

      <input
        type="date"
        value={data.date}
        onChange={e => setData({ ...data, date: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 
               [&::-webkit-calendar-picker-indicator]:invert disabled:opacity-50"
      />

      <input
        type="time"
        value={data.time}
        onChange={e => setData({ ...data, time: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 
               [&::-webkit-calendar-picker-indicator]:invert disabled:opacity-50"
      />

      {/* Carwash Location */}
      <select
        value={data.location}
        onChange={e => setData({ ...data, location: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 disabled:opacity-50"
      >
        <option value="">Select Carwash Location</option>
        <option value="Main Branch - Saray Iligan City">Main Branch - Saray Purok Iligan City</option>
        <option value="North Branch - San Miguel Iligan City">North Branch - San Miguel Iligan City</option>
        <option value="South Branch - Tubod Iligan City">South Branch - Tubod Iligan City</option>
      </select>

      {/* Payment Section */}
      <h3 className="text-lg font-semibold mt-4">Payment Details</h3>

      <select
        value={data.paymentMethod}
        onChange={e => setData({ ...data, paymentMethod: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 disabled:opacity-50"
      >
        <option value="">Select Payment Method</option>
        <option value="GCash">GCash</option>
        <option value="Cash">Cash</option>
        <option value="Credit Card">Credit Card</option>
      </select>

      <input
        type="number"
        placeholder="Amount Paid"
        value={data.amount}
        onChange={e => setData({ ...data, amount: e.target.value })}
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white border border-gray-600 disabled:opacity-50"
      />

      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
      >
        {loading ? 'Creating Booking...' : 'Confirm Booking with Payment'}
      </button>
    </div>
  );
};

export default BookingForm;