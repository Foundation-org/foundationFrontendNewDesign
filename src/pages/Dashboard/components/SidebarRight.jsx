import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createGuestMode, userInfo } from "../../../api/userAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../features/auth/authSlice";
import Anchor from "../../../components/Anchor";
import api from "../../../api/Axios";
import EmailTypeModal from "../../../components/EmailTypeModal";

const SidebarRight = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [response, setResponse] = useState();
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
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
      value: (response && response?.usersAnswered) || 0,
    },
    // {
    //   id: 3,
    //   icon: "/assets/svgs/dashboard/wronganswers.svg",
    //   iconLight: "/assets/svgs/dashboard/correntans.svg",
    //   alt: "icon1",
    //   title: "Correct Answers",
    //   value: (response && response?.correctAnswer) || 0,
    // },
    // {
    //   id: 4,
    //   icon: "/assets/svgs/dashboard/correctanswers.svg",
    //   iconLight: "/assets/svgs/dashboard/wrongans.svg",
    //   alt: "icon1",
    //   title: "Wrong Answers",
    //   value: (response && response?.wrongAnswers) || 0,
    // },
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

  const handleUserInfo = async () => {
    try {
      const resp = await getUserInfo();

      if (resp.status === 200) {
        dispath(addUser(resp.data));
        if (resp.data.requiredAction) {
          setModalVisible(true);
        }
      }

      // console.log(resp);
      setResponse(resp.data);
    } catch (e) {
      toast.error(e.response.data.message.split(":")[1]);
    }
  };

  const getTreasuryAmount = async () => {
    try {
      const res = await api.get(`/treasury/get`);
      if (res.status === 200) {
        localStorage.setItem("treasuryAmount", res.data.data);
        setTreasuryAmount(res.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(":")[1]);
    }
  };

  useEffect(() => {
    handleUserInfo();
    getTreasuryAmount();
  }, []);

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem("isGuestMode", resp.data.isGuestMode);
      localStorage.setItem("jwt", resp.data.token);
      localStorage.setItem("uId", resp.data.uuid);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  useEffect(() => {
    if(persistedUserInfo) {
      const uId = persistedUserInfo?.uuid;
  
      if (!uId) {
        createGuest();
      }
    }
  }, []);

  const handleEmailType = async (value) => {
    try {
      if (!value) return toast.error("Please select the email type!");
      setModalVisible(false);
      const res = await api.patch(
        `/updateBadge/${persistedUserInfo._id}/${persistedUserInfo.badges[0]._id}`,
        {
          type: value,
        },
      );
      if (res.status === 200) {
        localStorage.setItem("uId", res.data.uuid);
        localStorage.setItem("userLoggedIn", res.data.uuid);
        localStorage.removeItem("isGuestMode");
        localStorage.setItem("jwt", res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message.split(":")[1]);
    }
  };

  return (
    <>
      <div className="no-scrollbar hidden h-full min-h-[calc(100vh-96px)] w-[23rem] min-w-[23rem] overflow-y-auto bg-white pl-[1.3rem] pr-[2.1rem] pt-[4vh] shadow-[0_3px_10px_rgb(0,0,0,0.2)] 2xl:w-[25rem] laptop:block dark:border-l-2 dark:border-white dark:bg-[#0A0A0C]">
        <EmailTypeModal
          modalShow={modalVisible}
          email={persistedUserInfo?.email}
          handleEmailType={handleEmailType}
        />
        <div className="mb-[5vh] flex gap-6">
          <img src="/assets/svgs/dashboard/treasure.svg" alt="badge" />
          <div>
            <h4 className="heading">Treasury</h4>
            <p className="whitespace-nowrap text-[20px] font-medium text-[#616161] dark:text-white">
              Balance: <span>{treasuryAmount}</span>
            </p>
          </div>
        </div>
        {localStorage.getItem("isGuestMode") ? (
          <div className="mb-[5vh] flex items-center gap-6">
            <div className="relative h-fit w-fit">
              <img src="/assets/svgs/dashboard/guestBadge.svg" alt="badge" />
              <p className="transform-center absolute z-50 pb-5 text-[1.875rem] font-medium leading-normal text-[#362E04]">
                G
              </p>
            </div>
            <div>
              <h4 className="heading">Guest User</h4>
              <div className="font-inter mt-[-4px] flex gap-1 text-[10.79px] text-base  font-medium text-[#616161] tablet:text-[17px] laptop:text-[20px] dark:text-[#D2D2D2]">
                <p>Balance: </p>
                <p>
                  {persistedUserInfo?.balance
                    ? persistedUserInfo?.balance.toFixed(2)
                    : 0}
                </p>
              </div>
              <div
                onClick={() => {
                  navigate("/signup");
                }}
              >
                <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]">
                  Create Account
                </Anchor>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mb-[5vh] flex items-center gap-6"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <div className="relative h-fit w-fit">
              <img
                src="/assets/svgs/dashboard/MeBadge.svg"
                alt="badge"
                className="tablet:h-[5.43rem] tablet:w-[4.36rem]"
              />
              <p className="transform-center absolute z-50 pb-5 text-[35px] font-bold leading-normal text-[#7A7016]">
                5
              </p>
            </div>
            <div>
              <h4 className="heading">My Profile</h4>
              <div className="font-inter mt-[-4px] flex gap-1 text-[10.79px] text-base  font-medium text-[#616161] tablet:text-[17px] laptop:text-[20px] dark:text-[#D2D2D2]">
                <p>Balance: </p>
                <p>
                  {persistedUserInfo?.balance
                    ? persistedUserInfo?.balance.toFixed(2)
                    : 0}
                </p>
              </div>
              <div>
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
        )}
        {sidebarList.map((item) => (
          <div className="mt-[1.9vh] flex items-center gap-4" key={item.id}>
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
    </>
  );
};

export default SidebarRight;
