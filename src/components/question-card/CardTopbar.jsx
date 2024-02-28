import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import BookmarkIcon from '../../pages/Dashboard/pages/QuestStartSection/components/BookmarkIcon';

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
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/p/${questStartData?.uniqueShareLink}`;

  const copyToClipboard = async () => {
    const textToCopy = url;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <div className="flex items-center justify-between border-b-2 border-[#D9D9D9] px-2 py-1 tablet:px-5 tablet:py-[0.63rem] laptop:px-4">
      <div className="flex items-center gap-5 tablet:gap-10">
        {createdBy === persistedUserInfo?.uuid ? (
          <div className="relative h-fit w-fit">
            <img
              src="/assets/svgs/dashboard/MeBadge.svg"
              alt={alt}
              className="h-[18.5px] w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] laptop:h-[29px] laptop:w-[22.888px]"
            />
            <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[12px]">
              {badgeCount}
            </p>
          </div>
        ) : (
          <div className="relative z-50 h-fit w-fit">
            <img
              src={'/assets/svgs/dashboard/badge.svg'}
              alt={alt}
              className="h-[18.5px] w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] laptop:h-[29px] laptop:w-[22.888px]"
            />
            <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[15px]">
              {badgeCount}
            </p>
          </div>
        )}
        {postProperties === 'SharedLinks' && (
          <h1 className="text-[10px] tablet:text-[20px] text-[#707175] font-semibold tablet:font-medium">{url}</h1>
        )}
      </div>
      {postProperties === 'HiddenPosts' ? (
        <div className="flex items-center gap-3">
          <h1 className="text-[0.57375rem] font-medium text-[#9A9A9A] tablet:text-[1.26144rem] laptop:text-[1rem]">
            {questStartData?.userQuestSetting?.hiddenMessage}
          </h1>
          <img
            src="/assets/svgs/eye-latest-cut.svg"
            alt="eye-cut"
            className="w-[15.24px] tablet:w-[30px] h-[10.67px] tablet:h-[26.6px]"
          />
        </div>
      ) : postProperties === 'SharedLinks' ? (
        <div
          className="flex items-center gap-[4.8px] tablet:gap-3 cursor-pointer"
          onClick={() => {
            copyToClipboard();
            toast.success('Link Copied!');
          }}
        >
          <img
            src="/assets/svgs/copylinkblue.png"
            alt="eye-cut"
            className="w-3 tablet:w-[19.79px] h-3 tablet:h-[22.92px]"
          />
          <h1 className="text-[10.45px] font-semibold text-[#6BA5CF] tablet:text-[20px]">Copy Link</h1>
        </div>
      ) : (
        <>
          <h1 className="text-[0.57375rem] font-medium text-[#9A9A9A] tablet:text-[1.26144rem] laptop:text-[1rem]">
            {QuestTopic}
          </h1>
          <BookmarkIcon
            bookmarkStatus={bookmarkStatus}
            persistedTheme={persistedTheme}
            handleBookmark={handleBookmark}
          />
        </>
      )}
    </div>
  );
};

export default CardTopbar;
