// import { useCallback } from 'react';
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
import { useSelector } from "react-redux";
import Button from "./Button";

const REDIRECT_URI = window.location.href;

const SocialLogins = ({ setProvider, setProfile }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  // const onLogoutSuccess = useCallback(() => {
  //   setProfile(null);
  //   setProvider('');
  //   alert('logout success');
  // }, []);

  return (
    <div className="mb-6 mt-[37.8px] flex gap-[42px] 5xl:mb-9">
      <LoginSocialGoogle
        isOnlyGetToken
        client_id={import.meta.env.VITE_GG_APP_ID}
        redirect_uri={REDIRECT_URI}
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
        <Button size="medium" color="gray">
          <img src="/assets/svgs/google.svg" className="mr-4" /> Continue with
          Google
        </Button>
      </LoginSocialGoogle>
      <LoginSocialFacebook
        isOnlyGetToken
        appId={import.meta.env.VITE_FB_APP_ID}
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
        <button className="flex h-[67.2px] w-[302px] items-center whitespace-nowrap rounded-[11.073px] border-[1px] border-gray-200 bg-white px-4 text-center text-[17.554px] font-[500] text-black dark:border-white dark:bg-dark-gray dark:text-white 5xl:w-[320px]">
          {persistedTheme === "dark" ? (
            <img src="/assets/svgs/facebook.svg" className="mr-4" />
          ) : (
            <img src="/assets/svgs/facebook-white.svg" className="mr-4" />
          )}
          Continue with Facebook
        </button>
      </LoginSocialFacebook>
    </div>
  );
};

export default SocialLogins;
