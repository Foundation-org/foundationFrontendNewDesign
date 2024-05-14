import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';
import { useSelector } from 'react-redux';
import Button from './Button';

const REDIRECT_URI = window.location.href;

const SocialLogins = ({
  setProvider,
  setProfile,
  handleSignUpSocial,
  handleSignInSocial,
  isLogin,
  setIsLoadingSocial,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="mb-2 flex flex-col gap-2 rounded-[6.043px] lg:mb-[1.56rem] 2xl:rounded-[11.703px] laptop:justify-between laptop:gap-[1.56rem]">
      <LoginSocialGoogle
        // isOnlyGetToken
        client_id={import.meta.env.VITE_GG_APP_ID}
        redirect_uri={REDIRECT_URI}
        scope="openid profile email"
        iscoveryDocs="claims_supported"
        // access_type="offline"
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
          data['provider'] = provider;
          isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
        }}
        onReject={(err) => {
          setIsLoadingSocial(false);
          console.log(err);
        }}
        className="max-w-auto min-w-[145px] lg:min-w-[305px] lg:max-w-[305px]"
      >
        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            setIsLoadingSocial(true);
          }}
          // onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, '_self')}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/google.svg`}
            className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] lg:mr-3"
          />
          Continue with Google
        </Button>
      </LoginSocialGoogle>
      <LoginSocialFacebook
        // isOnlyGetToken
        appId={import.meta.env.VITE_FB_APP_ID}
        onResolve={({ provider, data }) => {
          console.log(provider);
          setProvider(provider);
          setProfile(data);
          isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
        }}
        redirect_uri={REDIRECT_URI}
        onReject={(err) => {
          console.log(err);
        }}
        className="max-w-auto min-w-[145px] lg:min-w-[305px] lg:max-w-[305px]"
      >
        <button
          className="flex h-[36px] w-full items-center whitespace-nowrap rounded-[6.043px] border-[1px] border-gray-200 bg-white px-2 text-center text-[2.3vw] font-[500] text-black sm:h-[50px] sm:text-[2.1vw] lg:h-[60px] lg:text-[.98vw] 2xl:rounded-[11.703px] 2xl:px-4 dark:border-white dark:bg-dark-gray dark:text-white "
          // onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/facebook`, '_self')}
        >
          {persistedTheme === 'dark' ? (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/facebook.svg`}
              className="mr-[0.5rem] h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-3"
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/facebook-white.svg`}
              className="mr-[0.5rem] h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-3"
            />
          )}
          <span className="inline-block align-middle">Continue with Facebook</span>
        </button>
      </LoginSocialFacebook>
    </div>
  );
};

export default SocialLogins;
