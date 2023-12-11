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
    <div className="laptop:gap-6 my-5 flex gap-2 md:mb-6 md:mt-[37.8px] 5xl:mb-9 tall:my-4">
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
            className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] taller:h-6"
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
        <button className="flex h-[34.3px] w-fit items-center whitespace-nowrap rounded-[6.043px] border-[1px] border-gray-200 bg-white px-2 text-center text-[8.951px] font-[500] text-black dark:border-white dark:bg-dark-gray dark:text-white md:h-[67.2px] md:text-[15px] 2xl:rounded-[11.703px] 2xl:px-4 2xl:text-[17.554px] 5xl:w-[320px] taller:h-[52px]">
          {persistedTheme === "dark" ? (
            <img
              src="/assets/svgs/facebook.svg"
              className="mr-1 h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-2 taller:h-6"
            />
          ) : (
            <img
              src="/assets/svgs/facebook-white.svg"
              className="mr-1 h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-2 taller:h-6"
            />
          )}
          Continue with Facebook
        </button>
      </LoginSocialFacebook>
    </div>
  );
};

export default SocialLogins;
