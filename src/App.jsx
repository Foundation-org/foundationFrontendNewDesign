import { useEffect, useState } from "react";
import { Router } from "./utils/route";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";

function App() {
  const [theme, setTheme] = useState(null);
  const persistedTheme = useSelector((state) => state.utils.theme);

  useEffect(() => {
    if (persistedTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [persistedTheme]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    // <div style={{overflow: 'hidden', height: '100vh'}}>
    <div className="h-screen overflow-hidden">
      <Router />
      <Toaster
        position="top-right"
        expand={true}
        theme={persistedTheme === "dark" ? "dark" : "light"}
        richColors
      />
    </div>
  );
}

export default App;
