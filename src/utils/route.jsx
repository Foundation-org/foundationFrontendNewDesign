import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Guests from "../pages/Guests";
import Dashboard from "../pages/Dashboard";
import VerifyEmail from "../pages/Signup/VerifyEmail";
import Profile from "../pages/Dashboard/pages/Profile";

export function Router() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserToken = () => {
      const userToken = localStorage.getItem("userLoggedIn");
      if (!userToken || userToken === "undefined") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    };

    checkUserToken();
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signin />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/quest/:id" element={<Guests />} />

        {/* Protected routes */}
        {isLoggedIn && (
          <>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quest/:id" element={<Guests />} />
          </>
        )}

        {/* 404 page */}
        <Route
          path="*"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}
