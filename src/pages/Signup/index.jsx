// import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import { signUp } from '../../services/api/userAuth';
// import { useMutation } from '@tanstack/react-query';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Anchor from '../../components/Anchor';
import ReCAPTCHA from 'react-google-recaptcha';
import Typography from '../../components/Typography';
import SocialLogins from '../../components/SocialLogins';
import MyModal from './components/Modal';
import api from '../../services/api/Axios';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import PopUp from '../../components/ui/PopUp';
import { Button as UiButton } from '../../components/ui/Button';
import { LoginSocialGoogle } from 'reactjs-social-login';
import Loader from './components/Loader';
import SocialLoginsDummy from './components/SocialLoginsDummy';
import { signUpGuest } from '../../services/api/userAuth';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { useMutation } from '@tanstack/react-query';
import { referralModalStyle } from '../../constants/styles';
import CredentialRegister from './components/CredentialRegister';
import showToast from '../../components/ui/Toast';
import { GithubAuthProvider, TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { authentication } from '../Dashboard/pages/Profile/pages/firebase-config';

const REDIRECT_URI = window.location.href;

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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
  const [socialAccount, setSocialAccount] = useState({ isSocial: false, data: null });
  const googleRef = useRef(null);
  const fbRef = useRef(null);
  const linkedInRef = useRef(null);
  const instaRef = useRef(null);
  const [clickedButtonName, setClickedButtonName] = useState('');

  const persistedTheme = useSelector((state) => state.utils.theme);

  const handlePopupOpen = () => setIspopup(true);
  const handlePopupClose = () => setIspopup(false);

  const handleReferralOpen = () => setIsReferral(true);

  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoading(false);
  };

  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(authentication, provider)
      .then((data) => {
        console.log('github data', data);
        setProvider('github');
        setProfile(data);
        handleSignUpSocial(data, 'github');
      })
      .catch((err) => {
        setIsLoadingSocial(false);
        console.log(err);
      });
  };

  const loginWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    console.log(authentication);
    signInWithPopup(authentication, provider)
      .then((data) => {
        console.log('twitter data', data);
        setProvider('twitter');
        setProfile(data);
        handleSignUpSocial(data, 'twitter');
      })
      .catch((err) => {
        setIsLoadingSocial(false);
        console.log(err);
      });
  };

  const triggerLogin = async () => {
    if (clickedButtonName === 'facebook') {
      if (fbRef.current) {
        const facebookButton = fbRef.current.querySelector('div'); // or a more specific selector if needed
        if (facebookButton) {
          facebookButton.click();
          setIsLoadingSocial(true);

        }
      }
    }
    if (clickedButtonName === 'google') {
      if (googleRef.current) {
        const facebookButton = googleRef.current.querySelector('div'); // or a more specific selector if needed
        if (facebookButton) {
          facebookButton.click();
          setIsLoadingSocial(true);
        }
      }
    }
    if (clickedButtonName === 'linkedin') {
      if (linkedInRef.current) {
        const facebookButton = linkedInRef.current.querySelector('div'); // or a more specific selector if needed
        if (facebookButton) {
          facebookButton.click();
          setIsLoadingSocial(true);

        }
      }
    }
    if (clickedButtonName === 'github') {
      setIsLoadingSocial(true);
      loginWithGithub();
    }
    if (clickedButtonName === 'twitter') {
      setIsLoadingSocial(true);
      loginWithTwitter();
    }
  };

  // const { mutateAsync: userSignup } = useMutation({
  //   mutationFn: signUp,
  // });

  // const handleSignUpSocialGuest = async (data) => {
  //   try {
  //     data.uuid = localStorage.getItem('uuid');
  //     const res = await api.post(`/user/signUpSocial/guestMode`, data);
  //     if (res.status === 200) {
  //       localStorage.setItem('uuid', res.data.uuid);
  //       localStorage.setItem('userData', JSON.stringify(res.data));
  //       localStorage.removeItem('isGuestMode');
  //       navigate('/');
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message.split(':')[1]);
  //     setIsLoading(false);
  //     setIsLoadingSocial(false);
  //   }
  // };

  // const handleSignUpGuestSocialBadges = async (data, provider) => {
  //   try {
  //     data.uuid = localStorage.getItem('uuid');
  //     data.type = provider;
  //     const res = await api.post(`/user/signUpGuest/SocialBadges`, { data, type: provider });
  //     if (res.status === 200) {
  //       dispatch(addUser(res.data));
  //       localStorage.setItem('uuid', res.data.uuid);
  //       localStorage.setItem('userData', JSON.stringify(res.data));
  //       localStorage.removeItem('isGuestMode');
  //       navigate('/');
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message.split(':')[1]);
  //     setIsLoading(false);
  //     setIsLoadingSocial(false);
  //   }
  // };

  const handleSignUpSocial = async (data, provider) => {
    // console.log('before');
    setSocialAccount({ type: provider, data });
    // if (localStorage.getItem('isGuestMode')) {
    //   if (provider === 'google') {
    //     handleSignUpSocialGuest(data);
    //   } else {
    //     handleSignUpGuestSocialBadges(data, provider);
    //   }
    // } else {
    // handleReferralOpen();
    if (provider) {
      if (provider === 'google') {
        handleSignUpSocialGuest(data);
      } else {
        handleSignUpGuestSocialBadges(data, provider);
      }
    } else {
      handleSignup();
    }

    return;
    // }
  };

  const handleSignUpSocialAfterReferral = async (data) => {
    setSocialAccount({ type: provider, data });

    try {
      const res = await api.post(`/user/signUpUser/social`, {
        data,
      });
      if (res.data.required_action) {
        setModalVisible(true);
        setResData(res.data);
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  const handleSignInSocial = async (data, provider) => {
    try {
      const res = await api.post(`/user/signInUser/social`, {
        data,
      });
      // if(res.data.required_action){
      if (res.status === 200) {
        // localStorage.setItem('uuid', res.data.uuid);
        // localStorage.setItem('userLoggedIn', res.data.uuid);
        // localStorage.removeItem('isGuestMode');
        // localStorage.setItem('jwt', res.data.token);
        // navigate('/');
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  const handleEmailType = async (value) => {
    try {
      if (!value) return showToast('warning', 'emailType');
      setModalVisible(false);
      const res = await api.patch(`/updateBadge/${resData.userId}/${resData.badgeId}`, {
        type: value,
        primary: true,
      });
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userLoggedIn', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('jwt', res.data.token);
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

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
      setIsLoadingSocial(false);
    }
  };

  const handleSignUpGuestSocialBadges = async (data, provider) => {
    try {
      data.uuid = localStorage.getItem('uuid');
      data.type = provider;
      const res = await api.post(`/user/signUpGuest/SocialBadges`, { data, type: provider });
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
      setIsLoadingSocial(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      {isLoadingSocial && <Loader />}
      <MyModal modalShow={modalVisible} email={profile?.email} handleEmailType={handleEmailType} />
      <div
        className={`${persistedTheme === 'dark' ? 'bg-dark' : 'bg-[#389CE3]'
          } flex h-[48px] min-h-[48px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`} alt="logo" className="h-[10px]" />
      </div>
      <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
      <div className="flex h-screen flex-col items-center bg-white md:justify-center lg:w-[calc(100%-36.11%)] lg:rounded-bl-[65px] lg:rounded-tl-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle">
            {location.pathname === '/signup' || location.pathname === '/guest-signup'
              ? 'Create an Account'
              : 'Create Account with Email'}
          </Typography>
          {isPopup ? (
            <SocialLoginsDummy />
          ) : (
            <>
              {(location.pathname === '/signup' || location.pathname === '/guest-signup') && (
                <div className="mt-5 tablet:mt-[45px]">
                  <SocialLogins
                    setProvider={setProvider}
                    setProfile={setProfile}
                    handleSignUpSocial={handleSignUpSocial}
                    setIsLoadingSocial={setIsLoadingSocial}
                    handleReferralOpen={handleReferralOpen}
                    googleRef={googleRef}
                    fbRef={fbRef}
                    linkedInRef={linkedInRef}
                    instaRef={instaRef}
                    setClickedButtonName={setClickedButtonName}
                  />
                  <div className="max-w-auto min-w-[145px] lg:min-w-[305px] ">
                    <Button
                      size="login-btn"
                      color="gray"
                      onClick={() => {
                        if (location.pathname === '/signup') {
                          navigate('/signup/credentials');
                        } else {
                          navigate('/guest-signup/credentials');
                        }
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
                        className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] lg:mr-3 "
                      />
                      Email
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          <Outlet />
          <div className="mt-5 flex gap-3 tablet:mt-14">
            <Typography variant="textBase" className="text-gray-100 dark:text-gray ">
              Already have an account?
            </Typography>
            <Link to="/signin">
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
          setEmail={setEmail}
          setPassword={setPassword}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          handlePopupOpen={handlePopupOpen}
          socialAccount={socialAccount}
          setIsLoadingSocial={setIsLoadingSocial}
          triggerLogin={triggerLogin}
        />
      </BasicModal>

      {/* <PopUp
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
                className="mt-[25px] flex w-full justify-end"
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
      </PopUp> */}
    </div>
  );
}
