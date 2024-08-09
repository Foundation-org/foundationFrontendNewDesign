import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { referralModalStyle } from '../../../constants/styles';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { Button as UiButton } from '../../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../../../features/auth/authSlice';
import Input from '../../../components/Input';
import api from '../../../services/api/Axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../../../components/Button';
import PopUp from '../../../components/ui/PopUp';
import showToast from '../../../components/ui/Toast';
import BasicModal from '../../../components/BasicModal';
import ReferralCode from '../../../components/ReferralCode';
import PasswordStrengthBar from 'react-password-strength-bar';

const CredentialRegister = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const [termConditionCheck, setTermConditionCheck] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isReferral, setIsReferral] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isPopup, setIspopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const cnfmPassInputType = showCnfmPassword ? 'text' : 'password';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePopupClose = () => setIspopup(false);

  const handlePopupOpen = () => setIspopup(true);

  const handleReferralOpen = () => setIsReferral(true);

  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoading(false);
  };

  function onChange(value) {
    setCaptchaToken(value);
  }

  const onEmailChange = (e) => setEmail(e.target.value);
  const onPassChange = (e) => setPassword(e.target.value);
  const onReTypePassChange = (e) => setReTypePassword(e.target.value);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleCnfmPasswordVisibility = () => setShowCnfmPassword(!showCnfmPassword);

  const handleCancel = () => setEmail('');

  const handleSignUpSocialGuest = async (data) => {
    try {
      data.uuid = localStorage.getItem('uuid');
      const res = await api.post(`/user/signUpSocial/guestMode`, data);
      console.log('new', res);
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));

        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      setIsLoading(false);
    }
  };
  const handleSignup = async () => {
    if (!termConditionCheck) return showToast('warning', 'termsAndConditions');
    handleReferralOpen();
  };

  const getCancelIconSrc = () => {
    return persistedTheme === 'dark'
      ? `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelDark.svg`
      : `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelLight.svg`;
  };

  const getPasswordIconSrc = (isVisible) => {
    if (!isVisible) {
      return persistedTheme === 'dark'
        ? `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`
        : `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`;
    }
    return persistedTheme === 'dark'
      ? `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`
      : `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`;
  };

  return (
    <>
      <form className="mt-11 flex w-full flex-col gap-11 text-silver-600 tablet:mt-16 5xl:gap-14 short:gap-[38px] dark:text-white">
        <div className="relative grid w-full grid-cols-[1fr] items-center">
          <Input
            type="email"
            id="email"
            label="Email Address"
            className="autofill_text_color dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white  py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-transparent dark:focus:border-white"
            autoComplete="sign-email"
            onChange={onEmailChange}
            value={email}
          />
          {email && (
            <img
              src={getCancelIconSrc()}
              alt="cancel"
              className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
              onClick={handleCancel}
            />
          )}
        </div>
        <div className="flex flex-col gap-5">
          <div className="h-[50px] xl:h-[66px]">
            <div className="relative grid w-full grid-cols-[1fr] items-center">
              <Input
                type={inputType}
                id="password"
                label="Password"
                className="autofill_text_color dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-transparent dark:focus:border-white "
                autoComplete="new-password"
                onChange={onPassChange}
              />
              <img
                src={getPasswordIconSrc(showPassword)}
                alt="password visibility toggle"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="relative -top-1 mt-1 h-[19px]">
              {password && <PasswordStrengthBar password={password} />}
            </div>
          </div>
          <div className="h-[50px] xl:h-[66px]">
            <div className="relative grid w-full grid-cols-[1fr] items-center">
              <Input
                type={cnfmPassInputType}
                id="cnfmpassword"
                label="Re-type Password"
                className="dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white  py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-transparent dark:focus:border-white "
                autoComplete="new-password"
                onChange={onReTypePassChange}
              />
              <img
                src={getPasswordIconSrc(showCnfmPassword)}
                alt="password visibility toggle"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={toggleCnfmPasswordVisibility}
              />
            </div>
            <div className="relative -top-1 mt-1 h-[19px]">
              {reTypePassword && <PasswordStrengthBar password={reTypePassword} />}
            </div>
          </div>
        </div>
      </form>
      <div className="mb-4 mt-4 hidden w-full items-start md:mb-10 taller:mb-4 taller:mt-4">
        {persistedTheme === 'dark' ? (
          <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="dark" />
        ) : (
          <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="light" />
        )}
      </div>
      <div className="mb-12 flex w-full items-center taller:mb-7">
        <div className="form-control">
          <label className="label flex cursor-pointer gap-[11.5px] p-0">
            <input
              type="checkbox"
              onChange={(e) => setTermConditionCheck(e.target.checked)}
              checked={termConditionCheck}
              className="checkbox h-[11.725px] w-[11.725px] rounded-[2.9px] border-[1.437px] border-[#D6D6D6] md:h-[23px] md:w-[23px] md:rounded-[3.5px] "
            />
          </label>
        </div>
        <label className="ml-4 text-[10.2px] text-gray-100 tablet:text-base 5xl:text-[22px] short:text-[12px] dark:text-white">
          Creating an account means you have agreed with our{` `}
          <Link
            to="/term-of-service"
            className="cursor-pointer text-[8.158px] font-normal leading-[8.158px] text-blue-100 hover:underline md:text-[16px] tablet:leading-[22px] short:text-[12px] dark:text-white"
          >
            Terms of Service
          </Link>
          {` `}&{' '}
          <Link
            to="/privacy-policy"
            className="cursor-pointer text-[8.158px] font-normal leading-[8.158px] text-blue-100 hover:underline md:text-[16px] tablet:leading-[22px] short:text-[12px] dark:text-white"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      <Button
        size="large"
        color="blue-200"
        onClick={() => {
          handleSignup();
        }}
        disabled={(isLoading === true ? true : false) || !email || !password || !reTypePassword}
      >
        Create Account
      </Button>
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
          setErrorMessage={setErrorMessage}
          setEmail={setEmail}
          setPassword={setPassword}
          setReTypePassword={setReTypePassword}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          handlePopupOpen={handlePopupOpen}
          credential={true}
        />
      </BasicModal>

      <PopUp
        open={isPopup}
        handleClose={handlePopupClose}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/popup/googlelogo.svg`}
        title={'Google Email'}
      >
        <div className="px-5 py-[14px] tablet:px-[60px] tablet:py-[25px]">
          <p className="text-[9px] font-medium text-black tablet:text-[20px]">{errorMessage}</p>
          {errorMessage.trim() === 'Email Already Exists' ? (
            <div className="mt-[25px] flex w-full justify-end">
              <UiButton
                onClick={() => {
                  navigate('/signin');
                }}
                variant={'submit'}
              >
                Login
              </UiButton>
            </div>
          ) : (
            <LoginSocialGoogle
              client_id={import.meta.env.VITE_GG_APP_ID}
              redirect_uri={window.location.href}
              scope="openid profile email"
              iscoveryDocs="claims_supported"
              // access_type="offline"
              onResolve={({ provider, data }) => {
                data['provider'] = provider;
                handleSignUpSocialGuest(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
              className="mt-[25px] flex w-full justify-end"
            >
              <UiButton variant="social-btn">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/google.svg`}
                  className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] "
                />{' '}
                Continue with Google
              </UiButton>
            </LoginSocialGoogle>
          )}
        </div>
      </PopUp>
    </>
  );
};

export default CredentialRegister;
