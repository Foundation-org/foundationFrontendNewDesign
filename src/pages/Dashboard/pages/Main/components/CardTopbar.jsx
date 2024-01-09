import { useSelector } from "react-redux";

const CardTopbar = ({ img, alt, badgeCount, createdBy, QuestTopic }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  return (
    <div className="flex items-center justify-between border-b-2 border-[#D9D9D9] px-[10.4px] py-[5.2px] tablet:px-[22px] tablet:py-[10px] dark:border-white">
      {createdBy === persistedUserInfo?.uuid ? (
        <div className="relative h-fit w-fit">
          <img
            src="/assets/svgs/dashboard/MeBadge.svg"
            alt={alt}
            className="h-[28.379px] w-[22.722px] tablet:h-[46px] tablet:w-[34px]"
          />
          <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[11.3px] font-[400] leading-normal text-[#7A7016] tablet:top-1/2 tablet:pb-3 tablet:text-[15px]">
            {badgeCount}
          </p>
        </div>
      ) : (
        <div className="relative z-50 h-fit w-fit">
          <img
            src={img}
            alt={alt}
            className="h-[28.379px] w-[22.722px] tablet:h-[46px] tablet:w-[34px]"
          />
          <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:top-1/2 tablet:pb-3 tablet:text-[15px]">
            {badgeCount}
          </p>
        </div>
      )}
      <h1 className="text-center text-[10.414px] font-medium leading-normal text-[#9A9A9A] tablet:text-[1.25rem] dark:text-[#9A9A9A]">
        {QuestTopic}
      </h1>
    </div>
  );
};

export default CardTopbar;
