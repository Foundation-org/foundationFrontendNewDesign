import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Form from "./components/Form";
import Anchor from "../../components/Anchor";

export default function Signup() {
  return (
    <div className="bg-blue dark:bg-darker h-screen w-full text-white flex">
      <div className="h-screen w-fit flex items-center px-20">
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="h-[252px] w-[322px]"
        />
      </div>
      <div className="w-full h-screen bg-white dark:bg-dark rounded-[65px] flex flex-col justify-center items-center">
        <div className="max-w-[600px] flex flex-col justify-center items-center">
          <Typography variant="textTitle">Create Account</Typography>
          <div className="flex gap-[42px] mt-[37.8px] mb-6">
            <Button size="medium" color="gray">
              <img src="/assets/svgs/google.svg" className="mr-4" /> Sign up
              with Google
            </Button>
            <Button size="medium" color="gray">
              <img src="/assets/svgs/facebook.svg" className="mr-4" /> Sign up
              with Facebook
            </Button>
          </div>
          <Typography variant="textInfo">-OR-</Typography>
          <Form />
          <div className="w-full flex items-start mt-4 mb-10">
            <img src="/assets/svgs/recaptcha.svg" alt="recaptcha" />
          </div>
          <div class="flex items-start mb-12">
            <input
              type="checkbox"
              value=""
              class="w-6 h-6 rounded-[1.43px] text-blue-600 focus:ring-blue-500 ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
            />
            <label class="ml-4 text-gray-100 dark:text-white">
              Creating an account means you’re okay with our{" "}
              <Anchor href="#">Terms of Service</Anchor>,{" "}
              <Anchor href="#">Privacy Policy</Anchor>, and out default{" "}
              <Anchor href="#">Notification Settings</Anchor>.
            </label>
          </div>
          <Button size="large" color="blue">
            Create Account
          </Button>
          <div className="flex gap-3 mt-[23px]">
            <Typography
              variant="textBase"
              className="text-gray-100 dark:text-gray"
            >
              Already have an account?
            </Typography>
            <Typography
              variant="textBase"
              className="text-blue dark:text-white"
            >
              Log in
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
