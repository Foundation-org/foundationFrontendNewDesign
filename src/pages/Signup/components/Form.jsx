import { useState } from "react";
import Input from "../../../components/Input";
import PasswordStrengthBar from "react-password-strength-bar";

const Form = ({ onEmailChange, onPassChange, onReTypePassChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const inputType = showPassword ? "text" : "password";
  const cnfmPassInputType = showCnfmPassword ? "text" : "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCnfmPasswordVisibility = () => {
    setShowCnfmPassword(!showCnfmPassword);
  };

  // const onEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };

  // const onPassChange = (e) => {
  //   setPassword(e.target.value);
  // };

  // const onReTypePassChange = (e) => {
  //   setReTypePassword(e.target.value);
  // };

  return (
    <form className="w-full flex flex-col gap-11 my-6 dark:text-white text-gray-600">
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
            import.meta.env.VITE_THEME_SWITCH === "dark" ? (
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
          ) : import.meta.env.VITE_THEME_SWITCH === "dark" ? (
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
            import.meta.env.VITE_THEME_SWITCH === "dark" ? (
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
          ) : import.meta.env.VITE_THEME_SWITCH === "dark" ? (
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
          {reTypePassword && <PasswordStrengthBar password={reTypePassword} />}
        </div>
      </div>
    </form>
  );
};

export default Form;
