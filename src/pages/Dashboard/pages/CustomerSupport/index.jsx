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
  // tablet:bg-[#F2F3F5]
  return (
    <div className="h-dvh min-h-dvh tablet:px-6">
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
      <div className="no-scrollbar mx-auto mb-10 h-[calc(100dvh-151px)] w-full overflow-y-auto bg-white tablet:h-[calc(100dvh-143.6px)] tablet:max-w-[730px] tablet:rounded-t-[0.86513rem]">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerSupport;
