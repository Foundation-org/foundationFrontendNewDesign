import { LoginSocialGoogle } from 'reactjs-social-login';
import PopUp from '../../../../../components/ui/PopUp';
import { Button } from '../../../../../components/ui/Button';

const REDIRECT_URI = window.location.href;

const VerificationPopups = ({ isPopup, setIsPopup, title, logo, placeholder }) => {
  const handleClose = () => {
    setIsPopup(false);
  };

  return (
    <div>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="pt-[30px] pb-5">
          <LoginSocialGoogle
            // isOnlyGetToken
            client_id={import.meta.env.VITE_GG_APP_ID}
            redirect_uri={REDIRECT_URI}
            scope="openid profile email"
            iscoveryDocs="claims_supported"
            // access_type="offline"
            onResolve={({ provider, data }) => {
              //   setProvider(provider);
              //   setProfile(data);
              //   data['provider'] = provider;
              //   isLogin ? handleSignInSocial(data) : handleSignUpSocialAfterReferral(data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
            className="w-full flex justify-center"
          >
            <Button
              variant="social-btn"
              // onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, '_self')}
            >
              <img src="/assets/svgs/google.svg" className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] " /> Continue
              with Google
            </Button>
          </LoginSocialGoogle>
          <div className="px-[80px]">
            <h1 className="text-[#707175] text-[25px] font-medium leading-[30px] text-center my-[15px]">-OR-</h1>
            <label htmlFor="email" className="text-[#7C7C7C] text-[20px] leading-[24.2px] font-medium">
              {title}
            </label>
            <input
              type="email"
              placeholder={placeholder}
              className="w-full text-[18px] leading-[21px] font-medium text-[#B6B4B4] border-[3px] border-[#DEE6F7] bg-[#FBFBFB] rounded-[15px] py-[18px] px-[16px] focus:outline-none mt-[15px] mb-5"
            />
            <div className="flex justify-end">
              <Button variant="submit">Verify Email</Button>
            </div>
          </div>
        </div>
      </PopUp>
    </div>
  );
};

export default VerificationPopups;
