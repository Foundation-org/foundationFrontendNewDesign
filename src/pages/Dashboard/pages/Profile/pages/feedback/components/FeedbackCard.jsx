import { hideReasons } from '../../../../../../../constants/hiddenPosts';
import { Button } from '../../../../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const FeedbackCard = ({ innerRef, persistedUserInfo, post }) => {
  const navigate = useNavigate();

  return (
    <div
      ref={innerRef}
      className="max-w-[730px] rounded-[12.3px] border-2 border-[#D9D9D9] bg-white tablet:rounded-[15px] dark:border-white dark:bg-[#000] "
    >
      <div className="mb-2 flex justify-between border-b border-[#D9D9D9] px-2 py-[5px] tablet:mb-5 tablet:border-b-2 tablet:px-5 tablet:py-[11px] laptop:px-5">
        <div className="flex w-full items-center justify-between gap-[10px] tablet:gap-[18px]">
          <div className="flex items-center gap-2 tablet:gap-4 ">
            {post.uuid === persistedUserInfo?.uuid ? (
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                  {post.getUserBadge?.badges?.length}
                </p>
              </div>
            ) : (
              <div className="relative z-50 h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                  {post.getUserBadge?.badges?.length}
                </p>
              </div>
            )}

            {post.suppressed && (
              <div className="mt-[1.5px] flex items-center gap-1.5 pr-5 tablet:mt-[3px] tablet:gap-3 tablet:pr-6">
                <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#FF2C2C] tablet:text-[1.25rem] tablet:leading-[23px]">
                  SUPRESSED
                </h4>
              </div>
            )}
          </div>
          <div className="flex items-center gap-[15px]">
            <h4 className="text-[10px] font-normal leading-[10px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
              {post.hiddenCount} Times Hidden
            </h4>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/hidden-eye.svg`}
              alt="popup logo"
              className="size-4 tablet:h-auto tablet:w-auto"
            />
          </div>
        </div>
      </div>
      <h1 className="ml-5 text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:ml-8 tablet:text-[1.25rem] tablet:leading-[23px]">
        {post.Question}
      </h1>
      <div className="mb-3 ml-7 mt-2 grid grid-cols-2 gap-x-[23px] gap-y-2 tablet:mb-[26px] tablet:ml-[60px] tablet:mt-[15px] tablet:gap-x-[50px] tablet:gap-y-[15px] ">
        {hideReasons.map((item) => {
          const feedbackItem = post.feedback.find((feedback) => feedback.id === item.title);
          const feedbackCount = feedbackItem ? feedbackItem.count : 0;
          const feedbackViolated = feedbackItem ? feedbackItem.violated : false;

          return (
            <p
              key={item.id}
              className={`${post.suppressedReason === item.title && item.title === 'Invalid Media' ? 'font-semibold text-[#DC1010]' : feedbackViolated ? 'font-semibold text-[#DC1010]' : feedbackCount >= 1 ? 'text-[#4A8DBD]' : 'font-normal text-[#BABABA]'} text-[10px] tablet:text-[18px]`}
            >
              {feedbackCount} {item.title}
            </p>
          );
        })}
      </div>
      <div className="mb-[0.94rem] mr-[14.4px] flex justify-end tablet:mb-6 tablet:mr-[3.44rem]">
        <Button
          variant="submit"
          onClick={() => navigate('/quest/isfullscreen', { state: { questId: post._id, questType: 'feedback' } })}
        >
          View
        </Button>
      </div>
    </div>
  );
};
