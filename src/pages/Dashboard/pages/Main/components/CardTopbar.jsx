import { useSelector } from "react-redux";

const CardTopbar = ({
  title,
  img,
  alt,
  badgeCount,
  isBookmarked,
  handleClickBookmark,
  bookmarkStatus,
  createdBy,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="flex items-center justify-between px-[10.4px] py-2 tablet:px-[22px] tablet:py-[17px]">
      {createdBy === localStorage.getItem("uId") ? (
        <div className="relative h-fit w-fit">
          <img
            src="/assets/svgs/dashboard/MeBadge.svg"
            alt={alt}
            className="h-[28.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
          />
          <p className="transform-center absolute z-50 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[17px]">
            Me
          </p>
        </div>
      ) : (
        <div className="relative h-fit w-fit">
          <img
            src={img}
            alt={alt}
            className="h-[28.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
          />
          <p className="transform-center absolute z-50 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[17px]">
            {badgeCount}
          </p>
        </div>
      )}
      <h1 className="text-[10.414px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF] tablet:text-[22px]">
        {title}
      </h1>
      <div onClick={() => handleClickBookmark(isBookmarked)}>
        {bookmarkStatus ? (
          persistedTheme !== "dark" ? (
            <img
              src="/assets/svgs/dashboard/bookmark-blue.svg"
              alt="save icon"
              className="h-[17px] w-[12.7px] cursor-pointer tablet:h-7 tablet:w-9"
            />
          ) : (
            <img
              src="/assets/svgs/dashboard/bookmark-white.svg"
              alt="save icon"
              className="h-[17px] w-[12.7px] cursor-pointer tablet:h-7 tablet:w-9"
            />
          )
        ) : (
          <img
            src="/assets/svgs/dashboard/save.svg"
            alt="save icon"
            className="h-[17px] w-[12.7px] cursor-pointer tablet:h-7 tablet:w-9"
          />
        )}
      </div>
    </div>
  );
};

export default CardTopbar;
