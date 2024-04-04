import React from 'react';

const Maintenance = () => {
  console.log('maintaince');
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-md bg-white p-8 shadow-md">
        <h1 className="text-gray-800 mb-4 text-center text-3xl font-bold">Site Under Maintenance</h1>
        <p className="text-center text-gray-600">We are currently performing maintenance. Please check back later.</p>
      </div>
    </div>
  );
};

export default Maintenance;
