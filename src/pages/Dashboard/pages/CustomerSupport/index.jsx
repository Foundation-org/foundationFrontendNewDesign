import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useLayoutEffect, useRef } from 'react';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const list = [
    { id: 1, title: 'About', path: '/dashboard/help/about' },
    { id: 2, title: "FAQ's", path: '/dashboard/help/faq' },
    { id: 3, title: 'Terms of Service', path: '/dashboard/help/terms-of-service' },
    { id: 4, title: 'Privacy Policy', path: '/dashboard/help/privacy-policy' },
    { id: 5, title: 'Contact Us', path: '/dashboard/help/contact-us' },
  ];

  return (
    <div className="h-dvh min-h-dvh w-full bg-[#F2F3F5] tablet:px-6">
      <Breadcrumb />
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
        ref={scrollRef}
        className={`no-scrollbar mx-auto mb-10 h-[calc(100dvh-174px)] w-full overflow-y-auto tablet:h-[calc(100dvh-143.6px)] tablet:max-w-[730px] tablet:rounded-t-[0.86513rem] ${location.pathname === '/dashboard/help/contact-us' && 'px-3 tablet:px-0'}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerSupport;
