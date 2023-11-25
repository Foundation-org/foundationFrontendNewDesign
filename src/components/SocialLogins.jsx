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
    <div className="flex gap-[42px] mt-[37.8px] mb-6 5xl:mb-9">
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
          <img src="/assets/svgs/google.svg" className="mr-4" /> Sign up with
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
        <Button size="medium" color="gray">
          {persistedTheme === "dark" ? (
            <img src="/assets/svgs/facebook.svg" className="mr-4" />
          ) : (
            <img src="/assets/svgs/facebook-white.svg" className="mr-4" />
          )}{" "}
          Sign up with Facebook
        </Button>
      </LoginSocialFacebook>
    </div>
  );
};

export default SocialLogins;
