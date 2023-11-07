import { useState } from 'react';
import Button from '../../components/Button';
import SocialLogins from '../../components/SocialLogins';
import Typography from '../../components/Typography';
import Form from './components/Form';
import { Link } from 'react-router-dom';

export default function Signin() {
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(null);

  console.log(provider, profile);

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
          <Form />
          <div className="w-full flex items-start mt-12 mb-14">
            <img src="/assets/svgs/recaptcha.svg" alt="recaptcha" />
          </div>
          <Button size="large" color="blue-200">
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
