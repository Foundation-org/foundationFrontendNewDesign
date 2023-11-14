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
      icon: "/assets/svgs/dashboard/icon3.svg",
      iconLight: "/assets/svgs/dashboard/icon13.svg",
      alt: "icon1",
      title: "Correct Anwsers",
      value: 222,
    },
    {
      id: 4,
      icon: "/assets/svgs/dashboard/icon4.svg",
      iconLight: "/assets/svgs/dashboard/icon14.svg",
      alt: "icon1",
      title: "Wrong Answers",
      value: 222,
    },
    {
      id: 5,
      icon: "/assets/svgs/dashboard/icon5.svg",
      iconLight: "/assets/svgs/dashboard/icon15.svg",
      alt: "icon1",
      title: "Answers Changed",
      value: (persistedUserInfo && persistedUserInfo?.changedAnswers) || 0,
    },
    {
      id: 6,
      icon: "/assets/svgs/dashboard/icon6.svg",
      iconLight: "/assets/svgs/dashboard/icon16.svg",
      alt: "icon1",
      title: "Answers Added",
      value: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0,
    },
    {
      id: 7,
      icon: "/assets/svgs/dashboard/icon10.svg",
      iconLight: "/assets/svgs/dashboard/icon17.svg",
      alt: "icon1",
      title: "Agreement Received",
      value:
        (persistedUserInfo && persistedUserInfo?.selectionsOnAddedAns) || 0,
    },
    {
      id: 8,
      icon: "/assets/svgs/dashboard/icon7.svg",
      iconLight: "/assets/svgs/dashboard/icon18.svg",
      alt: "icon1",
      title: "Contentions Received",
      value:
        (persistedUserInfo && persistedUserInfo?.contentionsOnAddedAns) || 0,
    },
    {
      id: 9,
      icon: "/assets/svgs/dashboard/icon8.svg",
      iconLight: "/assets/svgs/dashboard/icon19.svg",
      alt: "icon1",
      title: "Contentions Given",
      value: (persistedUserInfo && persistedUserInfo?.contentionsGiven) || 0,
    },
    {
      id: 10,
      icon: "/assets/svgs/dashboard/icon9.svg",
      iconLight: "/assets/svgs/dashboard/icon20.svg",
      alt: "icon1",
      title: "CoC Fails",
      value: (persistedUserInfo && persistedUserInfo?.violationCounter) || 0,
    },
  ];

  return (
    <div>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[6px] mb-[54px] ml-[156px]">
        My Contributions
      </h1>
      <div className="mx-[106px] rounded-[45px] shadow-inside h-[183px] relative">
        <div className="flex gap-[35px] absolute -top-7 left-[50%] transform -translate-x-[50%] w-full">
          {list?.map((item) => (
            <div className="w-full" key={item.id}>
              <div className="flex flex-col items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.alt}
                  className="mb-[18px] w-[50px] h-[60px]"
                />
                <h4 className="text-[18px] text-[#7C7C7C] font-semibold leading-normal text-center">
                  {item.title.split(" ")[0]}
                </h4>
                <h4 className="mb-6 text-[18px] text-[#7C7C7C] font-semibold leading-normal text-center">
                  {item.title.split(" ")[1]}
                </h4>
                <h1 className="text-[#7C7C7C] text-[35px] font-semibold leading-[14px] text-center">
                  {item.value}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributions;
