import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="flex items-center justify-center bg-transparent bg-opacity-20">
      <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
    </div>
  );
};

export default Loader;
