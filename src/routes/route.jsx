import { Routes, Route, Navigate } from 'react-router-dom';

import RequireAuth from './RequireAuth';

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
import TermOfService from '../pages/Signup/pages/TermOfService';
import PrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';
import Faq from '../pages/Dashboard/pages/CustomerSupport/Faq';
import ContactUs from '../pages/Dashboard/pages/CustomerSupport/ContactUs';
import CustomerSupport from '../pages/Dashboard/pages/CustomerSupport';
import { useSelector } from 'react-redux';
import GuestRedirect from '../pages/DashboardRedirect/GuestRedirect';

export function Router() {
  const persistedUser = useSelector((state) => state.auth.user);
  const ROLES = {
    User: 'user',
    Guest: 'guest',
  };

  console.log({ persistedUser });

  return (
    <>
      {!persistedUser ? (
        <>
          {/* Public */}
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/term-of-service" element={<TermOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verifycode" element={<VerifyCode />} />
            <Route path="/auth0" element={<DashboardRedirect />} />
            <Route path="/p/:id" element={<GuestRedirect />} />
            <Route path="*" element={persistedUser ? <Navigate to="/dashboard" /> : <Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <>
          {/* Protected */}
          <Routes>
            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Guest]} />}>
              <Route path="/dashboard/" element={<Dashboard />}>
                <Route path="" element={<QuestStartSection />} />
                <Route path="quest" element={<Quest />} />
                <Route path="bookmark" element={<Bookmark />} />
                <Route path="faq/" element={<CustomerSupport />}>
                  <Route path="" element={<Faq />} />
                  <Route path="contact-us" element={<ContactUs />} />
                </Route>
              </Route>
              <Route path="/profile/" element={<Profile />}>
                <Route path="" element={<Contributions />} />
                <Route path="verification-badges" element={<VerificationBadges />} />
                <Route path="ledger" element={<BasicTable />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>
              <Route path="/quest/:isFullScreen" element={<Guests />} />
              <Route path="/p/:id" element={<SingleQuest />} />
              <Route path="/guest-signup" element={<Signup />} />
              <Route path="/verifycode" element={<VerifyCode />} />
              {/* <Route path="*" element={persistedUser ? <Navigate to="/dashboard" /> : <Navigate to="/" />} /> */}
            </Route>
          </Routes>
        </>
      )}
    </>
  );
}
