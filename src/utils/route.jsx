import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Guests from "../pages/Guests";
import Dashboard from "../pages/Dashboard";
import VerifyEmail from "../pages/Signup/VerifyEmail";
import Profile from "../pages/Dashboard/pages/Profile";
import Contributions from "../pages/Dashboard/pages/Profile/pages/Contributions";
import VerificationBadges from "../pages/Dashboard/pages/Profile/pages/VerificationBadges";
import BasicTable from "../pages/Dashboard/pages/Profile/pages/Ledger";
import ChangePassword from "../pages/Dashboard/pages/Profile/pages/ChangePassword";

export function Router() {
  // const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const checkUserToken = () => {
  //     const userToken = localStorage.getItem("userLoggedIn");
  //     if (!userToken || userToken === "undefined") {
  //       setIsLoggedIn(false);
  //     } else {
  //       setIsLoggedIn(true);
  //     }
  //   };

  //   checkUserToken();
  // }, [navigate]);

  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/quest/:id/:isFullScreen" element={<Guests />} />

        {/* Protected routes */}
        {/* {isLoggedIn && (
        )} */}
        <>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/profile/" element={<Profile />}>
            <Route path="" element={<Contributions />} />
            <Route
              path="verification-badges"
              element={<VerificationBadges />}
            />
            <Route path="ledger" element={<BasicTable />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route path="/quest/:id/:isFullScreen" element={<Guests />} />
        </>

        {/* 404 page */}
        {/* <Route
          path="*"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        /> */}
      </Routes>
    </>
  );
}
