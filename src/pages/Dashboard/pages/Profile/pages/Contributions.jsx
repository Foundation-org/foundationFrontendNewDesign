import { useSelector } from "react-redux";

const Contributions = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const list = [
    {
      id: 1,
      icon: "/assets/svgs/dashboard/icon1.svg",
      iconLight: "/assets/svgs/dashboard/icon11.svg",
      alt: "icon1",
      title: "Quests Created",
      value: (persistedUserInfo && persistedUserInfo?.questsCreated) || 0,
    },
    {
      id: 2,
      icon: "/assets/svgs/dashboard/icon2.svg",
      iconLight: "/assets/svgs/dashboard/icon12.svg",
      alt: "icon1",
      title: "Quests Answered",
      value: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0,
    },
    {
      id: 3,
      icon: "/assets/svgs/dashboard/icon5.svg",
      iconLight: "/assets/svgs/dashboard/icon15.svg",
      alt: "icon1",
      title: "Answers Changed",
      value: (persistedUserInfo && persistedUserInfo?.changedAnswers) || 0,
    },
    {
      id: 4,
      icon: "/assets/svgs/dashboard/icon6.svg",
      iconLight: "/assets/svgs/dashboard/icon16.svg",
      alt: "icon1",
      title: "Answers Added",
      value: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0,
    },
    {
      id: 5,
      icon: "/assets/svgs/dashboard/icon10.svg",
      iconLight: "/assets/svgs/dashboard/icon17.svg",
      alt: "icon1",
      title: "Agreement Received",
      value:
        (persistedUserInfo && persistedUserInfo?.selectionsOnAddedAns) || 0,
    },
    {
      id: 6,
      icon: "/assets/svgs/dashboard/icon7.svg",
      iconLight: "/assets/svgs/dashboard/icon18.svg",
      alt: "icon1",
      title: "Contentions Received",
      value:
        (persistedUserInfo && persistedUserInfo?.contentionsOnAddedAns) || 0,
    },
    {
      id: 7,
      icon: "/assets/svgs/dashboard/icon8.svg",
      iconLight: "/assets/svgs/dashboard/icon19.svg",
      alt: "icon1",
      title: "Contentions Given",
      value: (persistedUserInfo && persistedUserInfo?.contentionsGiven) || 0,
    },
    {
      id: 8,
      icon: "/assets/svgs/dashboard/icon9.svg",
      iconLight: "/assets/svgs/dashboard/icon20.svg",
      alt: "icon1",
      title: "CoC Fails",
      value: (persistedUserInfo && persistedUserInfo?.violationCounter) || 0,
    },
  ];

  const firstHalf = list.slice(0, Math.ceil(list.length / 2));
  const secondHalf = list.slice(Math.ceil(list.length / 2));

  return (
    <div>
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] dark:text-[#B8B8B8] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px]">
        My Contributions
      </h1>
      <div className="shadow-inside relative mx-[106px] hidden h-[183px] rounded-[45px] laptop:block">
        <div className="absolute -top-7 left-[50%] flex w-full -translate-x-[50%] transform">
          {list?.map((item) => (
            <div className="w-full" key={item.id}>
              <div className="flex flex-col items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.alt}
                  className="mb-[18px] h-[60px] w-[50px]"
                />
                <h4 className="text-center text-[18px] font-semibold leading-normal text-[#7C7C7C]">
                  {item.title.split(" ")[0]}
                </h4>
                <h4 className="mb-6 text-center text-[18px] font-semibold leading-normal text-[#7C7C7C]">
                  {item.title.split(" ")[1]}
                </h4>
                <h1 className="text-center text-[24px] font-semibold leading-[14px] text-[#7C7C7C] 2xl:text-[35px]">
                  {item.value}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[30px] tablet:gap-16 laptop:hidden">
        <div className="shadow-inside relative mx-6 h-[82px] rounded-[11.4px] border-[#858585] tablet:mx-[106px] tablet:h-[183px] tablet:rounded-[45px] tablet:border-[2px]">
          <div className="absolute -top-4 left-[50%] flex w-full -translate-x-[50%] transform tablet:-top-7">
            {firstHalf?.map((item) => (
              <div className="w-full" key={item.id}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.alt}
                    className="mb-[7px] h-[30px] w-8 tablet:mb-[18px] tablet:h-[60px] tablet:w-[50px]"
                  />
                  <h4 className="text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8] tablet:text-[18px]">
                    {item.title.split(" ")[0]}
                  </h4>
                  <h4 className="mb-[10px] text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8] tablet:mb-6 tablet:text-[18px]">
                    {item.title.split(" ")[1]}
                  </h4>
                  <h1 className="text-center text-[16px] font-semibold leading-[14px] text-[#7C7C7C] dark:text-[#B8B8B8] 2xl:text-[35px] tablet:text-[24px]">
                    {item.value}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="shadow-inside relative mx-6 h-[82px] rounded-[11.4px] border-[#858585] tablet:mx-[106px] tablet:h-[183px] tablet:rounded-[45px] tablet:border-[2px]">
          <div className="absolute -top-4 left-[50%] flex w-full -translate-x-[50%] transform tablet:-top-7">
            {secondHalf?.map((item) => (
              <div className="w-full" key={item.id}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.alt}
                    className="mb-[7px] h-[30px] w-8 tablet:mb-[18px] tablet:h-[60px] tablet:w-[50px]"
                  />
                  <h4 className="text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8] tablet:text-[18px]">
                    {item.title.split(" ")[0]}
                  </h4>
                  <h4 className="mb-[10px] text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8] tablet:mb-6 tablet:text-[18px]">
                    {item.title.split(" ")[1]}
                  </h4>
                  <h1 className="text-center text-[16px] font-semibold leading-[14px] text-[#7C7C7C] dark:text-[#B8B8B8] 2xl:text-[35px] tablet:text-[24px]">
                    {item.value}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contributions;
