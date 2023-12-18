import { toast } from "sonner";
import { useState } from "react";
import { useSelector } from "react-redux";
import { signIn } from "../../api/userAuth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import SocialLogins from "../../components/SocialLogins";
import Form from "./components/Form";
import ReCAPTCHA from "react-google-recaptcha";
import "../../index.css";
import api from "../../api/Axios";
// import axios from 'axios';

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  const [capthaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();

  const persistedTheme = useSelector((state) => state.utils.theme);
  // console.log(provider, profile);

  function onChange(value) {
    console.log("Captcha value:", value);
    setCaptchaToken(value);
  }

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCancel=()=>{
    setEmail("");
  }

  const onPassChange = (e) => {
    setPassword(e.target.value);
  };

  const { mutateAsync: userSignin } = useMutation({
    mutationFn: signIn,
  });

  const handleSignin = async () => {
    try {
      // const recaptchaResp = await axios({
      //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${
      //     import.meta.env.VITE_GOOGLE_RECAPTCH_SECRET_KEY
      //   }&response=${capthaToken}`,
      //   method: 'POST',
      // });

      // if (recaptchaResp.success) {
      if (capthaToken !== "") {
        const resp = await userSignin({ email, password });

        if (resp.status === 200) {
          localStorage.setItem("uId", resp.data.uuid);
          localStorage.setItem("isGuestMode", false);
          localStorage.setItem("jwt", resp.data.token);
          toast.success("User signin successfully");
          setEmail("");
          setPassword("");
          navigate("/dashboard");
        }
      } else {
        toast.warning(
          "please complete the reCAPTCHA challenge before proceeding.",
        );
      }
      // } else {
      //   toast.error('Google recaptcha failed');
      // }

      // console.log(resp);
    } catch (e) {
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const handleSignInSocial = async (data) => {
    try {
      const res = await api.post(`/user/signInUser/social`, {
        data
      });
      // if(res.data.required_action){
      if(res.status === 200){
        localStorage.setItem("uId", res.data.uuid);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]); 
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white dark:bg-black-200 lg:flex-row">
      <div className="flex h-[65px] w-full items-center justify-center bg-[#202329] px-32 lg:hidden">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[45px] w-[58px]"
        />
      </div>
      {/* flex h-screen w-full flex-col items-center bg-white dark:bg-dark md:justify-center lg:rounded-tr-[65px] lg:rounded-br-[65px] */}
      <div className="flex h-screen w-full flex-col items-center bg-white dark:bg-dark md:justify-center lg:rounded-br-[65px] lg:rounded-tr-[65px]">
        {/* laptop:max-w-[35vw] mt-10 flex w-[80%] flex-col items-center justify-center md:mt-0 */}
        <div className="mt-10 flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography
            variant="textTitle"
            className="text-center tablet:text-left"
          >
            Login
          </Typography>
          <SocialLogins setProvider={setProvider} setProfile={setProfile} handleSignInSocial={handleSignInSocial} isLogin={true}  />
          <Form onEmailChange={onEmailChange} onPassChange={onPassChange} handleCancel={handleCancel} email={email} />
          <div className="mb-4 mt-4 flex w-full items-start md:mb-10 laptop:mb-[5.5rem] laptop:mt-[2.5rem] taller:mb-[30px] taller:mt-[35px]">
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

          <Button size="large" color="blue-200" onClick={handleSignin}>
            Sign in
          </Button>
          <div className="mt-[10px] tablet:mt-[23px] flex justify-center gap-3">
            <Typography
              variant="textBase"
              className="text-gray-100 dark:text-gray"
            >
              Do not have an account?
            </Typography>
            <Link to="/">
              <Typography
                variant="textBase"
                className="text-blue dark:text-white"
              >
                Sign up
              </Typography>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden h-screen w-fit items-center px-32 lg:flex">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
    </div>
  );
}
