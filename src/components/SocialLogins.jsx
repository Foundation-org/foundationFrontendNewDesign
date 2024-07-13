import { Button } from './ui/Button';
import { authMethods } from '../constants/authentication';
import { useLocation, useNavigate } from 'react-router-dom';

const SocialLogins = ({ handleReferralOpen, setClickedButtonName, isLogin, triggerLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mb-2 flex min-w-[145px] flex-col gap-2 rounded-[6.043px] lg:min-w-[305px] 2xl:rounded-[11.703px] laptop:mb-[1.56rem] laptop:justify-between laptop:gap-[1.56rem]">
      {authMethods.map((item) => (
        <Button
          variant="auth"
          key={item.id}
          onClick={() => {
            if (isLogin) {
              localStorage.setItem('target-url', `${window.location.href}`);
              triggerLogin(item.provider);
            } else {
              localStorage.setItem('target-url', `${window.location.href}`);
              setClickedButtonName(item.provider);
              handleReferralOpen(item.provider);
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${item.img}`} className="mr-2 w-[22px] md:w-8 lg:mr-3" />
            {item.title}
          </div>
        </Button>
      ))}
      <Button
        variant="auth"
        onClick={() => {
          if (location.pathname === '/signin') {
            navigate('/signin/credentials');
          } else if (location.pathname === '/signup') {
            navigate('/signup/credentials');
          } else {
            navigate('/guest-signup/credentials');
          }
        }}
      >
        <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
            className="mr-2 w-[22px] md:w-8 lg:mr-3"
          />
          Email
        </div>
      </Button>
    </div>
  );
};

export default SocialLogins;
