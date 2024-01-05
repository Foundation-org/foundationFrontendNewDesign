import { useSelector } from "react-redux";
import Button from "../components/Button";

const VerificationBadges = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const contacts = [
    {
      image: "/assets/profile/Education-Email-2x.png",
      title: "Personal Email",
      ButtonColor: "yellow",
      ButtonText: "Change Password",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/Education-Email-2x.png",
      title: "Work Email",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/Education-Email-2x.png",
      title: "Education Email",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/cellphone.png",
      title: "Cell Phone",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
  ]
  const socials = [
    
    {
      image: "/assets/profile/LinkedIn-2x.png",
      title: "LinkedIn",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },{
      image: "/assets/profile/Facebook-2x.png",
      title: "Facebook",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/Twitter-2x.png",
      title: "Twitter",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/Instagram-2x.png",
      title: "Instagram",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
   
    {
      image: "/assets/profile/Github-2x.png",
      title: "Github",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },]

  const web3 = [
    {
      image: "/assets/profile/Ethereum-Wallet-2x.png",
      title: "Etherium Wallet",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    } ,
    {
      image: "/assets/profile/WebAuth-Desktop-2x.png",
      title: "WebAuth Desktop",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/WebAuth-Mobile-2x.png",
      title: "WebAuth Mobile",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    }]

  const personal = [
   
    {
      image: "/assets/profile/firstname.png",
      title: "First Name",
      NoOfButton:2,
    },
    {
      image: "/assets/profile/Work-Phone-2x.png",
      title: "Last Name",
      NoOfButton:2,
    },
    {
      image: "/assets/profile/currentcity.png",
      title: "Current City",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/hometown.png",
      title: "Home Town",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/relationaship.png",
      title: "Relationship Status",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/work.png",
      title: "Work",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/education.png",
      title: "Education",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/Identity-2x.png",
      title: "ID / Passport",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/Geolocation-2x.png",
      title: "Geolocation",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
    {
      image: "/assets/profile/securityquestion.png",
      title: "Security Question",
      ButtonColor: "blue",
      ButtonText: "Add New Badge",
      NoOfButton:1,
    },
  ];

  return (
    <div>
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] dark:text-[#B8B8B8] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px]">
        My Verification Badges
      </h1>
      <div
        className={`${persistedTheme === "dark" ? "dark-shadow-inside" : "shadow-inside"
          } relative mx-6 mb-[54px] mt-4 flex flex-col gap-[5.91px] rounded-[11.918px] px-[14.3px] pb-[17.57px] pt-[23px] tablet:mx-6 tablet:my-[54px] tablet:gap-[23px] tablet:rounded-[24.8px] tablet:px-[29.7px] tablet:py-[48.4px] laptop:mx-[106px] laptop:rounded-[45px] laptop:px-[60px] laptop:pb-[66.8px] laptop:pt-[104px]`}
      >
        <div className="absolute -top-[3px] left-[50%] mx-auto flex w-[90%] -translate-x-[50%] transform justify-center gap-[21px] tablet:-top-1 tablet:w-[90%] laptop:w-[95%]">
          <div className="h-[2.94px] w-full rounded-[100px] bg-[#4A8DBD] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
        </div>
        <h1 className="font-500 text-[2.22vw] ml-[3.5vw] font-Inter font-normal text-[#000] dark:text-white">Contact</h1>
        {contacts.map((item, index) => (
          <div
            className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]"
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${persistedTheme === "dark"
                  ? "dark-shadow-input"
                  : "shadow-inside"
                } mx-2  w-[19.9vw] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] flex justify-center items-center  tablet:mx-[2px]  laptop:mx-[30px] font-medium leading-normal text-[#000] dark:text-[#CACACA] `}
            >
              <h1>
                {item.title}
              </h1>
            </div>
            <Button color={item.ButtonColor}>{item.ButtonText}</Button>
          </div>
        ))}
        <h1 className="font-500 text-[2.22vw] font-bold ml-[3.5vw] font-Inter font-normal text-[#000] dark:text-white">Social</h1>
        {socials.map((item, index) => (
          <div
            className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]"
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${persistedTheme === "dark"
                  ? "dark-shadow-input"
                  : "shadow-inside"
                } mx-2  w-[19.9vw] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] flex justify-center items-center  tablet:mx-[2px]  laptop:mx-[30px] font-medium leading-normal text-[#000] dark:text-[#CACACA] `}
            >
              <h1>
                {item.title}
              </h1>
            </div>
            <Button color={item.ButtonColor}>{item.ButtonText}</Button>
          </div>
        ))}
        <h1 className="font-500 text-[2.22vw] ml-[3.5vw] font-Inter font-normal text-[#000] dark:text-white">Web 3</h1>
        {web3.map((item, index) => (
          <div
            className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]"
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${persistedTheme === "dark"
                  ? "dark-shadow-input"
                  : "shadow-inside"
                } mx-2  w-[19.9vw] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] flex justify-center items-center  tablet:mx-[2px]  laptop:mx-[30px] font-medium leading-normal text-[#000] dark:text-[#CACACA] `}
            >
              <h1>
                {item.title}
              </h1>
            </div>
            <Button color={item.ButtonColor}>{item.ButtonText}</Button>
          </div>
        ))}
        <h1 className="font-500 text-[2.22vw] ml-[3.5vw] font-Inter font-normal text-[#000] dark:text-white ">Personal</h1>
        {personal.map((item, index) => (
          <div
            className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]"
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${persistedTheme === "dark"
                  ? "dark-shadow-input"
                  : "shadow-inside"
                } mx-2  w-[19.9vw] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] flex justify-center items-center  tablet:mx-[2px]  laptop:mx-[30px] font-medium leading-normal text-[#000] dark:text-[#CACACA] `}
            >
              <h1>
                {item.title}
              </h1>
            </div>
            {
              item.NoOfButton!==1?
              <div className="w-[19.9vw] flex justify-between  tablet:mr-[18.5px]">
              <button className="w-[45%] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] bg-[#FAD308] dark:bg-[#FAD308] text-white rounded-[6px] tablet:rounded-[12.6px] laptop:rounded-[23px]">Edit</button>
              <button className="w-[52%] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] bg-[#FF4057] dark:bg-[#C13232] text-white rounded-[6px] tablet:rounded-[12.6px] laptop:rounded-[23px]">Remove</button>
              </div>

              :
            <Button color={item.ButtonColor}>{item.ButtonText}</Button>
            }
          </div>
        ))}
      </div>
    </div>

  );
};

export default VerificationBadges;
