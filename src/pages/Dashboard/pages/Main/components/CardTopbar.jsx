import { useSelector } from "react-redux";

const CardTopbar = ({ title, img, alt, badgeCount, isBookmarked }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="flex items-center justify-between px-[22px] py-[17px]">
      <div className="relative h-fit w-fit">
        <img src={img} alt={alt} className="h-[60px] w-[48px]" />
        <p className="transform-center absolute z-50 pb-5 text-[17px] font-[400] leading-normal text-[#F6F6F6]">
          {badgeCount}
        </p>
      </div>
      <h1 className="text-[22px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF]">
        {title}
      </h1>
      {isBookmarked ? (
        persistedTheme !== "dark" ? (
          <img
            src="/assets/svgs/dashboard/bookmark-blue.svg"
            alt="save icon"
            className="h-7 w-9 cursor-pointer"
          />
        ) : (
          <img
            src="/assets/svgs/dashboard/bookmark-white.svg"
            alt="save icon"
            className="h-7 w-9 cursor-pointer"
          />
        )
      ) : (
        <img
          src="/assets/svgs/dashboard/save.svg"
          alt="save icon"
          className="h-7 w-9 cursor-pointer"
        />
      )}
    </div>
  );
};

export default CardTopbar;
