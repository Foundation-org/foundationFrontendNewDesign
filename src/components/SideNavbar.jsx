import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useSelector } from 'react-redux';

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  return (
    <div
      className={`${persistedUserInfo.role === 'user' ? 'hidden flex-col laptop:flex' : 'hidden'} ml-[31px] w-full max-w-[18.75rem] items-center justify-center gap-[15px] rounded-[15px] bg-white px-[38px] py-[22px]`}
    >
      <Button
        variant={location.pathname === '/dashboard/quest' ? 'submit2' : 'hollow-submit2'}
        className="w-full max-w-[212px] bg-white"
        onClick={() => navigate('/dashboard/quest')}
      >
        Create Post
      </Button>
      <Button
        variant={location.pathname === '/dashboard/profile' ? 'submit2' : 'hollow-submit2'}
        className="w-full max-w-[212px] bg-white"
        onClick={() => navigate('/dashboard/profile')}
      >
        Add Badge
      </Button>
    </div>
  );
};

export default SideNavbar;
