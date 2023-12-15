import { useSelector } from "react-redux";
import Input from "../../../components/Input";
import PasswordStrengthBar from "react-password-strength-bar";

const Form = ({
  password,
  reTypePassword,
  showPassword,
  showCnfmPassword,
  togglePasswordVisibility,
  toggleCnfmPasswordVisibility,
  onEmailChange,
  onPassChange,
  onReTypePassChange,

}) => {
  const inputType = showPassword ? "text" : "password";
  const cnfmPassInputType = showCnfmPassword ? "text" : "password";
  const persistedTheme = useSelector((state) => state.utils.theme);
  

  return (
    <form className="short:gap-[38px] mt-6 flex w-full flex-col gap-11 text-gray-600 dark:text-white 5xl:gap-14">
      <Input
        type="email"
        id="email"
        label="Email Address"
        className="short:py-0 taller:text-[16px] peer w-full border-b-[1px] border-[#C0C0C0] bg-white py-1 text-[12px] transition-colors focus:border-b-2 focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-dark dark:focus:border-white tablet:text-[16px] md:text-[22.9px]"
        autoComplete="off"
        onChange={onEmailChange}
      />
      <div className="flex flex-col gap-5">
        <div>
          <div className="relative">
            <Input
              type={inputType}
              id="password"
              label="Password"
              className="short:py-0 taller:text-[16px] peer w-full border-b-[1px] border-[#C0C0C0]  bg-white py-1 text-[12px] transition-colors focus:border-b-2 focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-dark dark:focus:border-white md:text-[22.9px]"
              autoComplete="new-password"
              onChange={onPassChange}
            />

            {!showPassword ? (
              persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/blind.svg"
                  alt="blind"
                  className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  src="/assets/svgs/eye-white.svg"
                  alt="blind"
                  className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              )
            ) : persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/eye.svg"
                alt="blind"
                className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <img
                src="/assets/svgs/eyeLight.svg"
                alt="blind"
                className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
          <div className="relative -top-1 mt-1 h-[19px]">
            {password && <PasswordStrengthBar password={password} />}
          </div>
        </div>
        <div>
          <div className="relative ">
            <Input
              type={cnfmPassInputType}
              id="retype-password"
              label="Re-Type Password"
              className="short:py-0 taller:text-[16px] peer w-full border-b-[1px] border-[#C0C0C0]  bg-white py-1 text-[12px] transition-colors focus:border-b-2 focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-dark dark:focus:border-white md:text-[22.9px]"
              autoComplete="new-password"
              onChange={onReTypePassChange}
            />
            {!showCnfmPassword ? (
              persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/blind.svg"
                  alt="blind"
                  className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                  onClick={toggleCnfmPasswordVisibility}
                />
              ) : (
                <img
                  src="/assets/svgs/eye-white.svg"
                  alt="blind"
                  className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                  onClick={toggleCnfmPasswordVisibility}
                />
              )
            ) : persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/eye.svg"
                alt="blind"
                className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                onClick={toggleCnfmPasswordVisibility}
              />
            ) : (
              <img
                src="/assets/svgs/eyeLight.svg"
                alt="blind"
                className="absolute -top-2 right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                onClick={toggleCnfmPasswordVisibility}
              />
            )}
          </div>
          <div className="relative -top-1 mt-1 h-[19px]">
            {reTypePassword && (
              <PasswordStrengthBar password={reTypePassword} />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
