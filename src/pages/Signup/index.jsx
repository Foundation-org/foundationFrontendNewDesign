import { toast } from "sonner";
import { useState } from "react";
import { useSelector } from "react-redux";
import { signUp } from "../../api/userAuth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Form from "./components/Form";
import Button from "../../components/Button";
import Anchor from "../../components/Anchor";
import ReCAPTCHA from "react-google-recaptcha";
import Typography from "../../components/Typography";
import SocialLogins from "../../components/SocialLogins";
import MyModal from "./components/Modal";
import api from "../../api/Axios";
import { FaSpinner } from 'react-icons/fa';


export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resData, setResData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCancel = () => {
    setEmail("");
  };

  const handleSignup = async () => {
    setIsLoading(true);
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
      toast.error(e.response.data.message.split(":")[1]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSocial = async (data) => {
    try {
      const res = await api.post(`/user/signUpUser/social`, {
        data,
      });
      if (res.data.required_action) {
        setModalVisible(true);
        setResData(res.data);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(":")[1]);
    }
  };

  const handleEmailType = async (value) => {
    try {
      if (!value) return toast.error("Please select the email type!");
      setModalVisible(false);
      const res = await api.patch(
        `/updateBadge/${resData.userId}/${resData.badgeId}`,
        {
          type: value,
        },
      );
      if (res.status === 200) {
        localStorage.setItem("uId", res.data.data.uuid);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message.split(":")[1]);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white dark:bg-black-200 lg:flex-row">
      <MyModal
        modalShow={modalVisible}
        email={profile?.email}
        handleEmailType={handleEmailType}
      />
      <div
        className={`${
          persistedTheme === "dark" ? "bg-dark" : "bg-blue"
        } flex h-[65px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[45px] w-[58px]"
        />
      </div>

      <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>
      <div className="flex h-screen w-full flex-col items-center bg-white dark:bg-dark md:justify-center lg:rounded-bl-[65px] lg:rounded-tl-[65px]">
        <div className="mt-[17.3px] flex w-[80%] flex-col items-center justify-center md:mt-0 laptop:max-w-[35vw]">
          <Typography variant="textTitle">Create Account</Typography>
          <SocialLogins setProvider={setProvider} setProfile={setProfile} handleSignUpSocial={handleSignUpSocial} />
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
            handleCancel={handleCancel}
            email={email}
          />
          <div className="mb-4 mt-4 flex w-full items-start md:mb-10 taller:mb-4 taller:mt-4">
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
          <div className="mb-12 flex items-start taller:mb-7">
            <div className="form-control mt-[7px] md:mt-0">
              <label className="label flex cursor-pointer gap-[11.5px] p-0">
                <input
                  type="checkbox"
                  checked=""
                  className="checkbox h-[11.725px] w-[11.725px] rounded-[2.9px] border-[1.437px] border-[#D6D6D6] md:h-[23px] md:w-[23px] md:rounded-[3.5px] "
                />
              </label>
            </div>
            <label className="ml-4 text-[10.2px] text-gray-100 dark:text-white tablet:text-base 5xl:text-[22px] short:text-[12px]">
              Creating an account means you’re okay with our{" "}
              <Anchor href="#">Terms of Service</Anchor>,{" "}
              <Anchor href="#">Privacy Policy</Anchor>, and out default{" "}
              <Anchor href="#">Notification Settings</Anchor>.
            </label>
          </div>
          <Button
            size="large"
            color="blue-200"
            onClick={() => {
              handleSignup();
            }}
            disabled={isLoading === true ? true : false}
          >
            {isLoading === true ? (
              <FaSpinner className="animate-spin text-[#EAEAEA]" />
            ) : (
              'Create Account'
            )}
            
          </Button>
          <div className="mt-[10px] flex gap-3 tablet:mt-[23px]">
            <Typography
              variant="textBase"
              className="text-gray-100 dark:text-gray "
            >
              Already have an account?
            </Typography>
            <Link to="/">
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
