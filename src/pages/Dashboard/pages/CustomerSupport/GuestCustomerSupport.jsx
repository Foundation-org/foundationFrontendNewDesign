import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import Topbar from '../../components/Topbar';
import DashboardLayout from '../../components/DashboardLayout';
import { createGuestMode } from '../../../../services/api/userAuth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../../features/auth/authSlice';
import showToast from '../../../../components/ui/Toast';

const GuestCustomerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const list = [
    { id: 1, title: 'About', path: '/help/about' },
    { id: 2, title: "FAQ's", path: '/help/faq' },
    { id: 3, title: 'Contact Us', path: '/help/contact-us' },
  ];

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('uuid', resp.data.uuid);
      dispatch(addUser(resp?.data));
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data)
    },
  });

  useEffect(() => {
    if (persistedUserInfo === null) {
      createGuest();
    }
  }, []);

  return (
    <div className="bg-[#F2F3F5]">
      <Topbar />
      <DashboardLayout>
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
            className={`no-scrollbar mx-auto mb-10 h-[calc(100dvh-131px)] w-full overflow-y-auto tablet:h-[calc(100dvh-143.6px)] tablet:max-w-[730px] tablet:rounded-t-[0.86513rem] ${location.pathname === '/contact-us' && 'px-3'}`}
          >
            <Outlet />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default GuestCustomerSupport;
