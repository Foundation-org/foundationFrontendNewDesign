import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { userInfo } from "../../../api/userAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../features/auth/authSlice";
import Anchor from "../../../components/Anchor";

const SidebarRight = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [response, setResponse] = useState();

  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const sidebarList = [
    {
      id: 1,
      icon: "/assets/svgs/dashboard/icon1.svg",
      iconLight: "/assets/svgs/dashboard/icon11.svg",
      alt: "icon1",
      title: "Quests Created",
      value: (response && response?.questsCreated) || 0,
    },
    {
      id: 2,
      icon: "/assets/svgs/dashboard/icon2.svg",
      iconLight: "/assets/svgs/dashboard/icon12.svg",
      alt: "icon1",
      title: "Quests Answered",
      value: (response && response?.addedAnswers) || 0,
    },
    {
      id: 5,
      icon: "/assets/svgs/dashboard/icon5.svg",
      iconLight: "/assets/svgs/dashboard/icon15.svg",
      alt: "icon1",
      title: "Answers Changed",
      value: (response && response?.changedAnswers) || 0,
    },
    {
      id: 6,
      icon: "/assets/svgs/dashboard/icon6.svg",
      iconLight: "/assets/svgs/dashboard/icon16.svg",
      alt: "icon1",
      title: "Answers Added",
      value: (response && response?.addedAnswers) || 0,
    },
    {
      id: 7,
      icon: "/assets/svgs/dashboard/icon10.svg",
      iconLight: "/assets/svgs/dashboard/icon17.svg",
      alt: "icon1",
      title: "Agreement Received",
      value: (response && response?.selectionsOnAddedAns) || 0,
    },
    {
      id: 8,
      icon: "/assets/svgs/dashboard/icon7.svg",
      iconLight: "/assets/svgs/dashboard/icon18.svg",
      alt: "icon1",
      title: "Contentions Received",
      value: (response && response?.contentionsOnAddedAns) || 0,
    },
    {
      id: 9,
      icon: "/assets/svgs/dashboard/icon8.svg",
      iconLight: "/assets/svgs/dashboard/icon19.svg",
      alt: "icon1",
      title: "Contentions Given",
      value: (response && response?.contentionsGiven) || 0,
    },
    {
      id: 10,
      icon: "/assets/svgs/dashboard/icon9.svg",
      iconLight: "/assets/svgs/dashboard/icon20.svg",
      alt: "icon1",
      title: "Code of Conduct Fails",
      value: (response && response?.violationCounter) || 0,
    },
  ];

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
  });

  const handleUserInfo = async (id) => {
    try {
      const resp = await getUserInfo(id);

      if (resp.status === 200) {
        dispath(addUser(resp.data));
      }

      // console.log(resp);
      setResponse(resp.data);
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  useEffect(() => {
    handleUserInfo(localStorage.getItem("uId"));
  }, []);

  return (
    <div className="no-scrollbar hidden h-[calc(100vh-96px)] w-[23rem] min-w-[23rem] overflow-y-auto bg-white pl-[1.3rem] pr-[2.1rem] pt-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-[#0A0A0C] 2xl:w-[25rem] laptop:block">
      <div className="mb-11 flex gap-6">
        <img src="/assets/svgs/dashboard/treasure.svg" alt="badge" />
        <div>
          <h4 className="heading">Treasury</h4>
          <p className="text-[20px] font-medium text-[#616161] dark:text-[#D4D5D7]">
            Balance <span>1,357,432.20</span>
          </p>
        </div>
      </div>
      <div className="mb-11 flex gap-6">
        <div className="relative h-fit w-fit">
          <img src="/assets/svgs/dashboard/badge.svg" alt="badge" />
          <p className="transform-center absolute z-50 pb-5 text-[35px] font-bold leading-normal text-white">
            5
          </p>
        </div>
        <div>
          <h4 className="heading">My Profile</h4>
          <div
            onClick={() => {
              navigate("/profile");
            }}
          >
            <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]">
              Edit Profile
            </Anchor>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="h-[9px] w-6 rounded-md bg-[#4A8DBD]"></div>
            <div className="h-[9px] w-6 rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
            <div className="h-[9px] w-6 rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
            <div className="h-[9px] w-6 rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
            <div className="h-[9px] w-6 rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
            <div className="h-[9px] w-6 rounded-md bg-[#D9D9D9] dark:bg-[#323232]"></div>
          </div>
        </div>
      </div>
      {sidebarList.map((item) => (
        <div className="mb-4 flex items-center gap-4" key={item.id}>
          {persistedTheme === "dark" ? (
            <img src={item.icon} alt={item.alt} />
          ) : (
            <img src={item.iconLight} alt={item.alt} />
          )}

          <div className="flex w-full items-center justify-between text-[18px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#878787]">
            <h5>{item.title}</h5>
            <h5>{item.value}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarRight;
