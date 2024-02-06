import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import AppRoutes from './AppRoutes';
import PrivateRoutes from './PrivateRoutes';

// pages
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Guests from '../pages/Guests';
import SingleQuest from '../pages/SingleQuest';
import Dashboard from '../pages/Dashboard';
import VerifyEmail from '../pages/Signup/VerifyEmail';
import Profile from '../pages/Dashboard/pages/Profile';
import Contributions from '../pages/Dashboard/pages/Profile/pages/Contributions';
import VerificationBadges from '../pages/Dashboard/pages/Profile/pages/VerificationBadges';
import BasicTable from '../pages/Dashboard/pages/Profile/pages/Ledger';
import ChangePassword from '../pages/Dashboard/pages/Profile/pages/ChangePassword';
import QuestStartSection from '../pages/Dashboard/pages/QuestStartSection';
import Quest from '../pages/Dashboard/pages/Quest/Quest';
import Bookmark from '../pages/Dashboard/pages/Bookmark';
import DashboardRedirect from '../pages/DashboardRedirect';
import VerifyCode from '../pages/Signup/VerifyCode';
import RequireAuth from './RequireAuth';
import TermOfService from '../pages/Signup/pages/TermOfService';
import PrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';

export function Router() {
  const persistedUser = useSelector((state) => state.auth.user);
  let auth = { persistedUser };
  // console.log('🚀 ~ Router ~ persistedUser:', persistedUser);
  // console.log("🚀 ~ Router ~ persistedUser:", persistedUser)
  // console.log("🚀 ~ Router ~ auth:", auth)

  // console.log('usr', persistedUser);

  return (
    <>
      <Routes>
        {/* public */}
        <Route element={<RequireAuth auth={auth} />}>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/term-of-service" element={<TermOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verifycode" element={<VerifyCode />} />
          <Route path="/auth0" element={<DashboardRedirect />} />
          <Route path="/p/:id" element={<SingleQuest />} />
        </Route>

        {/* private */}
        <Route element={<RequireAuth auth={auth} />}>
          <Route path="/dashboard/" element={<Dashboard />}>
            <Route path="" element={<QuestStartSection />} />
            <Route path="quest" element={<Quest />} />
            <Route path="bookmark" element={<Bookmark />} />
          </Route>
          <Route path="/profile/" element={<Profile />}>
            <Route path="" element={<Contributions />} />
            <Route path="verification-badges" element={<VerificationBadges />} />
            <Route path="ledger" element={<BasicTable />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route path="/quest/:isFullScreen" element={<Guests />} />
        </Route>

        {/* catch all */}
        {/* <Route path="*" element={auth.token ? <Navigate to="/dashboard" /> : <Navigate to="/" />} /> */}
      </Routes>
    </>
  );
}
