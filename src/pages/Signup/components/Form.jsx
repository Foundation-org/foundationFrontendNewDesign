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
    <form className="w-full flex flex-col gap-11 5xl:gap-14 my-6 dark:text-white text-gray-600">
      <Input
        type="email"
        id="email"
        label="Email Address"
        className="border-b-[1px] py-1 focus:outline-none dark:focus:border-white focus:border-[#C0C0C0] focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-[#C0C0C0] dark:border-white"
        autoComplete="off"
        onChange={onEmailChange}
      />
      <div>
        <div className="relative">
          <Input
            type={inputType}
            id="password"
            label="Password"
            className="border-b-[1px] py-1 focus:outline-none dark:focus:border-white focus:border-[#C0C0C0] focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-[#C0C0C0] dark:border-white"
            autoComplete="off"
            onChange={onPassChange}
          />
          {!showPassword ? (
            persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/blind.svg"
                alt="blind"
                className="absolute right-2 -top-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <img
                src="/assets/svgs/eye-white.svg"
                alt="blind"
                className="absolute right-2 -top-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )
          ) : persistedTheme === "dark" ? (
            <img
              src="/assets/svgs/eye.svg"
              alt="blind"
              className="absolute right-2 -top-2 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <img
              src="/assets/svgs/eye-white.svg"
              alt="blind"
              className="absolute right-2 -top-2 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>

        <div className="-mt-1">
          {password && <PasswordStrengthBar password={password} />}
        </div>
      </div>
      <div>
        <div className="relative">
          <Input
            type={cnfmPassInputType}
            id="retype-password"
            label="Re-Type Password"
            className="border-b-[1px] py-1 focus:outline-none dark:focus:border-white focus:border-[#C0C0C0] focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-[#C0C0C0] dark:border-white"
            autoComplete="off"
            onChange={onReTypePassChange}
          />
          {!showPassword ? (
            persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/blind.svg"
                alt="blind"
                className="absolute right-2 -top-2 cursor-pointer"
                onClick={toggleCnfmPasswordVisibility}
              />
            ) : (
              <img
                src="/assets/svgs/eye-white.svg"
                alt="blind"
                className="absolute right-2 -top-2 cursor-pointer"
                onClick={toggleCnfmPasswordVisibility}
              />
            )
          ) : persistedTheme === "dark" ? (
            <img
              src="/assets/svgs/eye.svg"
              alt="blind"
              className="absolute right-2 -top-2 cursor-pointer"
              onClick={toggleCnfmPasswordVisibility}
            />
          ) : (
            <img
              src="/assets/svgs/eye-white.svg"
              alt="blind"
              className="absolute right-2 -top-2 cursor-pointer"
              onClick={toggleCnfmPasswordVisibility}
            />
          )}
        </div>
        <div className="-mt-1">
          {reTypePassword && <PasswordStrengthBar password={reTypePassword} />}
        </div>
      </div>
    </form>
  );
};

export default Form;
