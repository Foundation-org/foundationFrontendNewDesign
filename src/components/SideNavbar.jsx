import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="ml-[31px] hidden w-full max-w-[18.75rem] flex-col items-center justify-center gap-[15px] rounded-[15px] bg-white px-[38px] py-[22px] laptop:flex">
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
