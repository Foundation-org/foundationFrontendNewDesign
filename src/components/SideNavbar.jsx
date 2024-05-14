import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

const SideNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    // <div>
    <div className="ml-[31px] w-full max-w-[18.75rem] items-center justify-center gap-[15px] laptop:flex laptop:flex-col">
      <Button
        variant={location.pathname === '/dashboard/quest' ? 'submit' : 'hollow-submit'}
        className="bg-white tablet:w-full"
        onClick={() => navigate('/dashboard/quest')}
      >
        Create Post
      </Button>
      <Button
        variant={location.pathname === '/dashboard/profile' ? 'submit' : 'hollow-submit'}
        className="bg-white tablet:w-full"
        onClick={() => navigate('/dashboard/profile')}
      >
        Add Badge
      </Button>
    </div>
  );
};

export default SideNavbar;

{
  /* <div className="ml-[31px] flex w-full max-w-[18.75rem] flex-row items-center justify-center gap-[15px] laptop:hidden">
        <Button
          variant={location.pathname === '/dashboard/quest' ? 'submit' : 'hollow-submit'}
          className="bg-white"
          onClick={() => navigate('/dashboard/quest')}
        >
          Create Post
        </Button>
        <Button
          variant={location.pathname === '/dashboard/profile' ? 'submit' : 'hollow-submit'}
          className="bg-white"
          onClick={() => navigate('/dashboard/profile')}
        >
          Add Badge
        </Button>
      </div> */
}
//  </div>
