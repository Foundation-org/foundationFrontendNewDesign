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
  // console.log(provider, profile);

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
    <div className="bg-blue dark:bg-black-200 h-screen w-full text-white flex">
      <div className="h-screen w-fit flex items-center px-32">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[252px] w-[322px]"
        />
      </div>
      <div className="w-full h-screen bg-white dark:bg-dark rounded-[65px] flex flex-col justify-center items-center">
        <div className="max-w-[800px] w-[600px] 5xl:w-[800px] flex flex-col justify-center items-center">
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
          <div className="w-full flex items-start mt-4 mb-10">
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
          <div className="flex items-start mb-12">
            <div className="form-control">
              <label className="label cursor-pointer flex gap-[11.5px] p-0">
                <input
                  type="checkbox"
                  checked=""
                  className="checkbox border-[1.437px] border-[#D6D6D6] h-[23px] w-[23px] "
                />
              </label>
            </div>
            <label className="ml-4 text-gray-100 dark:text-white 5xl:text-[22px]">
              Creating an account means you’re okay with our{" "}
              <Anchor href="#">Terms of Service</Anchor>,{" "}
              <Anchor href="#">Privacy Policy</Anchor>, and out default{" "}
              <Anchor href="#">Notification Settings</Anchor>.
            </label>
          </div>
          <Button size="large" color="blue-200" onClick={handleSignup}>
            Create Account
          </Button>
          <div className="flex gap-3 mt-[23px]">
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
