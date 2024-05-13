import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { signIn, userInfo } from '../../services/api/userAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import CredentialLogin from './components/CredentialLogin';

export default function Signin() {
  const navigate = useNavigate();
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

  const handleReferralOpen = () => {
    setIsReferral((prev) => !prev);
  };

  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoadingSocial(false);
  };

  const handleSignInSocial = async (data) => {
    try {
      const res = await api.post(`/user/signInUser/social`, {
        data,
      });

      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    } finally {
      setIsLoadingSocial(false);
    }
  };

  // useEffect(() => {
  //   if (authO === 'auth0') {
  //     queryClient.invalidateQueries(['userInfo']);
  //   }
  // }, [authO]);

  return (
    <div className="flex h-dvh w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      {isLoadingSocial && <Loader />}
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-blue'
        } flex h-[65px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[45px] w-[58px]"
        />
      </div>
      <div className="flex h-full w-[calc(100%-36.11%)] flex-col items-center bg-white md:justify-center lg:rounded-br-[65px] lg:rounded-tr-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle" className="text-center tablet:text-left">
            Login
          </Typography>
          <div className="my-5 tablet:my-[45px]">
            <SocialLogins
              setProvider={setProvider}
              setProfile={setProfile}
              handleSignInSocial={handleSignInSocial}
              isLogin={true}
              setIsLoadingSocial={setIsLoadingSocial}
            />
            <div className="min-w-80 max-w-80">
              <Button
                size="login-btn"
                color="gray"
                onClick={() => {
                  setIsLoadingSocial(true);
                }}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
                  className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] "
                />
                Continue with Email
              </Button>
            </div>
          </div>
          <CredentialLogin />
          <div className="flex justify-center gap-3">
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
