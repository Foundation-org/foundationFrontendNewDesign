import { useState } from "react";
import Input from "../../../components/Input";
import { useSelector } from "react-redux";
import Anchor from "../../../components/Anchor";

const Form = ({ onEmailChange, onPassChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remeberMe, setRememberMe] = useState(false);

  const inputType = showPassword ? "text" : "password";
  const persistedTheme = useSelector((state) => state.utils.theme);

  const clearEmail = () => {
    setEmail("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <form className="mt-[50px] flex w-full flex-col gap-11 text-gray-600 dark:text-white 5xl:gap-14 short:gap-[38px]">
      <Input
        type="email"
        id="email"
        label="Email Address"
        className="peer w-full border-b-[1px] border-[#C0C0C0] bg-white py-1 text-[12px] transition-colors focus:border-b-2 focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-dark dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
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
              className="peer w-full border-b-[1px] border-[#C0C0C0] bg-white py-1 text-[12px] transition-colors focus:border-b-2 focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-dark dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
              autoComplete="new-password"
              onChange={onPassChange}
            />
            {!showPassword ? (
              persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/blind.svg"
                  alt="blind"
                  className="absolute top-[7px] short:-top-[2px] tall:top-[1.5px] taller:top-[2px] right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  src="/assets/svgs/eye-white.svg"
                  alt="blind"
                  className="absolute top-[7px] short:-top-[2px] tall:top-[1.5px] taller:top-[2px] right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              )
            ) : persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/eye.svg"
                alt="blind"
                className="absolute top-[7px] short:-top-[2px] tall:top-[1.5px] taller:top-[2px] right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <img
                src="/assets/svgs/eye-white.svg"
                alt="blind"
                className="absolute top-[7px] short:-top-[2px] tall:top-[1.5px] taller:top-[2px] right-2 h-[17px] w-[17px] cursor-pointer md:h-[30px] md:w-[30px]"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
        </div>
        <Anchor className="cursor-pointer dark:text-white">
          Forgot Password?
        </Anchor>
      </div>
    </form>
    // <div className="flex flex-col gap-[21.7px]">
    //   <div className="form-control w-full gap-[6px] md:gap-[11.5px]">
    //     <label className="label p-0">
    //       <Typography variant="p">Email</Typography>
    //     </label>
    //     <div className="relative">
    //       <input
    //         type="text"
    //         placeholder="Enter your email"
    //         className="tall:text-[16px] input h-[33px] w-full rounded-[6px] border-[1.473px] border-[#D0D5DD] bg-white text-gray-400 focus:outline-none dark:border-[#D9D9D9] dark:bg-gray-400 dark:text-white md:h-12"
    //         // value={email}
    //         onChange={onEmailChange}
    //       />
    //       {email && (
    //         <img
    //           src="/assets/svgs/XIcon.svg"
    //           alt="x-icon"
    //           className="absolute right-2 top-3 h-[1.625rem] w-[1.625rem] cursor-pointer"
    //           onClick={clearEmail}
    //         />
    //       )}
    //     </div>
    //   </div>
    //   <div className="form-control w-full gap-[6px] md:gap-[11.5px]">
    //     <label className="label p-0">
    //       <Typography variant="p">Password</Typography>
    //     </label>
    //     <div className="relative">
    //       <input
    //         type={inputType}
    //         placeholder="Enter your password"
    //         className="tall:text-[16px] input h-[33px] w-full rounded-[6px] border-[1.473px] border-[#D0D5DD] bg-white text-gray-400 focus:outline-none dark:border-[#D9D9D9] dark:bg-gray-400 dark:text-white md:h-12"
    //         onChange={onPassChange}
    //       />
    //       {!showPassword ? (
    //         <img
    //           src="/assets/svgs/blind-outline.svg"
    //           alt="blind"
    //           className="absolute right-2 top-1 h-[1.625rem] w-[1.625rem] cursor-pointer md:top-3"
    //           onClick={togglePasswordVisibility}
    //         />
    //       ) : (
    //         <img
    //           src="/assets/svgs/eye-outline.svg"
    //           alt="eye"
    //           className="absolute right-2 top-1 h-[1.625rem] w-[1.625rem] cursor-pointer md:top-3"
    //           onClick={togglePasswordVisibility}
    //         />
    //       )}
    //     </div>
    //   </div>
    //   <div className="flex items-center justify-between">
    //     {/* <div className="form-control">
    //       <label className="label cursor-pointer flex gap-[11.5px]">
    //         <input
    //           type="checkbox"
    //           checked={remeberMe}
    //           className="checkbox border-[1.437px] border-[#D6D6D6] h-[23px] w-[23px]"
    //           onClick={handleRememberMe}
    //         />
    //         <span className="label-text">Remember me</span>
    //       </label>
    //     </div> */}
    //     <Anchor className="cursor-pointer dark:text-white">
    //       Forgot Password?
    //     </Anchor>
    //   </div>
    // </div>
  );
};

export default Form;
