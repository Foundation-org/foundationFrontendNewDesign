import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import LegacyConfirmationPopup from '../../components/dialogue-boxes/LegacyConfirmationPopup';
import SocialLogins from '../../components/SocialLogins';
import '../../index.css';
import showToast from '../../components/ui/Toast';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';
import { FaSpinner } from 'react-icons/fa';

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

export default function Signin() {
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [uuid, setUuid] = useState();
  const dispatch = useDispatch();
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
        // if (isWebview()) {
        //   showToast('info', 'webViewLogin');
        //   setIsLoadingSocial(false);
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
        // }
        break;

      case 'linkedin':
        // if (!isWebview()) {
        //   showToast('info', 'webViewLogin');
        //   setIsLoadingSocial(false);
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
        // }
        break;

      case 'github':
        // if (!isWebview()) {
        //   showToast('info', 'webViewLogin');
        //   setIsLoadingSocial(false);
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
        // }
        break;

      case 'facebook':
        // if (!isWebview()) {
        //   showToast("info", "webViewLogin");
        //   setIsLoadingSocial(false);
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
        // }
        break;

      case 'instagram':
        // if (isWebview()) {
        //   showToast("info", "webViewLogin");
        //   setIsLoadingSocial(false);
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/instagram`;
        // }
        break;

      case 'twitter':
        // if (!isWebview()) {
        //   showToast("info", "webViewLogin");
        //   setIsLoadingSocial(false);
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
        // }
        break;

      default:
        setIsLoadingSocial(false);
        break;
    }
  };

  return (
    <div className="flex w-full flex-col rounded-b-[9.76px] bg-white text-white dark:bg-black lg:flex-row tablet:rounded-b-[26px]">
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
      <div className="dark:bg-dark flex w-full flex-col items-center rounded-b-[9.76px] bg-white py-4 dark:bg-gray-200 md:justify-center tablet:rounded-b-[26px] tablet:py-7">
        <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
          Login
        </p>
        {isLoadingSocial ? (
          <div className="my-5 flex flex-col items-center justify-center gap-4 tablet:my-10">
            <FaSpinner className="animate-spin text-[8vw] text-blue-200 tablet:text-[4vw]" />
          </div>
        ) : (
          <SocialLogins setClickedButtonName={setClickedButtonName} isLogin={true} triggerLogin={triggerLogin} />
        )}
        <div className="flex justify-center gap-3">
          <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
            Don’t have an account?
          </p>
          <button
            className="text-[11.21px] font-[500] text-blue-200 tablet:text-[20px] laptop:text-[22px]"
            onClick={() => {
              dispatch(setGuestSignUpDialogue(true));
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
