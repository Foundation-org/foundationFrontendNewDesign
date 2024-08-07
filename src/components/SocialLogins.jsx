import { Button } from './ui/Button';
import { authMethods } from '../constants/authentication';
import { useLocation, useNavigate } from 'react-router-dom';

const isWebview = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  // Common webview identifiers or patterns
  const webviewIdentifiers = [
    'wv', // Common abbreviation for webview
    'webview', // Webview identifier
    'fbav', // Facebook App WebView
    'instagram', // Instagram WebView
    'twitter', // Twitter WebView
  ];

  // Check if any of the webview identifiers exist in the userAgent string
  return webviewIdentifiers.some((identifier) => userAgent.includes(identifier));
};
const SocialLogins = ({ handleReferralOpen, setClickedButtonName, isLogin, triggerLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const filteredAuthMethods = authMethods.filter((item) => {
    if (isWebview()) {
      // If isWebview() is true, exclude items with title 'Google'
      return item.title !== 'Google';
    }
    // If isWebview() is false, include all items
    return true;
  });
  return (
    <div className="mb-2 flex min-w-[145px] flex-col gap-2 rounded-[6.043px] 2xl:rounded-[11.703px] tablet:min-w-[220px] laptop:mb-[1.56rem] laptop:min-w-[305px] laptop:justify-between laptop:gap-[1.56rem]">
      {isWebview() && (
        <Button
          variant="auth"
          onClick={() => {
            if (location.pathname === '/signin') {
              navigate('/signin/credentials');
            } else if (location.pathname === '/signup') {
              navigate('/signup/credentials');
            } else {
              navigate('/guest-signup/credentials');
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
              className="mr-2 w-[22px] md:w-8 lg:mr-3"
            />
            Email
          </div>
        </Button>
      )}
      {filteredAuthMethods.map((item) => (
        <Button
          variant="auth"
          key={item.id}
          onClick={() => {
            if (isLogin) {
              localStorage.setItem('target-url', `${window.location.href}`);
              triggerLogin(item.provider);
            } else {
              localStorage.setItem('target-url', `${window.location.href}`);
              setClickedButtonName(item.provider);
              handleReferralOpen(item.provider);
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${item.img}`} className="mr-2 w-[22px] md:w-8 lg:mr-3" />
            {item.title}
          </div>
        </Button>
      ))}
      {!isWebview() && (
        <Button
          variant="auth"
          onClick={() => {
            if (location.pathname === '/signin') {
              navigate('/signin/credentials');
            } else if (location.pathname === '/signup') {
              navigate('/signup/credentials');
            } else {
              navigate('/guest-signup/credentials');
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
              className="mr-2 w-[22px] md:w-8 lg:mr-3"
            />
            Email
          </div>
        </Button>
      )}
    </div>
  );
};

export default SocialLogins;
