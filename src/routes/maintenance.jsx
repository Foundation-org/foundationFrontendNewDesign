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
import { ErrorBoundary } from '../components/providers/ErrorBoundry';

import RedemptionCenter from '../pages/Dashboard/pages/Treasury/RedemptionCenter';
import Ledger from '../pages/Dashboard/pages/Treasury/Ledger';
import TreasuryLayout from '../pages/Dashboard/pages/Treasury/TreasuryLayout';
import UserSettings from '../pages/Dashboard/pages/Profile/pages/UserSettings';

export function MaintenanceRouter() {
  const persistedUser = useSelector((state) => state.auth.user);
  const ROLES = {
    User: 'user',
    Guest: 'guest',
  };

  // console.log({ persistedUser });

  return (
    <>
      {!persistedUser ? (
        <>
          {/* Public */}
          <Routes>
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/" element={<Maintenance />} />
            <Route path="/signin" element={<Maintenance />} />
            <Route path="/signup" element={<Maintenance />} />
            <Route path="/term-of-service" element={<Maintenance />} />
            <Route path="/privacy-policy" element={<Maintenance />} />
            <Route path="/verify-email" element={<Maintenance />} />
            <Route path="/verifycode" element={<Maintenance />} />
            <Route path="/auth0" element={<Maintenance />} />
            <Route path="/p/:id" element={<Maintenance />} />
            <Route
              path="/dashboard/treasury/:code"
              element={<Navigate to="/" state={{ from: '/dashboard/treasury/:code' }} />}
            />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        </>
      ) : (
        <>
          {/* Protected */}
          <Routes>
            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Guest]} />}>
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/dashboard/faq/" element={<Maintenance />}>
                <Route path="" element={<Maintenance />} />
                <Route path="contact-us" element={<Maintenance />} />
              </Route>
              <Route
                path="/dashboard/"
                element={
                  <ErrorBoundary>
                    <Maintenance />
                  </ErrorBoundary>
                }
              >
                <Route path="" element={<Maintenance />} />
                <Route path="quest" element={<Maintenance />} />
                <Route path="bookmark" element={<Maintenance />} />
                <Route path="treasury/" element={<Maintenance />}>
                  <Route path="" element={<Maintenance />} />
                  <Route path="ledger" element={<Maintenance />} />
                </Route>
                <Route path="treasury/:code" element={<Maintenance />}>
                  <Route path="" element={<Maintenance />} />
                  <Route path="ledger" element={<Maintenance />} />
                </Route>
                <Route
                  path="profile/"
                  element={
                    <ErrorBoundary>
                      <Maintenance />
                    </ErrorBoundary>
                  }
                >
                  <Route
                    path=""
                    element={
                      <ErrorBoundary>
                        <Maintenance />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="contributions"
                    element={
                      <ErrorBoundary>
                        <Maintenance />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="ledger"
                    element={
                      <ErrorBoundary>
                        <Maintenance />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="hidden-posts"
                    element={
                      <ErrorBoundary>
                        <Maintenance />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="shared-links"
                    element={
                      <ErrorBoundary>
                        <Maintenance />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="user-settings"
                    element={
                      <ErrorBoundary>
                        <Maintenance />
                      </ErrorBoundary>
                    }
                  />
                  <Route path="change-password" element={<Maintenance />} />
                </Route>
              </Route>
              <Route
                path="/profile/"
                element={
                  <ErrorBoundary>
                    <Maintenance />
                  </ErrorBoundary>
                }
              >
                <Route
                  path=""
                  element={
                    <ErrorBoundary>
                      <Maintenance />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="verification-badges"
                  element={
                    <ErrorBoundary>
                      <Maintenance />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="ledger"
                  element={
                    <ErrorBoundary>
                      <Maintenance />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="hidden-posts"
                  element={
                    <ErrorBoundary>
                      <Maintenance />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="shared-links"
                  element={
                    <ErrorBoundary>
                      <Maintenance />
                    </ErrorBoundary>
                  }
                />
                <Route path="change-password" element={<Maintenance />} />
              </Route>
              <Route path="/shared-links/result" element={<Maintenance />} />
              <Route path="/quest/:isFullScreen" element={<Maintenance />} />
              <Route path="/p/:id" element={<Maintenance />} />
              <Route path="/badgeverifycode" element={<Maintenance />} />
              <Route path="/verify-email" element={<Maintenance />} />
              <Route path="/guest-signup" element={<Maintenance />} />
              <Route
                path="/signin"
                element={persistedUser.role === 'user' ? <Navigate to="/dashboard" /> : <Maintenance />}
              />

              <Route path="/verifycode" element={<Maintenance />} />
              <Route path="*" element={<Maintenance to="/dashboard" />} />
            </Route>
          </Routes>
        </>
      )}
    </>
  );
}
