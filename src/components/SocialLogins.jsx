// import { useCallback } from 'react';
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
import { useSelector } from "react-redux";
import Button from "./Button";

const REDIRECT_URI = window.location.href;

const SocialLogins = ({ setProvider, setProfile, handleSignUpSocial, handleSignInSocial, isLogin }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  // const onLogoutSuccess = useCallback(() => {
  //   setProfile(null);
  //   setProvider('');
  //   alert('logout success');
  // }, []);

  return (
    <div className="my-5 flex w-full gap-2 md:mb-6 md:mt-[37.8px] 2xl:mb-[41.75px] laptop:w-[35.2vw] laptop:justify-between laptop:gap-10 5xl:mb-9 tall:my-4 rounded-[6.043px] 2xl:rounded-[11.703px] ">
      {/* <LoginSocialGoogle
        // isOnlyGetToken
        client_id={import.meta.env.VITE_GG_APP_ID}
        redirect_uri={REDIRECT_URI}
        scope="openid profile email"
        iscoveryDocs="claims_supported"
        // access_type="offline"
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
          isLogin ? handleSignInSocial(data) : handleSignUpSocial(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
        className="w-full"
      >
      </LoginSocialGoogle> */}
        <Button size="login-btn" color="gray" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self")}>
          <img
            src="/assets/svgs/google.svg"
            className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] "
          />{" "}
          Continue with Google
        </Button>
      <LoginSocialFacebook
        // isOnlyGetToken
        appId={import.meta.env.VITE_FB_APP_ID}
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
          isLogin ? handleSignInSocial(data) : handleSignUpSocial(data);
        }}
        redirect_uri={REDIRECT_URI}
        onReject={(err) => {
          console.log(err);
        }}
        className="container w-full"
      >
        <button className="flex justify-center h-[36px] sm:h-[50px] lg:h-[60px] w-full items-center whitespace-nowrap rounded-[6.043px] border-[1px] border-gray-200 bg-white px-2 text-center text-[2.3vw] font-[500] text-black dark:border-white dark:bg-dark-gray dark:text-white sm:text-[2.1vw] lg:text-[.98vw] 2xl:rounded-[11.703px] 2xl:px-4 ">
          {persistedTheme === "dark" ? (
            <img
              src="/assets/svgs/facebook.svg"
              className="mr-1 h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-3"
            />
          ) : (
            <img
              src="/assets/svgs/facebook-white.svg"
              className="mr-1 h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-3"
            />
          )}
            <span className="inline-block align-middle">Continue with Facebook</span>

        </button>
      </LoginSocialFacebook>
    </div>
  );
};

export default SocialLogins;
