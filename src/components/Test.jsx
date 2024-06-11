import React from 'react';
import showToast from './ui/Toast';

const Test = () => {
  const e = 'hamza is a boy';
  return (
    <div>
      Test
      <button onClick={() => showToast('error', 'error', {}, e)}>Click Me</button>
      <button onClick={() => showToast('info', 'verificationEmailSent')}>Click Me</button>
      <button onClick={() => showToast('success', 'verificationEmailSent')}>Click Me</button>
      <button onClick={() => showToast('warning', 'verificationEmailSent')}>Click Me</button>
      <button onClick={() => showToast('error', 'verificationEmailSent')}>PredefinedError</button>
    </div>
  );
};

export default Test;
