import React, { useState } from 'react';

const BookingCalendar = ({ bookings, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    const dateBookings = getBookingsForDate(clickedDate);
    onDateClick(clickedDate, dateBookings);
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={prevMonth} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
        >
          ← Prev
        </button>
        <h2 className="text-2xl font-bold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button 
          onClick={nextMonth} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayBookings = getBookingsForDate(date);
          const hasBookings = dayBookings.length > 0;
          const isSelected = selectedDate && 
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === currentDate.getMonth() &&
                            selectedDate.getFullYear() === currentDate.getFullYear();

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`aspect-square p-2 rounded-lg transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105' 
                  : hasBookings 
                    ? 'bg-green-600/30 hover:bg-green-600/50 text-white border border-green-500' 
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
              }`}
            >
              <div className="text-sm font-semibold">{day}</div>
              {hasBookings && (
                <div className="text-xs mt-1 bg-green-500 rounded-full px-1 py-0.5">
                  {dayBookings.length}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;