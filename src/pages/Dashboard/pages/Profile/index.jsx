import React from 'react';
import Topbar from '../../components/Topbar';
import Button from './components/Button';

const Profile = () => {
  const list = [
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
      title: 'CoC Fails',
      value: 2,
    },
  ];

  return (
    <div>
      <Topbar />
      <div className="bg-white h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex gap-[19.4px] justify-end mr-[109px] mt-12">
          <div className="w-fit h-fit relative">
            <img src="/assets/svgs/dashboard/badge.svg" alt="badge" />
            <p className="absolute transform-center pb-5 z-50 font-bold text-white text-[35px] leading-normal">
              2
            </p>
          </div>
          <div>
            <h4 className="text-[30px] font-semibold leading-normal text-[#616161] dark:text-[#D2D2D2]">
              My Profile
            </h4>
            <div className="flex gap-[13px]">
              <p>Light</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="26"
                viewBox="0 0 48 26"
                fill="none"
              >
                <rect width="48" height="25.2203" rx="12.6102" fill="#BEDEF4" />
                <circle cx="14.2374" cy="12.6102" r="10.1695" fill="#4A8DBD" />
              </svg>
              <p>Dark</p>
            </div>
          </div>
        </div>
        <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[6px] mb-[54px] ml-[156px]">
          My Contributions
        </h1>
        <div className="mx-[106px] rounded-[45px] shadow-inside h-[183px] relative">
          <div className="flex gap-[35px] absolute -top-7 left-[50%] transform -translate-x-[50%]">
            {list?.map((item) => (
              <div className="ml-[51px] w-[70px]">
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.alt}
                    className="mb-[18px] w-[50px] h-[60px]"
                  />
                  <h4 className="text-[18px] text-[#7C7C7C] font-semibold leading-normal text-center">
                    {item.title.split(' ')[0]}
                  </h4>
                  <h4 className="mb-6 text-[18px] text-[#7C7C7C] font-semibold leading-normal text-center">
                    {item.title.split(' ')[1]}
                  </h4>
                  <h1 className="text-[#7C7C7C] text-[35px] font-semibold leading-[14px] text-center">
                    16
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[56px] ml-[156px]">
          My Verification Badges
        </h1>
        <div className="mx-[106px] rounded-[45px] shadow-inside pt-[104px] pb-[66.8px] px-[60px] flex flex-col gap-[23px] my-[54px] relative">
          <div className="flex gap-[21px] absolute -top-1 left-[50%] transform -translate-x-[50%]">
            <div className="bg-[#4A8DBD] h-[11.1px] w-[175.1px] rounded-[100px]" />
            <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
            <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
            <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
            <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
            <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
          </div>
          <div className="flex">
            <img src="/assets/svgs/dashboard/mail1.svg" alt="mail1" />
            <div className="mx-[30px] rounded-[18.335px] shadow-inside w-full">
              <h1 className="text-[#000] text-[24px] font-medium leading-normal py-[26px] pl-[50px]">
                Personal Email
              </h1>
            </div>
            <Button color="gray">Add</Button>
            <Button color="red">Remove</Button>
          </div>
          <div className="flex">
            <img src="/assets/svgs/dashboard/mail1.svg" alt="mail1" />
            <div className="mx-[30px] rounded-[18.335px] shadow-inside w-full">
              <h1 className="text-[#000] text-[24px] font-medium leading-normal py-[26px] pl-[50px]">
                Personal Email
              </h1>
            </div>
            <Button color="blue">Add</Button>
            <Button color="red">Remove</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
