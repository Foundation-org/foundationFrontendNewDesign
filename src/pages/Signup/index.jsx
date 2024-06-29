import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { referralModalStyle } from '../../constants/styles';
import { setAskPassword } from '../../features/profile/userSettingSlice';
import showToast from '../../components/ui/Toast';
import Typography from '../../components/Typography';
import SocialLogins from '../../components/SocialLogins';
import MyModal from './components/Modal';
import api from '../../services/api/Axios';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import Loader from './components/Loader';
import { Button } from '../../components/ui/Button';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resData, setResData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [isReferral, setIsReferral] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isPopup, setIspopup] = useState(false);
  const [socialAccount, setSocialAccount] = useState({ isSocial: false, data: null });
  const googleRef = useRef(null);
  const fbRef = useRef(null);
  const linkedInRef = useRef(null);
  const githubRef = useRef(null);
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

  const triggerLogin = async () => {
    if (clickedButtonName === 'google') {
      setIsLoadingSocial(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
    if (clickedButtonName === 'linkedin') {
      setIsLoadingSocial(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
    }
    if (clickedButtonName === 'github') {
      setIsLoadingSocial(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
    }
    if (clickedButtonName === 'facebook') {
      setIsLoadingSocial(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
    }
    if (clickedButtonName === 'twitter') {
      setIsLoadingSocial(true);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
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

  const handleSignUpSocial = async (data, provider) => {
    setSocialAccount({ type: provider, data });

    if (provider) {
      if (provider === 'google') {
        handleSignUpSocialGuest(data);
      } else {
        handleSignUpGuestSocialBadges(data, provider);
      }
    } else {
      handleSignup();
    }
    dispatch(setAskPassword(false));
    return;
  };

  // Google
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
        dispatch(setAskPassword(false));
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      setIsLoading(false);
      setIsLoadingSocial(false);
    }
  };

  // Linkedin, Github, Facebook .....
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
        dispatch(setAskPassword(false));
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
      {/* Mobile Top Header */}
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-[#389CE3]'
        } flex h-[48px] min-h-[48px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`} alt="logo" className="h-[10px]" />
      </div>
      {/* Tablet Left Header */}
      <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
      {/* Main Content */}
      <div className="flex h-screen flex-col items-center bg-white md:justify-center lg:w-[calc(100%-36.11%)] lg:rounded-bl-[65px] lg:rounded-tl-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle">
            {location.pathname === '/signup' || location.pathname === '/guest-signup'
              ? 'Create an Account'
              : 'Create Account with Email'}
          </Typography>

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
                githubRef={githubRef}
                setClickedButtonName={setClickedButtonName}
                RedirectURL={window.location.href}
              />
              <div className="max-w-auto min-w-[145px] lg:min-w-[305px] ">
                <Button
                  variant="auth"
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
    </div>
  );
}
