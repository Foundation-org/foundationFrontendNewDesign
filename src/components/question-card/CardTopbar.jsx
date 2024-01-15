import { useSelector } from "react-redux";

const CardTopbar = ({ img, alt, badgeCount, createdBy, QuestTopic }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="flex items-center justify-between border-b-2 border-[#D9D9D9] px-2 py-2 tablet:px-5 tablet:py-[0.63rem] laptop:px-4">
      {createdBy === persistedUserInfo?.uuid ? (
        <div className="relative h-fit w-fit">
          <img
            src="/assets/svgs/dashboard/MeBadge.svg"
            alt={alt}
            className="h-[18.5px] w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] laptop:h-[29px] laptop:w-[22.888pxpx]"
          />
          <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:top-1/2 tablet:text-[15px]">
            {persistedUserInfo?.badges?.length}
          </p>
        </div>
      ) : (
        <div className="relative z-50 h-fit w-fit">
          <img
            src={img}
            alt={alt}
            className="h-[18.5px] w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] laptop:h-[29px] laptop:w-[22.888pxpx]"
          />
          <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:top-1/2 tablet:text-[15px]">
            {badgeCount}
          </p>
        </div>
      )}
      <h1 className="text-[0.57375rem] font-medium text-[#9A9A9A] tablet:text-[1.26144rem] laptop:text-[1rem]">
        {QuestTopic}
      </h1>
    </div>
  );
};

export default CardTopbar;
