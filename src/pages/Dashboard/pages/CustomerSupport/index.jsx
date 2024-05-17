import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const list = [
    { id: 1, title: 'About', path: '/dashboard/help/about' },
    { id: 2, title: "FAQ's", path: '/dashboard/help/faq' },
    { id: 3, title: 'Contact Us', path: '/dashboard/help/contact-us' },
  ];

  return (
    <div className="h-dvh min-h-dvh w-full bg-[#F2F3F5] tablet:px-6">
      <div className="flex items-center justify-center gap-[6.75px] py-2 tablet:gap-[0.96rem] tablet:py-[14.82px]">
        {list.map((item) => (
          <Button
            key={item.id}
            variant="topics"
            className={`${location.pathname === item.path ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#707175]'}`}
            onClick={() => navigate(item.path)}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div
        className={`no-scrollbar mx-auto mb-10 h-[calc(100dvh-141px)] w-full overflow-y-auto tablet:h-[calc(100dvh-143.6px)] tablet:max-w-[730px] tablet:rounded-t-[0.86513rem] ${location.pathname === '/dashboard/help/contact-us' && 'px-3'}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerSupport;
