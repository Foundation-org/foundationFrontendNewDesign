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
  const { protocol, host} = window.location;
  let url = `${protocol}//${host}/quest/${id}`;

  return (
    <div className="relative pb-[75px]">
      <div className="rounded-t-[26px] bg-[#000] py-[6px] pl-[22px]">
        <Twitter h="70px" w="70px" color="white" />
        <div
          className="absolute right-[26px] top-[29px] cursor-pointer"
          onClick={handleClose}
        >
          <Close color="white" />
        </div>
      </div>
      <div className="mx-[74px]">
        {/* QuestionCard Preview */}
        <div className="mt-[78px] w-[695px] rounded-[26px] bg-[#F3F3F3] px-6 pb-[23px] pt-5">
          <div className="flex items-start justify-between">
            {createdBy === localStorage.getItem("uId") ? (
              <div className="relative h-fit pb-[15px]">
                <img
                  src="/assets/svgs/dashboard/MeBadge.svg"
                  alt={alt}
                  className="h-[28.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
                />
                <p className="absolute left-[50%] top-[39%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[24px]">
                  Me
                </p>
              </div>
            ) : (
              <div className="relative h-fit pb-[15px]">
                <img
                  src={img}
                  alt={alt}
                  className="h-[28.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
                />
                <p className="absolute left-[50%] top-[39%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[24px]">
                  {badgeCount}
                </p>
              </div>
            )}
            <div>
              <h1 className="text-[10.414px] font-semibold leading-normal text-[#5B5B5B] tablet:text-[22px]">
                {title}
              </h1>
              <p className="text-center text-[10.414px] font-medium leading-normal text-[#9A9A9A] tablet:text-[14px]">
                Technology
              </p>
            </div>
            <p></p>
          </div>
          <h1 className="mt-[5px] text-[11.83px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">
            {question?.endsWith("?") ? "Q." : "S."} {question}
          </h1>
          <div className="mr-[30px] flex w-full justify-end gap-[19.14px] tablet:gap-[42px]">
            <button className=" mt-[16.2px] w-[81.8px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:mt-[24px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[18px]">
              Start
            </button>

            <button className="mt-[16.2px] w-[78px] rounded-[7.1px] border-[1.42px] border-[#20D47E] px-[7.1px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#20D47E] dark:border-[#7C7C7C] dark:text-[#C9C8C8] tablet:mt-[24px] tablet:w-[173px] tablet:rounded-[15px] tablet:border-[3px] tablet:px-5 tablet:py-2 tablet:text-[18px]">
              Results
            </button>
          </div>
          <div className="mt-[30px] flex h-3 w-full items-center justify-end gap-[2px] rounded-[4.73px] bg-[#F3F3F3] dark:bg-[#090A0D] tablet:h-[26px] tablet:gap-1 tablet:rounded-[10px]">
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
        <div className="flex justify-center gap-[43px]">
          <a
            className="mt-[16.2px] w-[212px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:mt-12 tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] text-center"
            href={`https://twitter.com/intent/tweet?text=${url}`}
            target="_blank"
          >
            Share a Post
          </a>
          <button className="mt-[16.2px] w-[341px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:mt-12 tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]">
            Send in a Personal Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterDialogue;
