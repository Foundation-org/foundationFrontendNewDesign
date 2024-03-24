import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import ErrorBoundary from '../components/providers/ErrorBoundry'; // Assuming ErrorBoundary is exported from '../components/providers/ErrorBoundry'
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Guests from '../pages/Guests';
import SingleQuest from '../pages/SingleQuest';
import Dashboard from '../pages/Dashboard';
import VerifyEmail from '../pages/Signup/VerifyEmail';
import Profile from '../pages/Dashboard/pages/Profile';
import Contributions from '../pages/Dashboard/pages/Profile/pages/Contributions';
import VerificationBadges from '../pages/Dashboard/pages/Profile/pages/VerificationBadges';
import HiddenPosts from '../pages/Dashboard/pages/Profile/pages/HiddenPosts';
import SharedLinks from '../pages/Dashboard/pages/Profile/pages/SharedLinks';
import BasicTable from '../pages/Dashboard/pages/Profile/pages/Ledger';
import ChangePassword from '../pages/Dashboard/pages/Profile/pages/ChangePassword';
import QuestStartSection from '../pages/Dashboard/pages/QuestStartSection';
import Quest from '../pages/Dashboard/pages/Quest/Quest';
import Bookmark from '../pages/Dashboard/pages/Bookmark';
import DashboardRedirect from '../pages/DashboardRedirect';
import VerifyCode from '../pages/Signup/VerifyCode';
import BadgeVerifyCode from '../pages/Signup/BadgeVerifyCode';
import TermOfService from '../pages/Signup/pages/TermOfService';
import PrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';
import Faq from '../pages/Dashboard/pages/CustomerSupport/Faq';
import ContactUs from '../pages/Dashboard/pages/CustomerSupport/ContactUs';
import CustomerSupport from '../pages/Dashboard/pages/CustomerSupport';
import GuestRedirect from '../pages/DashboardRedirect/GuestRedirect';
import { useSelector } from 'react-redux';
import Maintenance from '../pages/Maintenance/maintenance';
import Welcome from '../pages/Welcome/welcome';
import SharedLinkResults from '../pages/Dashboard/pages/Profile/pages/shared-links/SharedLinkResults';

export function Router() {
  const persistedUser = useSelector((state) => state.auth.user);
  const ROLES = {
    User: 'user',
    Guest: 'guest',
  };

  return (
    <>
      {!persistedUser ? (
        <>
          {/* Public */}
          <Routes>
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/term-of-service" element={<TermOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verifycode" element={<VerifyCode />} />
            <Route path="/auth0" element={<DashboardRedirect />} />
            <Route path="/p/:id" element={<GuestRedirect />} />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        </>
      ) : (
        <>
          {/* Protected */}
          <Routes>
            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Guest]} />}>
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/dashboard/" element={<Dashboard />}>
                <Route path="" element={<QuestStartSection />} />
                <Route path="quest" element={<Quest />} />
                <Route path="bookmark" element={<Bookmark />} />
                <Route path="faq/" element={<CustomerSupport />}>
                  <Route path="" element={<Faq />} />
                  <Route path="contact-us" element={<ContactUs />} />
                </Route>
              </Route>
              <Route
                path="/profile/"
                element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                }
              >
                <Route
                  path=""
                  element={
                    <ErrorBoundary>
                      <Contributions />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="verification-badges"
                  element={
                    <ErrorBoundary>
                      <VerificationBadges />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="ledger"
                  element={
                    <ErrorBoundary>
                      <BasicTable />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="hidden-posts"
                  element={
                    <ErrorBoundary>
                      <HiddenPosts />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="shared-links"
                  element={
                    <ErrorBoundary>
                      <SharedLinks />
                    </ErrorBoundary>
                  }
                />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>
              <Route path="/shared-links/result" element={<SharedLinkResults />} />
              <Route path="/quest/:isFullScreen" element={<Guests />} />
              <Route path="/p/:id" element={<SingleQuest />} />
              <Route path="/badgeverifycode" element={<BadgeVerifyCode />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/guest-signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/verifycode" element={<VerifyCode />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Routes>
        </>
      )}
    </>
  );
}
