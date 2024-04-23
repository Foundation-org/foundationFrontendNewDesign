import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userInfo } from '../../../services/api/userAuth';
import SidebarRight from './SidebarRight';

export default function TreasuryAndBalance({ children }) {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [treasuryAmount, setTreasuryAmount] = useState(0);

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
  });

  const handleUserInfo = async () => {
    try {
      const resp = await getUserInfo();

      if (resp?.status === 200) {
        // Cookie Calling
        if (resp.data) {
          dispatch(addUser(resp?.data));
          localStorage.setItem('userData', JSON.stringify(resp?.data));
          // Set into local storage
          if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', resp.data.uuid);
          }
        }

        // LocalStorage Calling
        if (!resp.data) {
          const res = await userInfoById(localStorage.getItem('uuid'));
          dispatch(addUser(res?.data));
          if (res?.data?.requiredAction) {
            setModalVisible(true);
          }
        }

        if (resp?.data?.requiredAction) {
          setModalVisible(true);
        }
      }

      // setResponse(resp?.data);
    } catch (e) {
      console.log({ e });
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const getTreasuryAmount = async () => {
    try {
      const res = await api.get(`/treasury/get`);
      if (res.status === 200) {
        localStorage.setItem('treasuryAmount', res.data.data);
        setTreasuryAmount(res.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  useEffect(() => {
    handleUserInfo();
    getTreasuryAmount();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] justify-between">
      <div className="my-5 ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
        <div className="flex items-center gap-[15px]">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
            alt="badge"
            className="size-[47px]"
          />
          <div className="flex flex-col gap-1">
            <h4 className="heading">Treasury</h4>
            <p className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
              <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span>
            </p>
          </div>
        </div>
      </div>
      {children} {/* Guest or User Balance */}
      <div>
        <div className="mr-[31px] mt-5 hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
          {persistedUserInfo.role !== 'user' ? (
            <div className="flex cursor-pointer items-center gap-[15px]">
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
                  alt="badge"
                  className="tablet:h-[47px] tablet:w-[38px]"
                />
                <p className="transform-center absolute z-50 pb-3 text-[20px] font-medium leading-normal text-white">
                  G
                </p>
              </div>
              <div>
                <h4 className="heading">Guest User</h4>
                <div className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                  <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
                </div>
                <div onClick={handleGuestLogout}>
                  <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]">Create Account</Anchor>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex cursor-pointer items-center gap-[15px]"
              onClick={() => {
                navigate('/dashboard/profile');
              }}
            >
              <div className="relative flex size-[47px] items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt="badge"
                  className="tablet:h-[47px] tablet:w-[38px]"
                />
                <p className="transform-center absolute z-50 pb-3 text-[20px] font-medium leading-normal text-[#7A7016]">
                  {persistedUserInfo?.badges?.length}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="heading">My Balance</h4>
                <div className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                  <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <SidebarRight />
      </div>
    </div>
  );
}
