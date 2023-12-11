import { useState } from "react";
import Button from "../../components/Button";
import SocialLogins from "../../components/SocialLogins";
import Typography from "../../components/Typography";
import Form from "./components/Form";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../../index.css";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../api/userAuth";
import { toast } from "sonner";
import { useSelector } from "react-redux";

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
      toast.error(e.response.data);
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
      <div className=" flex h-screen w-full flex-col items-center bg-white dark:bg-dark  md:justify-center lg:rounded-r-[65px]">
        <div className="mt-6 flex max-w-[800px] flex-col justify-center md:mt-0 lg:w-[500px] 2xl:w-[600px] 5xl:w-[800px]">
          <Typography variant="textTitle-2">Login</Typography>
          <Typography variant="textSmall">
            Please fill your detail to access your account.
          </Typography>
          <SocialLogins setProvider={setProvider} setProfile={setProfile} />
          <div className="flex w-full justify-center">
            <Typography variant="textInfo">-OR-</Typography>
          </div>
          <Form onEmailChange={onEmailChange} onPassChange={onPassChange} />
          <div className="tall:mb-4 tall:mt-0 my-8 flex w-fit items-start md:mb-14 md:mt-12">
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
            <Typography variant="textBase"> Sign in</Typography>
          </Button>
          <div className="mt-[23px] flex justify-center gap-3">
            <Typography
              variant="textBase"
              className="text-gray-100 dark:text-gray"
            >
              Already have an account?
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
          className="h-[258px] w-[329px]"
        />
      </div>
    </div>
  );
}
