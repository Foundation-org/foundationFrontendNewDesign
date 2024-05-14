import { useSelector } from 'react-redux';
import Input from '../../../components/Input';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useState } from 'react';
import Button from '../../../components/Button';
import Anchor from '../../../components/Anchor';
import { useMutation } from '@tanstack/react-query';
import { signUpGuest } from '../../../services/api/userAuth';
import ReCAPTCHA from 'react-google-recaptcha';

const CredentialRegister = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const [termConditionCheck, setTermConditionCheck] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const cnfmPassInputType = showCnfmPassword ? 'text' : 'password';

  function onChange(value) {
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

  const handleCancel = () => {
    setEmail('');
  };

  const { mutateAsync: guestSignup } = useMutation({
    mutationFn: signUpGuest,
  });

  const handleGuestSignup = async () => {
    setIsLoading(true);

    try {
      if (password === reTypePassword) {
        const resp = await guestSignup({ email, password, uuid: localStorage.getItem('uuid') });
        if (resp.status === 200) {
          toast.success('A verification email has been sent to your email address. Please check your inbox.');

          setEmail('');
          setPassword('');
          setIsLoading(false);
        }
      } else {
        toast.warning('Password does not match');
        setIsLoading(false);
      }
    } catch (e) {
      setErrorMessage(e.response.data.message.split(':')[1]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    // if (!captchaToken) return toast.warning('Please complete the reCAPTCHA challenge before proceeding.');
    if (!termConditionCheck) return toast.warning('Please accept the terms and conditions to continue!');

    setIsLoadingSocial(true);
    if (localStorage.getItem('isGuestMode')) {
      handleGuestSignup();
    } else {
      handleReferralOpen();
    }
  };

  return (
    <>
      <form className="mt-11 flex w-full flex-col gap-11 text-gray-600 tablet:mt-16 5xl:gap-14 short:gap-[38px] dark:text-white">
        <div className="relative grid w-full grid-cols-[1fr] items-center">
          <Input
            type="email"
            id="email"
            label="Email Address"
            className="autofill_text_color peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1  pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-dark dark:focus:border-white"
            autoComplete="sign-email"
            onChange={onEmailChange}
            value={email}
          />
          {email ? (
            persistedTheme === 'dark' ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelDark.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px] "
                onClick={handleCancel}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelLight.svg`}
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px] "
                onClick={handleCancel}
              />
            )
          ) : null}
        </div>
        <div className="flex flex-col gap-5">
          <div className="h-[50px] xl:h-[66px]">
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
                className="peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1  pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-dark dark:focus:border-white"
                autoComplete="new-password"
                onChange={onReTypePassChange}
              />
              {!showCnfmPassword ? (
                persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={toggleCnfmPasswordVisibility}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={toggleCnfmPasswordVisibility}
                  />
                )
              ) : persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleCnfmPasswordVisibility}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={toggleCnfmPasswordVisibility}
                />
              )}
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
          Creating an account means you have agreed with our <Anchor href="/term-of-service">Terms of Service</Anchor> &{' '}
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
    </>
  );
};

export default CredentialRegister;
