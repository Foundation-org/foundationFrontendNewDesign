import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { referralModalStyle } from '../../constants/styles';
import showToast from '../../components/ui/Toast';
import SocialLogins from '../../components/SocialLogins';
import MyModal from './components/Modal';
import api from '../../services/api/Axios';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import Loader from './components/Loader';

const isWebview = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  // Common webview identifiers or patterns
  const webviewIdentifiers = [
    'wv',                // Common abbreviation for webview
    'webview',           // Webview identifier
    'fbav',              // Facebook App WebView
    'instagram',         // Instagram WebView
    'twitter',           // Twitter WebView
  ];

  // Check if any of the webview identifiers exist in the userAgent string
  return webviewIdentifiers.some(identifier => userAgent.includes(identifier));
};

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resData, setResData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isReferral, setIsReferral] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isPopup, setIspopup] = useState(false);
  const [socialAccount, setSocialAccount] = useState({ isSocial: false, data: null });
  const [clickedButtonName, setClickedButtonName] = useState('');
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handlePopupOpen = () => setIspopup(true);
  const handlePopupClose = () => setIspopup(false);

  const handleReferralOpen = () => setIsReferral(true);

  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoading(false);
  };

  const triggerLogin = async () => {
    setIsLoadingSocial(true);
  
    if (clickedButtonName === 'google') {
      if (isWebview(window.navigator.userAgent)) {
        showToast("info", "webView");
        setIsLoadingSocial(false);
      } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      }
    }
  
    if (clickedButtonName === 'linkedin') {
      if (isWebview(window.navigator.userAgent)) {
        showToast("info", "webView");
        setIsLoadingSocial(false);
      } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
      }
    }
  
    if (clickedButtonName === 'github') {
      if (isWebview(window.navigator.userAgent)) {
        showToast("info", "webView");
        setIsLoadingSocial(false);
      } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
      }
    }
  
    if (clickedButtonName === 'facebook') {
      if (isWebview(window.navigator.userAgent)) {
        showToast("info", "webView");
        setIsLoadingSocial(false);
      } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
      }
    }
  
    if (clickedButtonName === 'twitter') {
      if (isWebview(window.navigator.userAgent)) {
        showToast("info", "webView");
        setIsLoadingSocial(false);
      } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
      }
    }
  };

  const handleEmailType = async (value) => {
    try {
      if (!value) return showToast('warning', 'emailType');
      setModalVisible(false);
      const res = await api.patch(`/updateBadge/${resData.userId}/${resData.badgeId}`, {
        type: value,
        primary: true,
      });
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userLoggedIn', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('jwt', res.data.token);
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      {isLoadingSocial && <Loader />}
      <MyModal modalShow={modalVisible} email={profile?.email} handleEmailType={handleEmailType} />
      {/* Mobile Top Header */}
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-[#389CE3]'
        } flex h-[48px] min-h-[48px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`} alt="logo" className="h-[10px]" />
      </div>
      {/* Tablet Left Header */}
      <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
      {/* Main Content */}
      <div className="flex h-screen flex-col items-center bg-white md:justify-center lg:w-[calc(100%-36.11%)] lg:rounded-bl-[65px] lg:rounded-tl-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <h1 className="text-[18px] font-[700] text-black tablet:text-[35px] tablet:leading-[35px] dark:text-white">
            {location.pathname === '/signup' || location.pathname === '/guest-signup'
              ? 'Create an Account'
              : 'Create Account with Email'}
          </h1>
          {(location.pathname === '/signup' || location.pathname === '/guest-signup') && (
            <div className="mt-5 tablet:mt-[45px]">
              <SocialLogins handleReferralOpen={handleReferralOpen} setClickedButtonName={setClickedButtonName} />
            </div>
          )}
          <Outlet />
          <div className="mt-5 flex gap-3 tablet:mt-14">
            <p className="text-[11.21px] font-[500] text-gray-100 md:text-[22px] dark:text-gray">
              Already have an account?
            </p>
            <Link to="/signin">
              <p className="text-[11.21px] font-[500] text-blue md:text-[22px] dark:text-white">Sign in</p>
            </Link>
          </div>
        </div>
      </div>
      <BasicModal
        open={isReferral}
        handleClose={handleReferralClose}
        customStyle={referralModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <ReferralCode
          handleClose={handleReferralClose}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          password={password}
          reTypePassword={reTypePassword}
          email={email}
          setEmail={setEmail}
          setPassword={setPassword}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          handlePopupOpen={handlePopupOpen}
          socialAccount={socialAccount}
          setIsLoadingSocial={setIsLoadingSocial}
          triggerLogin={triggerLogin}
        />
      </BasicModal>
    </div>
  );
}
