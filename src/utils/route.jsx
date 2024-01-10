import { Routes, Route, Navigate } from "react-router-dom";
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
import PrivateRoutes from "./PrivateRoutes";
import { useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";

export function Router() {
  const persistedUser = useSelector((state) => state.auth.user);
  let auth = { token: persistedUser !== null ? true : false };

  return (
    <>
      <Routes>
        <Route element={<AppRoutes auth={auth} />}>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/quest/:id/:isFullScreen" element={<Guests />} />
        </Route>
        <Route element={<PrivateRoutes auth={auth} />}>
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
        </Route>
        <Route
          path="*"
          element={
            auth.token ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}
