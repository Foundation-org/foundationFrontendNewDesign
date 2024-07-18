import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useSelector } from 'react-redux';

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  return (
    <div
      className={`${persistedUserInfo.role === 'user' ? 'hidden flex-col laptop:flex' : 'hidden'} ml-[31px] w-full max-w-[18.75rem] items-center justify-center gap-[15px] rounded-[15px] bg-white px-[38px] py-[22px] dark:border dark:border-gray-100 dark:bg-gray-200`}
    >
      <Button
        variant={location.pathname === '/post' ? 'submit2' : 'hollow-submit2'}
        className="dark:border-white-200 dark:text-white-200 w-full max-w-[212px] bg-white dark:border-2 dark:bg-gray-200"
        onClick={() => navigate('/post')}
      >
        Create Post
      </Button>
      <Button
        variant={location.pathname === '/profile' ? 'submit2' : 'hollow-submit2'}
        className="dark:border-white-200 dark:text-white-200 w-full max-w-[212px] bg-white dark:border-2 dark:bg-gray-200"
        onClick={() => navigate('/profile/verification-badges')}
      >
        Add Badge
      </Button>
    </div>
  );
};

export default SideNavbar;
