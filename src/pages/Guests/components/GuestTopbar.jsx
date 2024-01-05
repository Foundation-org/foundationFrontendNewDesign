const GuestTopbar = ({ createdBy, badgeCount, title,QuestTopic,img }) => {
  return (
    <div className="flex items-center justify-between px-[10.4px] py-2 tablet:px-[22px] tablet:py-[17px]">
      {createdBy === localStorage.getItem("uId") ? (
        <div className="relative h-fit w-fit">
          <img
            src="/assets/svgs/dashboard/MeBadge.svg"
            alt="Me Badge"
            className="h-[28.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
          />
          <p className="transform-center absolute z-50 text-[11.3px] font-[400] leading-normal text-black tablet:pb-3 tablet:text-[17px]">
            Me
          </p>
        </div>
      ) : (
        <div className="relative h-fit w-fit">
          <img
            src={img}
            alt="badge"
            className="h-[28.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
          />
          <p className="transform-center absolute z-50 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[17px]">
            {badgeCount}
          </p>
        </div>
      )}
      <div>
        <h1 className="text-[10.414px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF] tablet:text-[22px]">
          {title}
        </h1>
        <h1 className="text-center text-[10.414px] font-medium leading-normal text-[#9A9A9A] dark:text-[#9A9A9A] tablet:text-[1.125rem]">
          {QuestTopic}
        </h1>
      </div>
      <p></p>
    </div>
  );
};

export default GuestTopbar;
