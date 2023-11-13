import { useEffect, useState } from 'react';
import { Router } from './utils/route';
import { Toaster } from 'sonner';

function App() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'true') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <Router />
      <Toaster position="top-right" expand={true} richColors />
    </>
  );
}

export default App;
