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
import Form from './components/Form';
import ReCAPTCHA from 'react-google-recaptcha';
import '../../index.css';
import api from '../../services/api/Axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import { sendVerificationEmail } from '../../services/api/authentication';
import Loader from '../Signup/components/Loader';

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authO } = useParams();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(null);
  const [capthaToken, setCaptchaToken] = useState('');
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
    setIsLoading(false);
    setIsLoadingSocial(false);
  };

  function onChange(value) {
    console.log('Captcha value:', value);
    setCaptchaToken(value);
  }

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCancel = () => {
    setEmail('');
  };

  const onPassChange = (e) => {
    setPassword(e.target.value);
  };

  const { mutateAsync: userSignin } = useMutation({
    mutationFn: signIn,
  });

  const handleSignin = async () => {
    setIsLoading(true);
    try {
      // const recaptchaResp = await axios({
      //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${
      //     import.meta.env.VITE_GOOGLE_RECAPTCH_SECRET_KEY
      //   }&response=${capthaToken}`,
      //   method: 'POST',
      // });

      // if (recaptchaResp.success) {
      // if (capthaToken !== '') {
      if (capthaToken === '') {
        const resp = await userSignin({ email, password });

        if (resp.status === 200) {
          localStorage.removeItem('isGuestMode');
          queryClient.invalidateQueries(['userInfo']);
          setEmail('');
          setPassword('');
        }
      } else {
        toast.warning('Please complete the reCAPTCHA challenge before proceeding.');
      }
      // } else {
      //   toast.error('Google recaptcha failed');
      // }
    } catch (e) {
      console.log(e);
      if (e.response.data === 'Wrong Password') {
        toast.error('Your typed password is incorrect.');
      } else if (
        e.response.data.message === 'An error occurred while signInUser Auth: data and hash arguments required'
      ) {
        toast.error('Your typed password is incorrect.');
      } else if (e.response.data.message === 'An error occurred while signInUser Auth: User not Found') {
        toast.error('Oops! User not found');
      } else {
        toast.error(e.response.data.message.split(':')[1]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const { mutateAsync: sendEmail } = useMutation({
  //   mutationFn: sendVerificationEmail,
  //   onSuccess: (res) => {
  //     console.log('Email sent');
  //   },
  //   onError: (error) => {
  //     console.error('Email not sent', error);
  //   },
  // });

  // const {
  //   data: userInfoData,
  //   isSuccess: userInfoSuccess,
  //   isError: userInfoError,
  // } = useQuery({
  //   queryKey: ['userInfo'],
  //   queryFn: userInfo,
  // });

  // if (userInfoSuccess && userInfoData?.status === 200) {
  //   if (userInfoData.data) {
  //     setUuid(userInfoData.data?.uuid);

  //     if (userInfoData.data?.verification === false) {
  //       toast.warning('Please check you email and verify your account first');
  //       sendEmail({ userEmail: userInfoData.data?.email });
  //     }
  //     if (userInfoData.data?.verification === true) {
  //       dispatch(addUser(userInfoData.data));
  //       navigate('/dashboard');
  //     }
  //   }
  // }

  // if (userInfoError) {
  //   console.log({ userInfoError });
  //   localStorage.setItem('loggedIn', 'false');
  // }

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
      <div className="flex h-full w-full flex-col items-center bg-white md:justify-center lg:rounded-br-[65px] lg:rounded-tr-[65px] dark:bg-dark">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle" className="text-center tablet:text-left">
            Sign in
          </Typography>
          <SocialLogins
            setProvider={setProvider}
            setProfile={setProfile}
            handleSignInSocial={handleSignInSocial}
            isLogin={true}
            setIsLoadingSocial={setIsLoadingSocial}
          />
          <Form onEmailChange={onEmailChange} onPassChange={onPassChange} handleCancel={handleCancel} email={email} />
          <div className="mb-4 mt-4 hidden w-full items-start md:mb-10 laptop:mb-[5.5rem] laptop:mt-[2.5rem] taller:mb-[30px] taller:mt-[35px]">
            {persistedTheme === 'dark' ? (
              <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="dark" />
            ) : (
              <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="light" />
            )}
          </div>
          <Button
            size="large"
            color="blue-200"
            onClick={() => {
              handleSignin();
            }}
            disabled={isLoading === true ? true : false}
          >
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Sign in'}
          </Button>
          <div className="mt-[10px] flex justify-center gap-3 tablet:mt-[23px]">
            <Typography variant="textBase" className="text-gray-100 dark:text-gray">
              Do not have an account?
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
        customStyle={customModalStyle}
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
