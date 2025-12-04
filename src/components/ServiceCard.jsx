import React from 'react';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="bg-black p-4 rounded shadow flex items-start gap-4">
      <div className="text-3xl">{service.icon}</div>
      <div>
        <h3 className="font-semibold">{service.name}</h3>
        <p className="text-gray-600">{service.description}</p>
        <p className="text-blue-600 font-bold">₱{service.price}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
