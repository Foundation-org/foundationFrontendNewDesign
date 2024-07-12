import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Loader from '../Signup/components/Loader';
import LegacyConfirmationPopup from '../../components/dialogue-boxes/LegacyConfirmationPopup';
import SocialLogins from '../../components/SocialLogins';
import '../../index.css';
import showToast from '../../components/ui/Toast';

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

export default function Signin() {
  const location = useLocation();
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [uuid, setUuid] = useState();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState(false);
  const legacyPromiseRef = useRef();
  const [clickedButtonName, setClickedButtonName] = useState('');

  const triggerLogin = async (value) => {
    if (!value) {
      value = clickedButtonName;
    }
  
    setIsLoadingSocial(true);
  
    switch (value) {
      case 'google':
        if (isWebview()) {
          showToast("info", "webViewLogin");
          setIsLoadingSocial(false);
        } else {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
        }
        break;
  
      case 'linkedin':
        if (!isWebview()) {
          showToast("info", "webViewLogin");
          setIsLoadingSocial(false);
        } else {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
        }
        break;
  
      case 'github':
        if (!isWebview()) {
          showToast("info", "webViewLogin");
          setIsLoadingSocial(false);
        } else {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
        }
        break;
  
      case 'facebook':
        if (!isWebview()) {
          showToast("info", "webViewLogin");
          setIsLoadingSocial(false);
        } else {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
        }
        break;
  
      case 'instagram':
        if (isWebview()) {
          showToast("info", "webViewLogin");
          setIsLoadingSocial(false);
        } else {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/instagram`;
        }
        break;
  
      case 'twitter':
        if (!isWebview()) {
          showToast("info", "webViewLogin");
          setIsLoadingSocial(false);
        } else {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
        }
        break;
  
      default:
        setIsLoadingSocial(false);
        break;
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      <LegacyConfirmationPopup
        isPopup={isPasswordConfirmation}
        setIsPopup={setIsPasswordConfirmation}
        title="Confirm Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        legacyPromiseRef={legacyPromiseRef}
        login={true}
        uuid={uuid}
        setIsLoadingSocial={setIsLoadingSocial}
      />
      {isLoadingSocial && <Loader />}
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-[#389CE3]'
        } flex h-[48px] min-h-[48px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`} alt="logo" className="h-[10px]" />
      </div>
      <div className="flex h-full flex-col items-center bg-white md:justify-center lg:w-[calc(100%-36.11%)] lg:rounded-br-[65px] lg:rounded-tr-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <h1 className="text-center text-[18px] font-[700] text-black tablet:text-left tablet:text-[35px] tablet:leading-[35px] dark:text-white">
            {location.pathname === '/signin' ? 'Login' : 'Login with Email'}
          </h1>
          {location.pathname === '/signin' && (
            <div className="mt-5 tablet:mt-[45px]">
              <SocialLogins setClickedButtonName={setClickedButtonName} isLogin={true} triggerLogin={triggerLogin} />
            </div>
          )}
          <Outlet />
          <div className="mt-5 flex justify-center gap-3 tablet:mt-14">
            <p className="text-[11.21px] font-[500] text-gray-100 md:text-[22px] dark:text-gray">
              Don’t have an account?
            </p>
            <Link to={persistedUserInfo && persistedUserInfo.role === 'guest' ? '/guest-signup' : '/signup'}>
              <p className="text-[11.21px] font-[500] text-blue md:text-[22px] dark:text-white">Sign up</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden h-screen w-fit items-center px-32 lg:flex">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
    </div>
  );
}
