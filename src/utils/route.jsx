import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AppRoutes from "./AppRoutes";
import PrivateRoutes from "./PrivateRoutes";

// pages
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
import Main from "../pages/Dashboard/pages/Main/Main";
import Quest from "../pages/Dashboard/pages/Quest/Quest";
import Bookmark from "../pages/Dashboard/pages/Bookmark";
import DashboardRedirect from "../pages/Dashboard/DashboardRedirect";
import Test from "../pages/Test";

export function Router() {
  const persistedUser = useSelector((state) => state.auth.user);
  let auth = { token: persistedUser !== null ? true : false };

  return (
    <>
      <Routes>
        {/* public */}
        <Route element={<AppRoutes auth={auth} />}>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth0" element={<DashboardRedirect />} />
          <Route path="/quest/:id" element={<Guests />} />
        </Route>

        {/* private */}
        <Route element={<PrivateRoutes auth={auth} />}>
          <Route path="/dashboard/" element={<Dashboard />}>
            <Route path="" element={<Main />} />
            <Route path="quest" element={<Quest />} />
            <Route path="bookmark" element={<Bookmark />} />
          </Route>
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
          <Route path="/test" element={<Test />} />
        </Route>

        {/* catch all */}
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
