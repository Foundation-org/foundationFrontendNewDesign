import { useEffect, useState } from 'react';
import { Router } from './utils/route';

function App() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (import.meta.env.VITE_THEME_SWITCH === 'dark') {
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

  return <Router />;
}

export default App;
