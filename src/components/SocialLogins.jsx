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
    <div className="my-5 flex gap-[21.6px] md:mb-6 md:mt-[37.8px] md:gap-[42px] 5xl:mb-9">
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
          <img
            src="/assets/svgs/google.svg"
            className="mr-2 h-[22px] w-[22px] md:mr-4 md:h-12 md:w-12"
          />{" "}
          Continue with Google
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
        <button className="flex h-[34.3px] w-[142px] items-center rounded-[6.043px] border-[1px] border-gray-200 bg-white px-2 text-center text-[8.951px] font-[500] text-black dark:border-white dark:bg-dark-gray dark:text-white md:h-[67.2px] md:w-[220px] md:px-4 md:text-[17.554px] 2xl:w-[302px] 2xl:whitespace-nowrap 5xl:w-[320px]">
          {persistedTheme === "dark" ? (
            <img
              src="/assets/svgs/facebook.svg"
              className="mr-1 h-[22px] w-[22px] md:mr-4 md:h-12 md:w-12"
            />
          ) : (
            <img
              src="/assets/svgs/facebook-white.svg"
              className="mr-1 h-[22px] w-[22px] md:mr-4 md:h-12 md:w-12"
            />
          )}
          Continue with Facebook
        </button>
      </LoginSocialFacebook>
    </div>
  );
};

export default SocialLogins;
