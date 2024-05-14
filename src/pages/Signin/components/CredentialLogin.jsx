import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../components/Input';
import Anchor from '../../../components/Anchor';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../../../components/Button';
import { FaSpinner } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '../../../services/api/userAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addUser } from '../../../features/auth/authSlice';

const CredentialLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [capthaToken, setCaptchaToken] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPassChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCancel = () => {
    setEmail('');
  };

  const { mutateAsync: userSignin } = useMutation({
    mutationFn: signIn,
  });

  const handleSignin = async () => {
    // setIsLoading(true);
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
          setEmail('');
          setPassword('');
          localStorage.setItem('uuid', resp.data.uuid);
          dispatch(addUser(resp.data));

          navigate('/dashboard');
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
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function onChange(value) {
    console.log('Captcha value:', value);
    setCaptchaToken(value);
  }

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

  return (
    <>
      <form className="mb-5 mt-[50px] flex w-full flex-col gap-11 text-gray-600 tablet:my-16 5xl:gap-14 short:gap-[38px]">
        <div className="relative grid w-full grid-cols-[1fr] items-center">
          <Input
            type="email"
            id="email"
            label="Email Address"
            className="autofill_text_color peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-dark dark:focus:border-white"
            autoComplete="sign-email"
            onChange={onEmailChange}
            value={email}
          />
          {email ? (
            persistedTheme === 'dark' ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelDark.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={handleCancel}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelLight.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={handleCancel}
              />
            )
          ) : null}
        </div>

        <div className="flex flex-col gap-5 tablet:gap-14">
          <div>
            <div className="relative grid w-full grid-cols-[1fr] items-center">
              <Input
                type={inputType}
                id="password"
                label="Password"
                className="autofill_text_color peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-dark dark:focus:border-white"
                autoComplete="new-password"
                onChange={onPassChange}
              />
              {!showPassword ? (
                persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                )
              ) : persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          <Anchor className="cursor-pointer dark:text-white">Forgot Password?</Anchor>
        </div>
      </form>
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
        // disabled={isLoading === true ? true : false}
      >
        Sign in
        {/* {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Sign in'} */}
      </Button>
    </>
  );
};

export default CredentialLogin;
