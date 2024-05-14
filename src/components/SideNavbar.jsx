import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="ml-[31px] hidden w-full max-w-[18.75rem] flex-col items-center justify-center gap-[15px] laptop:flex">
      <Button
        variant={location.pathname === '/dashboard/quest' ? 'submit' : 'hollow-submit'}
        className="w-full bg-white"
        onClick={() => navigate('/dashboard/quest')}
      >
        Create Post
      </Button>
      <Button
        variant={location.pathname === '/dashboard/profile' ? 'submit' : 'hollow-submit'}
        className="w-full bg-white"
        onClick={() => navigate('/dashboard/profile')}
      >
        Add Badge
      </Button>
    </div>
  );
};

export default SideNavbar;
