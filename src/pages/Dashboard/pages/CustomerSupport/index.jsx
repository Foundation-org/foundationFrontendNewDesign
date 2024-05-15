import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const list = [
    { id: 1, title: 'About', path: '/dashboard/help/about' },
    { id: 2, title: "FAQ's", path: '/dashboard/help/faq' },
  ];
  // tablet:bg-[#F2F3F5]
  return (
    <div className="h-dvh min-h-dvh">
      <div className="flex items-center justify-center gap-[0.96rem] bg-[#F2F3F5] py-[0.8rem]">
        {list.map((item) => (
          <Button
            key={item.id}
            variant="topics"
            className={`${location.pathname === item.path ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#707175]'} min-w-[5.12rem]`}
            onClick={() => navigate(item.path)}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div className="no-scrollbar mb-10 h-[calc(100dvh-151px)] overflow-y-auto bg-white tablet:mx-auto tablet:h-[calc(100dvh-143.6px)] tablet:min-w-[730px] tablet:max-w-[730px] tablet:rounded-t-[0.86513rem]">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerSupport;
