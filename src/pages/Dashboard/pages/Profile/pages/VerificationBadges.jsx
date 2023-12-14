import { useSelector } from "react-redux";
import Button from "../components/Button";

const VerificationBadges = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const items = [
    {
      image: "/assets/svgs/dashboard/mail1.svg",
      title: "Personal Email",
      addButtonColor: "gray",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/mail1.svg",
      title: "Work Email",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/mail1.svg",
      title: "Education Email",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/mail2.svg",
      title: "Personal Email",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/mail2.svg",
      title: "Work Gmail",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/mail2.svg",
      title: "Education Gmail",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/eth.svg",
      title: "Etherium Wallet",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/linkedin.svg",
      title: "LinkedIn",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/github.svg",
      title: "Github",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/fb.svg",
      title: "Facebook",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/Twitter.png",
      title: "Twitter",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/insta.svg",
      title: "Instagram",
      addButtonColor: "gray",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/geo.svg",
      title: "Geolocation",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/phone.svg",
      title: "Personal Phone",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/workphone.svg",
      title: "Work Phone",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/webAuth.svg",
      title: "WebAuth Desktop",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/webAuth.svg",
      title: "WebAuth Mobile",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/identity.svg",
      title: "Identity",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
    {
      image: "/assets/svgs/dashboard/multiAuth.svg",
      title: "Multi-Factor Authentication",
      addButtonColor: "blue",
      removeButtonColor: "red",
    },
  ];

  return (
    <div>
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] dark:text-[#B8B8B8] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px]">
        My Verification Badges
      </h1>
      <div
        className={`${
          persistedTheme === "dark" ? "dark-shadow-inside" : "shadow-inside"
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
        {items.map((item, index) => (
          <div
            className="flex items-center gap-[5px] tablet:gap-[10.59px]"
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${
                persistedTheme === "dark"
                  ? "dark-shadow-input"
                  : "shadow-inside"
              } ml-2 flex w-full items-center rounded-[6px] tablet:mx-[2px] tablet:rounded-[10.11px] laptop:mx-[30px] laptop:rounded-[18.335px]`}
            >
              <h1 className="py-[6.8px] pl-[13.2px] text-[6.357px] font-medium leading-normal text-[#000] dark:text-[#CACACA] tablet:py-[14.3px] tablet:pl-7 tablet:text-[13.24px] laptop:pl-[50px] laptop:text-[24px]">
                {item.title}
              </h1>
            </div>
            <Button color={item.addButtonColor}>Add</Button>
            <Button color={item.removeButtonColor}>Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationBadges;
