import { Routes, Route } from "react-router-dom";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Dashboard/pages/Profile";
import VerifyEmail from "../pages/Signup/VerifyEmail";

export function Router() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* 404 page */}
        <Route
          path="*"
          element={<h1 className="font-semibold">404 Not found</h1>}
        />
      </Routes>
    </>
  );
}
