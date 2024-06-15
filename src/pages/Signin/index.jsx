import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { signIn, userInfo } from '../../services/api/userAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import SocialLogins from '../../components/SocialLogins';
import ReCAPTCHA from 'react-google-recaptcha';
import '../../index.css';
import api from '../../services/api/Axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import { sendVerificationEmail } from '../../services/api/authentication';
import Loader from '../Signup/components/Loader';
import { referralModalStyle } from '../../constants/styles';
import LegacyConfirmationPopup from '../../components/dialogue-boxes/LegacyConfirmationPopup';
import showToast from '../../components/ui/Toast';

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { authO } = useParams();
  const queryClient = useQueryClient();
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const [isReferral, setIsReferral] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [uuid, setUuid] = useState();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState();
  const legacyPromiseRef = useRef();

  const handleReferralOpen = () => {
    setIsReferral((prev) => !prev);
  };

  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoadingSocial(false);
  };

  const handleSignInSocial = async (data, provider) => {
    try {
      let res;
      if (provider === 'google') {
        res = await api.post(`/user/signInUser/social`, {
          data,
        });
      } else {
        res = await api.post(`/user/signInUser/socialBadges`, { data, type: provider });
      }
      if (res.data.isPasswordEncryption) {
        setUuid(res.data.uuid);
        await handleOpenPasswordConfirmation();
      } else {
        if (res.status === 200) {
          localStorage.setItem('uuid', res.data.uuid);
          localStorage.setItem('userData', JSON.stringify(res.data));
          localStorage.removeItem('isGuestMode');
          dispatch(addUser(res.data));
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log({ error });
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    } finally {
      setIsLoadingSocial(false);
    }
  };

  const handleOpenPasswordConfirmation = () => {
    setIsPasswordConfirmation(true);
    return new Promise((resolve) => {
      legacyPromiseRef.current = resolve;
    });
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      <LegacyConfirmationPopup
        isPopup={isPasswordConfirmation}
        setIsPopup={setIsPasswordConfirmation}
        title="Confirm Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        legacyPromiseRef={legacyPromiseRef}
        login={true}
        uuid={uuid}
        setIsLoadingSocial={setIsLoadingSocial}
      />
      {isLoadingSocial && <Loader />}
      <div
        className={`${persistedTheme === 'dark' ? 'bg-dark' : 'bg-[#389CE3]'
          } flex h-[48px] min-h-[48px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`} alt="logo" className="h-[10px]" />
      </div>
      <div className="flex h-full flex-col items-center bg-white md:justify-center lg:w-[calc(100%-36.11%)] lg:rounded-br-[65px] lg:rounded-tr-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle" className="text-center tablet:text-left">
            {location.pathname === '/signin' ? 'Login' : 'Login with Email'}
          </Typography>
          {location.pathname === '/signin' && (
            <div className="mt-5 tablet:mt-[45px]">
              <SocialLogins
                setProvider={setProvider}
                setProfile={setProfile}
                handleSignInSocial={handleSignInSocial}
                isLogin={true}
                setIsLoadingSocial={setIsLoadingSocial}
              />
              <div className="max-w-auto min-w-[145px] lg:min-w-[305px] ">
                <Button size="login-btn" color="gray" onClick={() => navigate('/signin/credentials')}>
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
          <div className="mt-5 flex justify-center gap-3 tablet:mt-14">
            <Typography variant="textBase" className="text-gray-100 dark:text-gray">
              Don’t have an account?
            </Typography>
            <Link to={persistedUserInfo && persistedUserInfo.role === 'guest' ? '/guest-signup' : '/signup'}>
              <Typography variant="textBase" className="text-blue dark:text-white">
                Sign up
              </Typography>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden h-screen w-fit items-center px-32 lg:flex">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
      <BasicModal
        open={isReferral}
        handleClose={handleReferralClose}
        customStyle={referralModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <ReferralCode
          handleClose={handleReferralClose}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          uuid={uuid}
        />
      </BasicModal>
    </div>
  );
}
