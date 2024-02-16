import { toast } from 'sonner';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// import { signUp } from '../../services/api/userAuth';
// import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Form from './components/Form';
import Button from '../../components/Button';
import Anchor from '../../components/Anchor';
import ReCAPTCHA from 'react-google-recaptcha';
import Typography from '../../components/Typography';
import SocialLogins from '../../components/SocialLogins';
import MyModal from './components/Modal';
import api from '../../services/api/Axios';
import { FaSpinner } from 'react-icons/fa';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import PopUp from '../../components/ui/PopUp';
import { Button as UiButton } from '../../components/ui/Button';
import { LoginSocialGoogle } from 'reactjs-social-login';
import Loader from './components/Loader';
import SocialLoginsDummy from './components/SocialLoginsDummy';

const REDIRECT_URI = window.location.href;

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resData, setResData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [termConditionCheck, setTermConditionCheck] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [isReferral, setIsReferral] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isPopup, setIspopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [socialAccount, setSocialAccount] = useState({ isSocial: false, data: null });

  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleReferralOpen = () => setIsReferral(true);
  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoading(false);
    setIsLoadingSocial(false);
  }
  const handlePopupOpen = () => setIspopup(true);
  const handlePopupClose = () => setIspopup(false);

  function onChange(value) {
    console.log('Captcha value:', value);
    setCaptchaToken(value);
  }

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPassChange = (e) => {
    setPassword(e.target.value);
  };

  const onReTypePassChange = (e) => {
    setReTypePassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCnfmPasswordVisibility = () => {
    setShowCnfmPassword(!showCnfmPassword);
  };

  // const { mutateAsync: userSignup } = useMutation({
  //   mutationFn: signUp,
  // });

  const handleCancel = () => {
    setEmail('');
  };

  const handleSignup = async () => {
    if (!captchaToken) return toast.warning('Please complete the reCAPTCHA challenge before proceeding.');
    if (!termConditionCheck) return toast.warning('Please accept the terms and conditions to continue!');

    setIsLoadingSocial(true);
    handleReferralOpen();

    // setIsLoading(true);

    // try {
    //   if (password === reTypePassword) {
    //     const resp = await userSignup({ email, password });

    //     if (resp.status === 200) {
    //       toast.success('A verification email has been sent to your email address. Please check your inbox.');

    //       setEmail('');
    //       setPassword('');
    //     }
    //   } else {
    //     toast.warning('Password does not match');
    //   }
    // } catch (e) {
    //   toast.error(e.response.data.message.split(':')[1]);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleSignUpSocial = async (data) => {
    setSocialAccount({ isSocial: true, data });
    handleReferralOpen();
    return;
    // try {
    //   const res = await api.post(`/user/signUpUser/social`, {
    //     data,
    //   });
    //   if (res.data.required_action) {
    //     setModalVisible(true);
    //     setResData(res.data);
    //   }
    // } catch (error) {
    //   toast.error(error.response.data.message.split(':')[1]);
    // }
  };

  const handleSignUpSocialAfterReferral = async (data) => {
    setSocialAccount({ isSocial: true, data });

    try {
      const res = await api.post(`/user/signUpUser/social`, {
        data,
      });
      if (res.data.required_action) {
        setModalVisible(true);
        setResData(res.data);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  const handleSignInSocial = async (data) => {
    try {
      const res = await api.post(`/user/signInUser/social`, {
        data,
      });
      // if(res.data.required_action){
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        // localStorage.setItem('userLoggedIn', res.data.uuid);
        // localStorage.removeItem('isGuestMode');
        // localStorage.setItem('jwt', res.data.token);
        // navigate('/dashboard');
        dispatch(addUser(res.data));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  const handleEmailType = async (value) => {
    try {
      if (!value) return toast.error('Please select the email type!');
      setModalVisible(false);
      const res = await api.patch(`/updateBadge/${resData.userId}/${resData.badgeId}`, {
        type: value,
      });
      if (res.status === 200) {
        localStorage.setItem('uId', res.data.uuid);
        localStorage.setItem('userLoggedIn', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('jwt', res.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  const customModalStyle = {
    backgroundColor: '#FCFCFD',
    boxShadow: 'none',
    border: '0px',
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      {isLoadingSocial && <Loader />}
      <MyModal modalShow={modalVisible} email={profile?.email} handleEmailType={handleEmailType} />
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-blue'
        } flex h-[65px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src="/assets/svgs/logo.svg" alt="logo" className="h-[45px] w-[58px]" />
      </div>
      <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
        <img src="/assets/svgs/logo.svg" alt="logo" className="h-[20vh] w-[23vw]" />
      </div>

      <div className="flex h-screen w-full flex-col items-center bg-white md:justify-center lg:rounded-bl-[65px] lg:rounded-tl-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle">Create Account</Typography>
          {isPopup ? (
            <SocialLoginsDummy />
          ) : (
            <SocialLogins
              setProvider={setProvider}
              setProfile={setProfile}
              handleSignUpSocial={handleSignUpSocial}
              setIsLoadingSocial={setIsLoadingSocial}
            />
          )}
          <Form
            password={password}
            reTypePassword={reTypePassword}
            showPassword={showPassword}
            showCnfmPassword={showCnfmPassword}
            onEmailChange={onEmailChange}
            onPassChange={onPassChange}
            onReTypePassChange={onReTypePassChange}
            togglePasswordVisibility={togglePasswordVisibility}
            toggleCnfmPasswordVisibility={toggleCnfmPasswordVisibility}
            handleCancel={handleCancel}
            email={email}
          />
          <div className="mb-4 mt-4 flex w-full items-start md:mb-10 taller:mb-4 taller:mt-4">
            {persistedTheme === 'dark' ? (
              <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="dark" />
            ) : (
              <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="light" />
            )}
          </div>
          <div className="mb-12 flex items-start taller:mb-7">
            <div className="form-control mt-[7px] md:mt-0">
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
              Creating an account means you have agreed with our{' '}
              <Anchor href="/term-of-service">Terms of Service</Anchor> &{' '}
              <Anchor href="/privacy-policy">Privacy Policy</Anchor>.         
            </label>
          </div>
          <Button
            size="large"
            color="blue-200"
            onClick={() => {
              handleSignup();
            }}
            disabled={isLoading === true ? true : false}
          >
            Create Account
          </Button>
          <div className="mt-[10px] flex gap-3 tablet:mt-[23px]">
            <Typography variant="textBase" className="text-gray-100 dark:text-gray ">
              Already have an account?
            </Typography>
            <Link to="/">
              <Typography variant="textBase" className="text-blue dark:text-white">
                Sign in
              </Typography>
            </Link>
          </div>
        </div>
      </div>
      <BasicModal
        open={isReferral}
        handleClose={handleReferralClose}
        customStyle={customModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <ReferralCode
          handleClose={handleReferralClose}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          password={password}
          reTypePassword={reTypePassword}
          email={email}
          setEmail={setEmail}
          setPassword={setPassword}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          setErrorMessage={setErrorMessage}
          handlePopupOpen={handlePopupOpen}
          socialAccount={socialAccount}
          setIsLoadingSocial={setIsLoadingSocial}
        />
      </BasicModal>

      <PopUp open={isPopup} handleClose={handlePopupClose} logo={'/assets/popup/googlelogo.svg'} title={'Google Email'}>
        <div className="px-5 tablet:px-[60px] py-[14px] tablet:py-[25px]">
          <p className="text-[9px] tablet:text-[20px] text-black font-medium">{errorMessage}</p>
          {/* {
           <UiButton variant="submit" className="mt-[10px] tablet:mt-[25px]" onClick={handlePopupClose}>
              Continue
            </UiButton> 

            console.log(errorMessage)
          } */}
          {errorMessage.trim() === 'Email Already Exists' ? (
            <div className="w-full flex justify-end mt-[25px]">
              <UiButton
                className="w-full flex justify-end mt-[25px]"
                onClick={() => {
                  navigate('/');
                }}
                variant={'submit'}
              >
                Login
              </UiButton>
            </div>
          ) : (
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
                isLogin ? handleSignInSocial(data) : handleSignUpSocialAfterReferral(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
              className="w-full flex justify-end mt-[25px]"
            >
              <UiButton
                variant="social-btn"
                // onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, '_self')}
              >
                <img src="/assets/svgs/google.svg" className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] " /> Continue
                with Google
              </UiButton>
            </LoginSocialGoogle>
          )}
        </div>
      </PopUp>
    </div>
  );
}
