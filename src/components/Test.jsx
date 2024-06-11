import React from 'react';
import showToast from './ui/Toast';

const Test = () => {
  return (
    <div>
      Test
      <button onClick={() => showToast('success', 'hamza')}>Click Me</button>
    </div>
  );
};

export default Test;
