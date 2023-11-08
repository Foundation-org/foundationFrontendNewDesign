import React, { useState } from "react";
import { Link } from "react-router-dom";
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Form from "./components/Form";
import Anchor from "../../components/Anchor";
import SocialLogins from "../../components/SocialLogins";
import ReCAPTCHA from "react-google-recaptcha";

export default function Signup() {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);

  console.log(provider, profile);

  function onChange(value) {
    console.log("Captcha value:", value);
  }

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
        <div className="max-w-[600px] flex flex-col justify-center items-center">
          <Typography variant="textTitle">Create Account</Typography>
          <SocialLogins setProvider={setProvider} setProfile={setProfile} />
          <Typography variant="textInfo" className="font-poppins">
            -OR-
          </Typography>
          <Form />
          <div className="w-full flex items-start mt-4 mb-10">
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
            <label className="ml-4 text-gray-100 dark:text-white">
              Creating an account means you’re okay with our{" "}
              <Anchor href="#">Terms of Service</Anchor>,{" "}
              <Anchor href="#">Privacy Policy</Anchor>, and out default{" "}
              <Anchor href="#">Notification Settings</Anchor>.
            </label>
          </div>
          <Button size="large" color="blue-200">
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
