import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../api/userAuth";
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Form from "./components/Form";
import Anchor from "../../components/Anchor";
import SocialLogins from "../../components/SocialLogins";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "react-redux";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);

  const persistedTheme = useSelector((state) => state.utils.theme);

  function onChange(value) {
    console.log("Captcha value:", value);
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

  const { mutateAsync: userSignup } = useMutation({
    mutationFn: signUp,
  });

  const handleSignup = async () => {
    try {
      if (password === reTypePassword) {
        const resp = await userSignup({ email, password });

        if (resp.status === 200) {
          toast.success("User registered successfully");
          setEmail("");
          setPassword("");
          navigate("/verify-email");
        }

        console.log(resp);
      } else {
        toast.warning("Password does not match");
      }
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white dark:bg-black-200 lg:flex-row">
      <div className="flex h-[65px] w-full items-center justify-center bg-[#202329] lg:hidden">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[45px] w-[58px]"
        />
      </div>
      <div className="hidden h-screen w-fit items-center px-32 lg:flex">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[252px] w-[322px]"
        />
      </div>
      <div className="flex h-screen w-full flex-col items-center bg-white dark:bg-dark md:justify-center lg:rounded-[65px]">
        <div className="mt-10 flex w-[306px] flex-col items-center justify-center md:mt-0 md:w-[500px] 2xl:w-[600px] 2xl:max-w-[800px] 5xl:w-[800px]">
          <Typography variant="textTitle">Create Account</Typography>
          <SocialLogins setProvider={setProvider} setProfile={setProfile} />
          <Typography variant="textInfo" className="font-poppins">
            -OR-
          </Typography>
          <Form
            password={password}
            reTypePassword={reTypePassword}
            showPassword={showPassword}
            showCnfmPassword={showCnfmPassword}
            onEmailChange={onEmailChange}
            onPassChange={onPassChange}
            onReTypePassChange={onReTypePassChange}
            togglePasswordVisibility={togglePasswordVisibility}
            toggleCnfmPasswordVisibility={toggleCnfmPasswordVisibility}
          />
          <div className="mb-4 mt-4 flex w-full items-start md:mb-10">
            {persistedTheme === "dark" ? (
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY}
                onChange={onChange}
                theme="dark"
              />
            ) : (
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY}
                onChange={onChange}
                theme="light"
              />
            )}
          </div>
          <div className="mb-12 flex items-start">
            <div className="form-control mt-[7px] md:mt-0">
              <label className="label flex cursor-pointer gap-[11.5px] p-0">
                <input
                  type="checkbox"
                  checked=""
                  className="checkbox h-[11.725px] w-[11.725px] rounded-[2.9px] border-[1.437px] border-[#D6D6D6] md:h-[23px] md:w-[23px] md:rounded-[3.5px] "
                />
              </label>
            </div>
            <label className="ml-4 text-[8.158px] text-gray-100 dark:text-white md:text-base 5xl:text-[22px]">
              Creating an account means you’re okay with our{" "}
              <Anchor href="#">Terms of Service</Anchor>,{" "}
              <Anchor href="#">Privacy Policy</Anchor>, and out default{" "}
              <Anchor href="#">Notification Settings</Anchor>.
            </label>
          </div>
          <Button size="large" color="blue-200" onClick={handleSignup}>
            Create Account
          </Button>
          <div className="mt-[23px] flex gap-3">
            <Typography
              variant="textBase"
              className="text-gray-100 dark:text-gray "
            >
              Already have an account?
            </Typography>
            <Link to="/signin">
              <Typography
                variant="textBase"
                className="text-blue dark:text-white"
              >
                Log in
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
