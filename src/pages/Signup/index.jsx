import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { referralModalStyle } from '../../constants/styles';
import showToast from '../../components/ui/Toast';
import SocialLogins from '../../components/SocialLogins';
import MyModal from './components/Modal';
import api from '../../services/api/Axios';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import Loader from './components/Loader';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';
// const isWebview = () => {
//   const userAgent = window.navigator.userAgent.toLowerCase();

//   // Common webview identifiers or patterns
//   const webviewIdentifiers = [
//     'wv', // Common abbreviation for webview
//     'webview', // Webview identifier
//     'fbav', // Facebook App WebView
//     'instagram', // Instagram WebView
//     'twitter', // Twitter WebView
//   ];

//   // Check if any of the webview identifiers exist in the userAgent string
//   return webviewIdentifiers.some((identifier) => userAgent.includes(identifier));
// };

export default function Signup({ allowSignUp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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

  const handlePopupOpen = () => {
    // setIspopup(true);
  };
  const handlePopupClose = () => setIspopup(false);

  const handleReferralOpen = (provider) => {
    // if (isWebview(window.navigator.userAgent)) {
    //   if (provider === 'google') {
    //     showToast('info', 'webViewSignUp');
    //     setIsLoadingSocial(false);
    //   } else {
    //     setIsReferral(true);
    //   }
    // } else {
    // setIsReferral(true);
    // }
    triggerLogin(provider);
  };
  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoading(false);
  };

  const triggerLogin = async (clickedButtonName) => {
    setIsLoadingSocial(true);

    if (clickedButtonName === 'google') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      //   setIsLoadingSocial(false);
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      // }
    }

    if (clickedButtonName === 'linkedin') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      //   setIsLoadingSocial(false);
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
      // }
    }

    if (clickedButtonName === 'github') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      //   setIsLoadingSocial(false);
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
      // }
    }

    if (clickedButtonName === 'facebook') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      //   setIsLoadingSocial(false);
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
      // }
    }

    if (clickedButtonName === 'twitter') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      //   setIsLoadingSocial(false);
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
      // }
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
    <div
      className={`${allowSignUp ? 'rounded-b-[9.76px] bg-white tablet:rounded-b-[26px]' : 'h-screen'} flex w-full flex-col bg-blue-100 text-white dark:bg-black lg:flex-row`}
    >
      {isLoadingSocial && <Loader />}
      <MyModal modalShow={modalVisible} email={profile?.email} handleEmailType={handleEmailType} />
      {/* Mobile Top Header */}
      {!allowSignUp && (
        <div
          className={`${
            persistedTheme === 'dark' ? 'bg-dark' : 'bg-[#389CE3]'
          } flex h-[48px] min-h-[48px] w-full items-center justify-center bg-[#202329] lg:hidden tablet:h-16`}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
            alt="logo"
            className="h-[10px] tablet:h-4"
          />
        </div>
      )}
      {/* Tablet Left Header */}
      {!allowSignUp && (
        <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
            alt="logo"
            className="h-[20vh] w-[23vw]"
          />
        </div>
      )}
      {/* Main Content */}
      <div
        className={`${allowSignUp ? 'w-full rounded-b-[9.76px] py-4 tablet:rounded-b-[26px] tablet:py-7' : 'h-screen lg:w-[calc(100%-36.11%)] lg:rounded-bl-[65px] lg:rounded-tl-[65px]'} dark:bg-dark flex flex-col items-center bg-white dark:bg-gray-200 md:justify-center`}
      >
        <div
          className={`${allowSignUp ? '' : 'mt-[17.3px] w-[80%] md:mt-0 laptop:max-w-[35vw]'} flex flex-col items-center justify-center`}
        >
          {allowSignUp ? (
            <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
              Please create and account to unlock this feature.
            </p>
          ) : (
            <h1 className="text-[18px] font-[700] text-black dark:text-white tablet:text-[35px] tablet:leading-[35px]">
              {location.pathname === '/signup' || location.pathname === '/guest-signup'
                ? 'Create an Account'
                : 'Create Account with Email'}
            </h1>
          )}
          {(location.pathname === '/signup' || location.pathname === '/guest-signup' || allowSignUp) && (
            <SocialLogins
              handleReferralOpen={handleReferralOpen}
              setClickedButtonName={setClickedButtonName}
              allowSignUp={allowSignUp}
            />
          )}
          <Outlet />
          <div
            className="flex gap-3"
            onClick={() => {
              allowSignUp && dispatch(setGuestSignUpDialogue(false));
            }}
          >
            <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
              Already have an account?
            </p>
            <Link to="/signin">
              <p className="text-[11.21px] font-[500] text-blue-200 tablet:text-[20px] laptop:text-[22px]">Sign in</p>
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
