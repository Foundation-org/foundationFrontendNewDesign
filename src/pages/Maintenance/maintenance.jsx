import React from 'react';

const Maintenance = () => {
  console.log("maintaince");
  return (
  
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  
      <div className="max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Site Under Maintenance
        </h1>
        <p className="text-gray-600 text-center">
          We are currently performing maintenance. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
