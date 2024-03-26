import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import api from '../../../services/api/Axios';
import { useNavigate } from 'react-router-dom';
import Anchor from '../../../components/Anchor';
import PopUp from '../../../components/ui/PopUp';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../components/ui/Button';
import { addUser } from '../../../features/auth/authSlice';
import { createGuestMode, userInfo, userInfoById } from '../../../services/api/userAuth';
import * as filterActions from '../../../features/sidebar/filtersSlice';
import { formatCountNumber } from '../../../utils/utils';

const SidebarRight = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [response, setResponse] = useState();
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const sidebarList = [
    {
      id: 1,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon1.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon11.svg`,
      alt: 'icon1',
      title: 'Posts-Created',
      value: (persistedUserInfo && persistedUserInfo?.questsCreated) || 0,
    },
    {
      id: 2,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon2.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon12.svg`,
      alt: 'icon1',
      title: 'Posts-Engaged',
      value: (persistedUserInfo && persistedUserInfo?.yourPostEngaged) || 0,
    },
    {
      id: 3,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/your-post-engaged.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/your-post-engaged.svg`,
      alt: 'your-post-engaged',
      title: 'Your Posts-Engaged',
      value: (persistedUserInfo && persistedUserInfo?.usersAnswered) || 0,
    },
    {
      id: 4,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/couter-eye.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/couter-eye.svg`,
      alt: 'your-post-hidden',
      title: 'Your Posts-Hidden',
      value: (persistedUserInfo && persistedUserInfo?.yourHiddenPostCounter) || 0,
    },
    // {
    //   id: 3,
    //   icon: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/wronganswers.svg`},
    //   iconLight: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/correntans.svg`},
    //   alt: "icon1",
    //   title: "Correct Answers",
    //   value: (response && response?.correctAnswer) || 0,
    // },
    // {
    //   id: 4,
    //   icon: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/correctanswers.svg`},
    //   iconLight: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/wrongans.svg`},
    //   alt: "icon1",
    //   title: "Wrong Answers",
    //   value: (response && response?.wrongAnswers) || 0,
    // },
    {
      id: 5,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon5.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon15.svg`,
      alt: 'icon1',
      title: 'Selections-Changed',
      value: (persistedUserInfo && persistedUserInfo?.changedAnswers) || 0,
    },
    {
      id: 6,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon6.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon16.svg`,
      alt: 'icon1',
      title: 'Options-Added',
      value: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0,
    },
    {
      id: 7,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon7.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/working.png`,
      alt: 'icon1',
      title: 'Agreement-Received',
      value: (persistedUserInfo && persistedUserInfo?.selectionsOnAddedAns) || 0,
    },
    {
      id: 8,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon8.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon18.svg`,
      alt: 'icon1',
      title: 'Objections-Received',
      value: (persistedUserInfo && persistedUserInfo?.contentionsOnAddedAns) || 0,
    },
    {
      id: 9,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon9.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon19.svg`,
      alt: 'icon1',
      title: 'Objections-Given',
      value: (persistedUserInfo && persistedUserInfo?.contentionsGiven) || 0,
    },
    {
      id: 10,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/last.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon20.svg`,
      alt: 'icon1',
      title: 'Code of Conduct-Fails',
      value: (persistedUserInfo && persistedUserInfo?.violationCounter) || 0,
    },
  ];

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

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('jwt', resp.data.token);
      localStorage.setItem('uId', resp.data.uuid);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  useEffect(() => {
    if (persistedUserInfo) {
      const uId = persistedUserInfo?.uuid;

      if (!uId) {
        createGuest();
      }
    }
  }, []);

  const handleEmailType = async (value) => {
    try {
      if (!value) return toast.error('Please select the email type!');
      setModalVisible(false);
      const res = await api.patch(`/updateBadge/${persistedUserInfo._id}/${persistedUserInfo.badges[0]._id}`, {
        type: value,
        primary: true,
      });
      if (res.status === 200) {
        localStorage.setItem('uId', res.data.uuid);
        localStorage.setItem('userLoggedIn', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('jwt', res.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  const handleGuestLogout = async () => {
    navigate('/guest-signup');
  };

  return (
    <>
      <div className="no-scrollbar mt-5 hidden h-fit max-h-[calc(100vh-96px)] w-[18.75rem] min-w-[18.75rem] overflow-y-auto rounded-[15px] bg-white py-8 pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
        <PopUp
          logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email.svg`}
          title={'Email'}
          open={modalVisible}
          closeIcon={true}
        >
          <div className="flex flex-col items-center pb-[32px] pt-2">
            <p className="text-center text-[8px] font-semibold text-[#838383] tablet:text-[25px]">
              {persistedUserInfo?.email}
            </p>
            <p className="mb-[10px] mt-[10px] text-center text-[10px] font-medium text-[#838383] tablet:mb-[22px] tablet:mt-[14px] tablet:text-[25px]">
              Please select if this email is personal or professional.
            </p>
            <div className="flex items-center justify-center gap-[30px] tablet:gap-[65px]">
              <Button
                variant="personal-work"
                className="gap-2 tablet:gap-[15px]"
                onClick={() => handleEmailType('personal')}
              >
                <img
                  className="h-[16.6px] w-[16.6px] tablet:h-10 tablet:w-10"
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/personal.svg`}
                  alt="personal"
                />
                Personal
              </Button>
              <Button
                variant="personal-work"
                className="gap-2 tablet:gap-[15px]"
                onClick={() => handleEmailType('work')}
              >
                <img
                  className="h-[16.6px] w-[16.6px] tablet:h-10 tablet:w-10"
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/work.svg`}
                  alt="work"
                />{' '}
                Work
              </Button>
            </div>
          </div>
        </PopUp>
        {/* //Teasury Icon and val
         <div className="mb-[3vh] flex gap-[15px]">
          <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`} alt="badge" className="h-[60px] w-[60px]" />
          <div>
            <h4 className="heading">Treasury</h4>
            <p className="whitespace-nowrap text-[20px] font-medium text-[#616161] dark:text-white">
              <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span>
            </p>
          </div>
        </div> */}
        {persistedUserInfo.role !== 'user' ? (
          <div className="mb-[35px] flex items-center gap-6">
            <div className="relative h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
                alt="badge"
                className="tablet:h-[74px] tablet:w-[60px]"
              />
              <p className="transform-center absolute z-50 pb-5 text-[32.25px] font-bold leading-normal text-white">
                G
              </p>
            </div>
            <div>
              <h4 className="heading">Guest User</h4>
              <div className="font-inter mt-[-4px] flex gap-1 text-[10.79px] text-base  font-medium text-[#616161] tablet:text-[17px] laptop:text-[20px] dark:text-[#D2D2D2]">
                <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
              </div>
              <div onClick={handleGuestLogout}>
                <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]">Create Account</Anchor>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mb-[35px] flex cursor-pointer items-center gap-[15px]"
            onClick={() => {
              navigate('/dashboard/profile');
            }}
          >
            <div className="relative h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                alt="badge"
                className="tablet:h-[74px] tablet:w-[60px]"
              />
              <p className="transform-center absolute z-50 pb-5 text-[32.25px] font-medium leading-normal text-[#7A7016]">
                {persistedUserInfo?.badges?.length}
              </p>
            </div>
            <div>
              <h4 className="heading">My Profile</h4>
              <div className="font-inter mt-[-4px] flex gap-1 text-[10.79px] text-base  font-medium text-[#616161] tablet:text-[17px] laptop:text-[20px] dark:text-[#D2D2D2]">
                <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
              </div>
              <div>
                <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]">My Account</Anchor>
              </div>
              {/* <div className="mt-3 flex gap-1">
                <div className="h-[9px] w-[19.5px] rounded-md bg-[#4A8DBD]"></div>
                <div className="h-[9px] w-[19.5px] rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
                <div className="h-[9px] w-[19.5px] rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
                <div className="h-[9px] w-[19.5px] rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
                <div className="h-[9px] w-[19.5px] rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
                <div className="h-[9px] w-[19.5px] rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
              </div> */}
            </div>
          </div>
        )}
        {sidebarList.map((item) => (
          <div className="mt-[1.9vh] flex items-center gap-4" key={item.id}>
            {persistedTheme === 'dark' ? (
              <img src={item.icon} alt={item.alt} className="h-10 w-10" />
            ) : (
              <img src={item.iconLight} alt={item.alt} className="h-10 w-10" />
            )}

            <div className="flex w-full items-center justify-between text-[14px] font-medium leading-5 text-[#7C7C7C] dark:text-[#878787]">
              <div>
                <h5>{item.title?.split('-')[0]}</h5>
                <h5>{item.title?.split('-')[1]}</h5>
              </div>
              <h5 className="text-[22px] font-semibold">{formatCountNumber(item.value)}</h5>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SidebarRight;
