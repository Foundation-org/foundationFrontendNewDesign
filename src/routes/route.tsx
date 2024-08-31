import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import DashboardRedirect from '../pages/DashboardRedirect';
import VerifyCode from '../pages/Signup/VerifyCode';
import BadgeVerifyCode from '../pages/Signup/BadgeVerifyCode';
import About from '../pages/Dashboard/pages/CustomerSupport/About';
import Faq from '../pages/Dashboard/pages/CustomerSupport/Faq';
import TermsOfService from '../pages/Dashboard/pages/CustomerSupport/TermsOfService';
import PrivacyPolicy from '../pages/Dashboard/pages/CustomerSupport/PrivacyPolicy';
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
import TermOfService from '../pages/Signup/pages/TermOfService';
// QUESTS
import Quest from '../pages/Dashboard/pages/Quest/Quest';
import YesNo from '../pages/Dashboard/pages/Quest/pages/YesNo';
import OpenChoice from '../pages/Dashboard/pages/Quest/pages/OpenChoice';
import RankChoice from '../pages/Dashboard/pages/Quest/pages/RankChoice';
import AgreeDisagree from '../pages/Dashboard/pages/Quest/pages/AgreeDisagree';
import LikeDislike from '../pages/Dashboard/pages/Quest/pages/LikeDislikeQuest';
import PreviewPost from '../pages/Dashboard/pages/Quest/pages/PreviewPost';
// TREASURY
import TreasuryLayout from '../pages/Dashboard/pages/Treasury/TreasuryLayout';
import TreasurySummary from '../pages/Dashboard/pages/Treasury/pages/TreasurySummary';
import RewardSchedule from '../pages/Dashboard/pages/Treasury/pages/RewardSchedule';
import BuyFDX from '../pages/Dashboard/pages/Treasury/pages/BuyFDX';
import RedemptionCenter from '../pages/Dashboard/pages/Treasury/pages/RedemptionCenter';
import Ledger from '../pages/Dashboard/pages/Treasury/pages/Ledger';
// TEST
import Test from '../components/Test';
import SignUpPrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';
import Authenticating from '../components/Authenticating';
import MultipleChoice from '../pages/Dashboard/pages/Quest/pages/MultipleChoice';
import EmbedPost from '../pages/Embed/EmbedPost';
import Iframe from '../pages/Embed/Iframe';
import VerifyPhone from '../pages/Signup/VerifyPhone';

export function Router() {
  const persistedUser = useSelector((state: any) => state.auth.user);
  const ROLES = {
    User: 'user',
    Guest: 'guest',
  };

  return (
    <>
      {!persistedUser?.uuid ? (
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem('userExist') === 'true' ? (
                <Navigate to="/signin" />
              ) : (
                <GuestRedirect redirectUrl="/help/about" />
              )
            }
          />
          <Route path="/iframe" element={<Iframe />} />
          <Route path="/embed/:link" element={<EmbedPost />} />
          <Route path="/term-of-service" element={<TermOfService />} />
          <Route path="/privacy-policy" element={<SignUpPrivacyPolicy />} />
          <Route path="/signin/" element={<Signin />}>
            <Route path="credentials" element={<CredentialLogin />} />
          </Route>
          <Route path="/signup" element={<Signup />}>
            <Route path="credentials" element={<CredentialRegister />} />
          </Route>
          <Route path="/verifycode" element={<VerifyCode />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/auth0" element={<DashboardRedirect />} />
          <Route path="/p/:id" element={<GuestRedirect redirectUrl={null} />} />
          <Route path="/l/:id" element={<GuestRedirect redirectUrl={null} />} />
          <Route path="/treasury/:code" element={<Navigate to="/" state={{ from: '/treasury/:code' }} />} />
          <Route path="/authenticating" element={<Authenticating />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Guest]} />}>
            <Route path="/iframe" element={<Iframe />} />
            <Route path="/embed/:link" element={<EmbedPost />} />
            <Route path="/authenticating" element={<Authenticating />} />
            <Route path="/term-of-service" element={<TermOfService />} />
            <Route path="/privacy-policy" element={<SignUpPrivacyPolicy />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/test" element={<Test />} />
            <Route path="/" element={<Dashboard />}>
              <Route path="" element={<QuestStartSection />} />
              <Route path="help/" element={<CustomerSupport />}>
                <Route path="about" element={<About />} />
                <Route path="faq" element={<Faq />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="contact-us" element={<ContactUs />} />
              </Route>
              <Route path="post" element={<Quest />}>
                <Route path="" element={<MultipleChoice />} />
                <Route path="agree-disagree" element={<AgreeDisagree />} />
                <Route path="yes-no" element={<YesNo />} />
                <Route path="like-dislike" element={<LikeDislike />} />
                <Route path="open-choice" element={<OpenChoice />} />
                <Route path="ranked-choice" element={<RankChoice />} />
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
              <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                <Route path="profile/" element={<Profile />}>
                  <Route path="" element={<Summary />} />
                  <Route path="verification-badges" element={<VerificationBadges />} />
                  <Route path="post-activity" element={<Contributions />} />
                  <Route path="lists" element={<Lists />} />
                  <Route path="postsbylist/:categoryId" element={<PostsByList />} />
                  <Route path="ledger" element={<BasicTable />} />
                  <Route path="feedback-given" element={<HiddenPosts />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="shared-links" element={<SharedLinks />} />
                  <Route path="user-settings" element={<UserSettings />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
              </Route>
            </Route>
            <Route path="/post-preview" element={<PreviewPost />} />
            <Route path="/shared-links/result" element={<SharedLinkResults />} />
            <Route path="/shared-list-link/result" element={<SharedListResults />} />
            <Route path="/post/:isFullScreen" element={<Guests />} />
            <Route path="/p/:id" element={<SingleQuest />} />
            <Route path="/l/:id" element={<PostsByList />} />
            <Route path="/badgeverifycode" element={<BadgeVerifyCode />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/guest-signup" element={<Signup />}>
              <Route path="credentials" element={<CredentialRegister />} />
            </Route>
            <Route path="/signin/" element={persistedUser?.role === 'user' ? <Navigate to="/" /> : <Signin />}>
              <Route path="credentials" element={<CredentialLogin />} />
            </Route>
            <Route path="/verifycode" element={<VerifyCode />} />
            <Route path="/verify-phone" element={<VerifyPhone />} />
            <Route
              path="*"
              element={persistedUser?.role === 'user' ? <Navigate to="/" /> : <Navigate to={'/help/about'} />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
}
