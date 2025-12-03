import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-black-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-black-100 text-red-700'
  };
  const icons = {
    pending: '⏳',
    confirmed: '✅',
    completed: '🎉',
    cancelled: '❌'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <span>{icons[status]}</span> {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
