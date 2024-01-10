import { useSelector } from "react-redux";
import Close from "../../../../../../assets/Close";
import Twitter from "../../../../../../assets/Twitter";

const TwitterDialogue = ({
  handleClose,
  createdBy,
  img,
  alt,
  badgeCount,
  title,
  question,
  timeAgo,
  id,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/quest/${id}`;

  return (
    <div className="relative w-[90vw] pb-[17px] tablet:pb-[75px] laptop:w-[52.6rem]">
      <div className="rounded-t-[9.251px] bg-[#000] py-[6px] pl-[22px] tablet:py-4 laptop:rounded-t-[26px]">
        <Twitter color="white" />
        <div
          className="absolute right-[12px] top-[14px] cursor-pointer tablet:right-[26px] tablet:top-4"
          onClick={handleClose}
        >
          <Close color="white" />
        </div>
      </div>
      <div className="mx-6 tablet:mx-[74px]">
        {/* QuestionCard Preview */}
        <div className="mt-[19.84px] w-full rounded-[9.8px] bg-[#F3F3F3] px-6 pb-[23px] pt-5 tablet:mt-[78px] tablet:rounded-[26px]">
          <div className="flex items-start justify-between">
            {createdBy === persistedUserInfo?.uuid ? (
              <div className="relative h-fit pb-[15px]">
                <img
                  src="/assets/svgs/dashboard/MeBadge.svg"
                  alt={alt}
                  className="h-[18.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
                />
                <p className="absolute left-[50%] top-[24%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[9px] font-[400] leading-normal text-[#7A7016] tablet:top-[39%] tablet:pb-3 tablet:text-[24px]">
                  {persistedUserInfo?.badges?.length}
                </p>
              </div>
            ) : (
              <div className="relative h-fit pb-[15px]">
                <img
                  src={img}
                  alt={alt}
                  className="h-[18.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
                />
                <p className="absolute left-[50%] top-[24%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[9px] font-[400] leading-normal text-[#F6F6F6] tablet:top-[39%] tablet:pb-3 tablet:text-[24px]">
                  {badgeCount}
                </p>
              </div>
            )}
            <div>
              <h1 className="text-[8.25px] font-semibold leading-normal text-[#5B5B5B] tablet:text-[22px]">
                {title}
              </h1>
              <p className="text-center text-[5.2px] font-medium leading-normal text-[#9A9A9A] tablet:text-[14px]">
                Technology
              </p>
            </div>
            <p></p>
          </div>
          <h1 className="mt-[7px] text-[7.58px] font-medium leading-normal text-[#7C7C7C] tablet:text-[20px] tablet:font-semibold">
            {question?.endsWith("?") ? "Q." : "S."} {question}
          </h1>
          <div className="mr-[30px] flex w-full justify-end gap-[19.14px] tablet:gap-[42px]">
            <button className=" mt-[16.2px] w-[81.8px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:mt-[24px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[18px]">
              Start
            </button>
            <button className="mt-[16.2px] w-[78px] rounded-[7.1px] border-[1.42px] border-[#20D47E] px-[7.1px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#20D47E] tablet:mt-[24px] tablet:w-[173px] tablet:rounded-[15px] tablet:border-[3px] tablet:px-5 tablet:py-2 tablet:text-[18px] dark:border-[#7C7C7C] dark:text-[#C9C8C8]">
              Results
            </button>
          </div>
          <div className="mt-[11.36px] flex h-3 w-full items-center justify-end gap-[2px] rounded-[4.73px] bg-[#F3F3F3] tablet:mt-[30px] tablet:h-[26px] tablet:gap-1 tablet:rounded-[10px]">
            <img
              src="/assets/svgs/dashboard/clock-outline.svg"
              alt="clock"
              className="h-[7.64px] w-[7.64px] tablet:h-4 tablet:w-4"
            />
            <p className="text-[6px] font-[400] leading-normal text-[#9C9C9C] tablet:text-[10px]">
              {timeAgo}
            </p>
          </div>
        </div>
        {/* Share Button */}
        <div className="mt-[18.51px] flex flex-col items-center justify-center gap-3 tablet:mt-12 laptop:flex-row laptop:gap-[43px]">
          <a
            className="w-[212px] rounded-[5.56px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-center text-[12px] font-semibold leading-normal text-white tablet:w-[341px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] laptop:w-[212px]"
            href={`https://twitter.com/intent/tweet?text=${url}`}
            target="_blank"
          >
            Share a Post
          </a>
          <button className="w-[212px] rounded-[5.56px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[12px] font-semibold leading-normal text-white tablet:w-[341px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]">
            Send in a Personal Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterDialogue;
