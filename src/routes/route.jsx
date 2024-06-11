import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../components/providers/ErrorBoundry';
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
import DashboardRedirect from '../pages/DashboardRedirect';
import VerifyCode from '../pages/Signup/VerifyCode';
import BadgeVerifyCode from '../pages/Signup/BadgeVerifyCode';
import TermOfService from '../pages/Signup/pages/TermOfService';
import PrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';
import About from '../pages/Dashboard/pages/CustomerSupport/About';
import Faq from '../pages/Dashboard/pages/CustomerSupport/Faq';
import ContactUs from '../pages/Dashboard/pages/CustomerSupport/ContactUs';
import CustomerSupport from '../pages/Dashboard/pages/CustomerSupport';
import GuestRedirect from '../pages/DashboardRedirect/GuestRedirect';
import Welcome from '../pages/Welcome/welcome';
import SharedLinkResults from '../pages/Dashboard/pages/Profile/pages/shared-links/SharedLinkResults';
import UserSettings from '../pages/Dashboard/pages/Profile/pages/UserSettings';
import Feedback from '../pages/Dashboard/pages/Profile/pages/feedback';
import CredentialLogin from '../pages/Signin/components/CredentialLogin';
import CredentialRegister from '../pages/Signup/components/CredentialRegister';
import GuestCustomerSupport from '../pages/Dashboard/pages/CustomerSupport/GuestCustomerSupport';
import Lists from '../pages/Dashboard/pages/Lists';
import PostsByList from '../pages/Dashboard/pages/Lists/PostsByList';
import SharedListResults from '../pages/Dashboard/pages/Lists/SharedListResults';
import Summary from '../pages/Dashboard/pages/Profile/pages/summary';
import YesNo from '../pages/Dashboard/pages/Quest/pages/YesNo';
import MultipleChoice from '../pages/Dashboard/pages/Quest/pages/MultipleChoice';
import OpenChoice from '../pages/Dashboard/pages/Quest/pages/OpenChoice';
import RankChoice from '../pages/Dashboard/pages/Quest/pages/RankChoice';
import AgreeDisagree from '../pages/Dashboard/pages/Quest/pages/AgreeDisagree';
import LikeDislike from '../pages/Dashboard/pages/Quest/pages/LikeDislikeQuest';
import Test from '../components/Test';
// TREASURY
import TreasuryLayout from '../pages/Dashboard/pages/Treasury/TreasuryLayout';
import TreasurySummary from '../pages/Dashboard/pages/Treasury/pages/TreasurySummary';
import RewardSchedule from '../pages/Dashboard/pages/Treasury/pages/RewardSchedule';
import BuyFDX from '../pages/Dashboard/pages/Treasury/pages/BuyFDX';
import RedemptionCenter from '../pages/Dashboard/pages/Treasury/pages/RedemptionCenter';
import Ledger from '../pages/Dashboard/pages/Treasury/pages/Ledger';

export function Router() {
  const persistedUser = useSelector((state) => state.auth.user);
  const ROLES = {
    User: 'user',
    Guest: 'guest',
  };

  // console.log({ persistedUser });
  return (
    <>
      {!persistedUser?.uuid ? (
        <Routes>
          {/* <Route path="/" element={<Welcome />} />
          <Route path="/" element={<GuestCustomerSupport />}>
            <Route path="about" element={<About />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contact-us" element={<ContactUs />} />
          </Route>
          <Route path="/term-of-service" element={<TermOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/verify-email" element={<VerifyEmail />} /> */}
          <Route path="/" element={<GuestRedirect />} />
          <Route path="/signin/" element={<Signin />}>
            <Route path="credentials" element={<CredentialLogin />} />
          </Route>
          <Route path="/signup" element={<Signup />}>
            <Route path="credentials" element={<CredentialRegister />} />
          </Route>
          <Route path="/verifycode" element={<VerifyCode />} />
          <Route path="/auth0" element={<DashboardRedirect />} />
          <Route path="/p/:id" element={<GuestRedirect />} />
          <Route path="/l/:id" element={<GuestRedirect />} />
          <Route
            path="/dashboard/treasury/:code"
            element={<Navigate to="/" state={{ from: '/dashboard/treasury/:code' }} />}
          />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Guest]} />}>
            <Route
              path="/help"
              element={persistedUser?.role === 'user' ? <Navigate to="/dashboard" /> : <GuestCustomerSupport />}
            >
              <Route path="about" element={<About />} />
              <Route path="faq" element={<Faq />} />
              <Route path="contact-us" element={<ContactUs />} />
            </Route>
            <Route path="/term-of-service" element={<TermOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/test" element={<Test />} />
            <Route path="/dashboard/" element={<Dashboard />}>
              <Route path="" element={<QuestStartSection />} />
              <Route path="help" element={<CustomerSupport />}>
                <Route path="about" element={<About />} />
                <Route path="faq" element={<Faq />} />
                <Route path="contact-us" element={<ContactUs />} />
              </Route>
              <Route path="quest/" element={<Quest />}>
                <Route path="" element={<YesNo />} />
                <Route path="multiple-choice" element={<MultipleChoice />} />
                <Route path="open-choice" element={<OpenChoice />} />
                <Route path="ranked-choice" element={<RankChoice />} />
                <Route path="agree-disagree" element={<AgreeDisagree />} />
                <Route path="like-dislike" element={<LikeDislike />} />
              </Route>
              <Route path="treasury/" element={<TreasuryLayout />}>
                <Route path="" element={<TreasurySummary />} />
                <Route path="reward-schedule" element={<RewardSchedule />} />
                <Route path="buy-fdx" element={<BuyFDX />} />
                <Route path="redemption-center" element={<RedemptionCenter />} />
                <Route path="ledger" element={<Ledger />} />
              </Route>
              <Route path="treasury/:code" element={<TreasuryLayout />}>
                <Route path="" element={<TreasurySummary />} />
                <Route path="reward-schedule" element={<RewardSchedule />} />
                <Route path="buy-fdx" element={<BuyFDX />} />
                <Route path="redemption-center" element={<RedemptionCenter />} />
                <Route path="ledger" element={<Ledger />} />
              </Route>
              <Route
                path="profile/"
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
                      <Summary />
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
                  path="post-activity"
                  element={
                    <ErrorBoundary>
                      <Contributions />
                    </ErrorBoundary>
                  }
                />
                <Route path="lists" element={<Lists />} />
                <Route path="postsbylist/:categoryId" element={<PostsByList />} />

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
                <Route
                  path="user-settings"
                  element={
                    <ErrorBoundary>
                      <UserSettings />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="feedback"
                  element={
                    <ErrorBoundary>
                      <Feedback />
                    </ErrorBoundary>
                  }
                />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>
            </Route>
            <Route path="/shared-links/result" element={<SharedLinkResults />} />
            <Route path="/shared-list-link/result" element={<SharedListResults />} />
            <Route path="/quest/:isFullScreen" element={<Guests />} />
            <Route path="/p/:id" element={<SingleQuest />} />
            <Route path="/l/:id" element={<PostsByList />} />
            <Route path="/badgeverifycode" element={<BadgeVerifyCode />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/guest-signup" element={<Signup />}>
              <Route path="credentials" element={<CredentialRegister />} />
            </Route>
            <Route path="/signin/" element={persistedUser?.role === 'user' ? <Navigate to="/dashboard" /> : <Signin />}>
              <Route path="credentials" element={<CredentialLogin />} />
            </Route>
            <Route path="/verifycode" element={<VerifyCode />} />
            <Route
              path="*"
              element={persistedUser?.role === 'user' ? <Navigate to="/dashboard" /> : <Navigate to={'/help/about'} />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
}
