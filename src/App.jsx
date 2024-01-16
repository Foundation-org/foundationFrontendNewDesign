import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Router } from "./routes/route";
import { Toaster } from "sonner";

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
