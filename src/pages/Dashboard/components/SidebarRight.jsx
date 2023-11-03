import Anchor from '../../../components/Anchor';

const SidebarRight = () => {
  const sidebarList = [
    {
      id: 1,
      icon: '/assets/svgs/dashboard/icon1.svg',
      iconLight: '/assets/svgs/dashboard/icon11.svg',
      alt: 'icon1',
      title: 'Quests Created',
      value: 2,
    },
    {
      id: 2,
      icon: '/assets/svgs/dashboard/icon2.svg',
      iconLight: '/assets/svgs/dashboard/icon12.svg',
      alt: 'icon1',
      title: 'Quests Answered',
      value: 16,
    },
    {
      id: 3,
      icon: '/assets/svgs/dashboard/icon3.svg',
      iconLight: '/assets/svgs/dashboard/icon13.svg',
      alt: 'icon1',
      title: 'Correct Anwsers',
      value: 6,
    },
    {
      id: 4,
      icon: '/assets/svgs/dashboard/icon4.svg',
      iconLight: '/assets/svgs/dashboard/icon14.svg',
      alt: 'icon1',
      title: 'Wrong Answers',
      value: 54,
    },
    {
      id: 5,
      icon: '/assets/svgs/dashboard/icon5.svg',
      iconLight: '/assets/svgs/dashboard/icon15.svg',
      alt: 'icon1',
      title: 'Answers Changed',
      value: 87,
    },
    {
      id: 6,
      icon: '/assets/svgs/dashboard/icon6.svg',
      iconLight: '/assets/svgs/dashboard/icon16.svg',
      alt: 'icon1',
      title: 'Answers Added',
      value: 2,
    },
    {
      id: 7,
      icon: '/assets/svgs/dashboard/icon10.svg',
      iconLight: '/assets/svgs/dashboard/icon17.svg',
      alt: 'icon1',
      title: 'Agreement Received',
      value: 3,
    },
    {
      id: 8,
      icon: '/assets/svgs/dashboard/icon7.svg',
      iconLight: '/assets/svgs/dashboard/icon18.svg',
      alt: 'icon1',
      title: 'Contentions Received',
      value: 56,
    },
    {
      id: 9,
      icon: '/assets/svgs/dashboard/icon8.svg',
      iconLight: '/assets/svgs/dashboard/icon19.svg',
      alt: 'icon1',
      title: 'Contentions Given',
      value: 12,
    },
    {
      id: 10,
      icon: '/assets/svgs/dashboard/icon9.svg',
      iconLight: '/assets/svgs/dashboard/icon20.svg',
      alt: 'icon1',
      title: 'Code of Conduct Fails',
      value: 2,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#131417] h-[calc(100vh-96px)] min-w-[25rem] w-[25rem] pt-20 pl-[1.3rem] pr-[2.1rem] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex gap-6 mb-11">
        <div className="w-fit h-fit relative">
          <img src="/assets/svgs/dashboard/badge.svg" alt="badge" />
          <p className="absolute transform-center pb-5 z-50 font-bold text-white text-[35px] leading-normal">
            5
          </p>
        </div>
        <div>
          <h4 className="text-[30px] font-semibold leading-normal text-[#616161] dark:text-[#D2D2D2]">
            My Profile
          </h4>
          <Anchor className="text-[#4A8DBD] dark:text-[#BAE2FF]">
            Edit Profile
          </Anchor>
          <div className="flex gap-2 mt-3">
            <div className="h-[9px] w-6 bg-[#4A8DBD] rounded-md"></div>
            <div className="h-[9px] w-6 bg-[#D9D9D9] dark:bg-[#323232] rounded-md"></div>
            <div className="h-[9px] w-6 bg-[#D9D9D9] dark:bg-[#323232] rounded-md"></div>
            <div className="h-[9px] w-6 bg-[#D9D9D9] dark:bg-[#323232] rounded-md"></div>
            <div className="h-[9px] w-6 bg-[#D9D9D9] dark:bg-[#323232] rounded-md"></div>
            <div className="h-[9px] w-6 bg-[#D9D9D9] dark:bg-[#323232] rounded-md"></div>
          </div>
        </div>
      </div>
      {sidebarList.map((item) => (
        <div className="flex gap-4 items-center mb-4" key={item.id}>
          {window.matchMedia('(prefers-color-scheme: dark)').matches ? (
            <img src={item.icon} alt={item.alt} />
          ) : (
            <img src={item.iconLight} alt={item.alt} />
          )}

          <div className="w-full flex items-center justify-between text-[18px] text-[#7C7C7C] dark:text-[#D2D2D2] font-semibold leading-normal">
            <h5>{item.title}</h5>
            <h5>{item.value}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarRight;
