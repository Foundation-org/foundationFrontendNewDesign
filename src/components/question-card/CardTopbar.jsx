// import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import BookmarkIcon from '../../pages/Dashboard/pages/QuestStartSection/components/BookmarkIcon';
import { capitalizeFirstLetter } from '../../utils/utils';

const CardTopbar = ({
  questStartData,
  img,
  alt,
  badgeCount,
  createdBy,
  QuestTopic,
  bookmarkStatus,
  handleBookmark,
  postProperties,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  // const persistedUserInfo = useSelector((state) => state.auth.user);

  // const { protocol, host } = window.location;
  // let url = `${protocol}//${host}/p/${questStartData?.userQuestSetting?.link}`;

  // const copyToClipboard = async () => {
  //   const textToCopy = url;

  //   try {
  //     await navigator.clipboard.writeText(textToCopy);
  //   } catch (err) {
  //     console.error('Unable to copy text to clipboard:', err);
  //   }
  // };

  // const moderationRatingCount = questStartData?.moderationRatingCount;
  // let ratingImage = null;

  // if (moderationRatingCount === 0) {
  //   ratingImage = 'post-e.svg';
  // } else ratingImage = 'post-a.svg';
  // flex w-full gap-2 pl-[0.87rem] pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[63.04px] tablet:pr-[100.08px] laptop:px-7 desktop:pl-[63.04px] desktop:pr-[100.08px]

  // <div className="flex flex-col justify-between border-gray-250 px-2 pt-2 tablet:px-5 tablet:pt-4"></div>

  return (
    <div className="flex flex-col justify-between border-gray-250 px-[0.87rem] pt-2 tablet:px-10 tablet:pt-4">
      <div className="flex items-start justify-between border-gray-250">
        <div className="flex flex-col gap-[10px] tablet:gap-[18px]">
          {/* <div className="flex items-start gap-2 tablet:gap-4 "> */}
          {/* {createdBy === persistedUserInfo?.uuid ? (
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt={alt}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                  {badgeCount}
                </p>
              </div>
            ) : (
              <div className="relative z-50 h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                  alt={alt}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                  {badgeCount}
                </p>
              </div>
            )} */}

          <div className="mt-[1.5px] flex gap-1.5 pr-5 tablet:mt-[3px] tablet:gap-3 tablet:pr-6">
            {/* <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
              {questStartData.Question?.endsWith('?') ? 'Q.' : 'S.'}
            </h4> */}
            <h4 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 tablet:text-[1.25rem] tablet:leading-[23px] dark:text-white-400">
              {capitalizeFirstLetter(questStartData.Question)}
            </h4>
          </div>
          {/* </div> */}
        </div>

        {postProperties === 'HiddenPosts' ? (
          // <div className="flex items-center gap-2">
          //   <h1 className="text-[0.57375rem] font-medium text-[#9A9A9A] tablet:text-[1.26144rem] laptop:text-[1rem]">
          //     {questStartData?.userQuestSetting?.hiddenMessage}
          //   </h1>
          //   <img
          //     src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-latest-cut.svg`}
          //     alt="eye-cut"
          //     className="h-[15.67px] w-[15.24px] tablet:h-[26.6px] tablet:w-[30px]"
          //   />
          // </div>
          <></>
        ) : postProperties === 'SharedLinks' ? (
          <></>
        ) : (
          questStartData?.type !== 'embed' && (
            // <div
            //   className="flex cursor-pointer items-center gap-[4.8px] tablet:gap-3"
            //   onClick={() => {
            //     copyToClipboard();
            //     toast.success('Link Copied!');
            //   }}
            // >
            //   <img
            //     src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copylinkblue.png`}
            //     alt="eye-cut"
            //     className="h-3 w-3 tablet:h-[22.92px] tablet:w-[19.79px]"
            //   />
            //   <h1 className="text-[10.45px] font-semibold text-[#6BA5CF] tablet:text-[20px]">Copy Link</h1>
            // </div>
            <>
              {/* <div className=" mr-[20.64px]  flex items-center gap-[5.64px] tablet:mr-[37.36px] tablet:gap-[14.36px]">
              {ratingImage ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/${ratingImage}`}
                  alt={ratingImage.replace('.svg', '')}
                  className=" h-[15px] w-full tablet:h-[23px]"
                />
              ) : null}
              <h1 className="relative text-[0.57375rem] font-medium text-[#9A9A9A] tablet:text-[1.26144rem] laptop:text-[1rem]">
                {QuestTopic}
              </h1>
            </div> */}

              <BookmarkIcon
                bookmarkStatus={bookmarkStatus}
                persistedTheme={persistedTheme}
                handleBookmark={handleBookmark}
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default CardTopbar;
