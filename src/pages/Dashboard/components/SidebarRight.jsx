import { toast } from 'sonner';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { createGuestMode } from '../../../services/api/userAuth';
import { formatCountNumber } from '../../../utils/utils';

const SidebarRight = () => {
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

  // const { mutateAsync: createGuest } = useMutation({
  //   mutationFn: createGuestMode,
  //   onSuccess: (resp) => {
  //     localStorage.setItem('isGuestMode', resp.data.isGuestMode);
  //     localStorage.setItem('jwt', resp.data.token);
  //     localStorage.setItem('uuid', resp.data.uuid);
  //   },
  //   onError: (err) => {
  //     toast.error(err.response.data);
  //   },
  // });

  // useEffect(() => {
  //   if (persistedUserInfo) {
  //     const uId = persistedUserInfo?.uuid;

  //     if (!uId) {
  //       createGuest();
  //     }
  //   }
  // }, []);

  return (
    <div
      className={`${persistedUserInfo.role === 'guest' && location.pathname === '/' ? 'hidden' : 'no-scrollbar my-5 hidden h-fit max-h-[calc(100vh-96px)] w-[18.75rem] min-w-[18.75rem] overflow-y-auto rounded-[15px] bg-white py-[25px] pl-[1.3rem] pr-[2.1rem] tablet:my-[15px] laptop:block dark:bg-[#000]'} `}
    >
      <p className="font-inter mb-[25px] text-center text-[10.79px] font-medium leading-[18px] text-[#616161] tablet:text-[18px] dark:text-[#D2D2D2]">
        My Contributions
      </p>
      {sidebarList.map((item) => (
        <div className={`flex items-center gap-4 ${item.id !== 1 && 'mt-[1.6vh]'}`} key={item.id}>
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
  );
};

export default SidebarRight;
