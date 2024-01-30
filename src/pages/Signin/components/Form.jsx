import { useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '../../../components/Input';
import Anchor from '../../../components/Anchor';

const Form = ({ onEmailChange, onPassChange, handleCancel, email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const persistedTheme = useSelector((state) => state.utils.theme);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="mt-[50px] flex w-full flex-col gap-11 text-gray-600 laptop:my-11 5xl:gap-14 short:gap-[38px] dark:text-white">
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
              src="/assets/svgs/cancelDark.svg"
              alt="blind"
              className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
              onClick={handleCancel}
            />
          ) : (
            <img
              src="/assets/svgs/cancelLight.svg"
              alt="blind"
              className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
              onClick={handleCancel}
            />
          )
        ) : null}
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <div className="relative grid w-full grid-cols-[1fr] items-center">
            <Input
              type={inputType}
              id="password"
              label="Password"
              className="peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none md:text-[22.9px] short:py-0 taller:text-[16px] dark:border-white dark:bg-dark dark:focus:border-white"
              autoComplete="new-password"
              onChange={onPassChange}
            />
            {!showPassword ? (
              persistedTheme === 'dark' ? (
                <img
                  src="/assets/svgs/blind.svg"
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  src="/assets/svgs/eye-white.svg"
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              )
            ) : persistedTheme === 'dark' ? (
              <img
                src="/assets/svgs/eye.svg"
                alt="blind"
                className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <img
                src="/assets/svgs/eyeLight.svg"
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
  );
};

export default Form;
