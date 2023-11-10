import { useState } from "react";
import Button from "../../components/Button";
import SocialLogins from "../../components/SocialLogins";
import Typography from "../../components/Typography";
import Form from "./components/Form";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../../index.css";
import api from "../../api/Axios";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  console.log(provider, profile);

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

  const signin = async () => {
    if (email && password) {
      try {
        const response = await api
          .post("/user/signInUser", {
            email: email,
            password: password,
          })
          .then(() => {
            console.log("Response:", response);
            navigate("/dashboard");
          });
      } catch (error) {
        console.error("Error creating account:", error);
      }
    }
  };

  return (
    <div className="bg-blue dark:bg-black-200 h-screen w-full text-white flex">
      <div className="w-full h-screen bg-white dark:bg-dark rounded-r-[65px] flex flex-col justify-center items-center">
        <div className="max-w-[600px] flex flex-col justify-center">
          <Typography variant="textTitle-2">Login</Typography>
          <Typography variant="textSmall">
            Please fill your detail to access your account.
          </Typography>
          <SocialLogins setProvider={setProvider} setProfile={setProfile} />
          <div className="w-full flex justify-center">
            <Typography variant="textInfo">-OR-</Typography>
          </div>
          <Form
            onEmailChange={onEmailChange}
            onPassChange={onPassChange}
            onReTypePassChange={onReTypePassChange}
          />
          <div className="w-fit flex items-start mt-12 mb-14">
            {import.meta.env.VITE_THEME_SWITCH === "dark" ? (
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

          <Button size="large" color="blue-200" onClick={signin}>
            <Typography variant="textBase"> Sign in</Typography>
          </Button>
          <div className="flex justify-center gap-3 mt-[23px]">
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
      <div className="h-screen w-fit flex items-center px-32">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[258px] w-[329px]"
        />
      </div>
    </div>
  );
}
