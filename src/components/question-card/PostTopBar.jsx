import { useSelector } from 'react-redux';
import { calculateTimeAgo } from '../../utils/utils';
import showToast from '../ui/Toast';

export default function PostTopBar({ questStartData, postProperties, setDelModalVisible }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  let ratingImage = null;

  if (questStartData?.moderationRatingCount === 0) {
    ratingImage = 'post-e.svg';
  } else ratingImage = 'post-a.svg';

  const { protocol, host } = window.location;
  let sharedPostUrl = `${protocol}//${host}/p/${questStartData?.userQuestSetting?.link}`;

  const copyToClipboard = async () => {
    const textToCopy = sharedPostUrl;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <>
      {postProperties !== 'SharedLinks' && postProperties !== 'HiddenPosts' && (
        <div className="flex items-center justify-between border-b-2 border-gray-250 px-[0.57rem] py-[5px] tablet:px-5 tablet:py-[11px] dark:border-gray-100">
          {/* Topic */}
          <div className="flex items-center gap-[5.64px] tablet:gap-[14.36px]">
            {ratingImage ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/${ratingImage}`}
                alt={ratingImage.replace('.svg', '')}
                className=" h-[15px] w-full tablet:h-[23px]"
              />
            ) : null}
            <h1 className="text-[0.6rem] font-medium text-accent-200 tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white-200 ">
              {questStartData.QuestTopic}
            </h1>
          </div>
          {/* Delete */}
          {!questStartData?.result?.length >= 1 &&
            questStartData.uuid === persistedUserInfo.uuid &&
            questStartData.type !== 'embed' && (
              <button
                className="flex min-w-[63px] items-center gap-1 tablet:min-w-[146px] tablet:justify-center tablet:gap-2"
                onClick={() => setDelModalVisible(true)}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/hiddenposts/unhide/deletePost.png'}`}
                  alt="eye-latest"
                  className="h-3 w-[9px] tablet:h-[22px] tablet:w-[17px]"
                />
                <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem] dark:text-white-200">
                  Delete
                </h1>
              </button>
            )}
          {/* TimeStamp */}
          {postProperties !== 'SharedLinks' && postProperties !== 'HiddenPosts' && (
            <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
                alt="clock"
                className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
              />
              <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C]  tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white">
                {calculateTimeAgo(questStartData?.createdAt)}
              </h4>
            </div>
          )}
        </div>
      )}
      {postProperties !== 'SharedLinks' && postProperties === 'HiddenPosts' && (
        <div className="flex items-center justify-between border-b-2 border-gray-250 px-[0.57rem] py-[5px] tablet:px-5 tablet:py-[11px] dark:border-gray-100">
          <div className="flex h-4 w-full items-center justify-between gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
            {questStartData.userQuestSetting.feedbackTime && (
              <div className="flex items-center gap-1">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
                  alt="clock"
                  className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
                />
                <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C]  tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white">
                  Feedback Given {calculateTimeAgo(questStartData.userQuestSetting.feedbackTime)}
                </h4>
              </div>
            )}
            {questStartData.userQuestSetting.hidden && (
              <div className="flex items-center gap-1">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
                  alt="clock"
                  className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
                />
                <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C]  tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white">
                  Hidden {calculateTimeAgo(questStartData.userQuestSetting.hiddenTime)}
                </h4>
              </div>
            )}
          </div>
        </div>
      )}
      {postProperties === 'SharedLinks' && !questStartData?.suppressed && (
        <div className="flex items-center justify-between border-b-2 border-gray-250 px-[0.57rem] py-[5px] tablet:px-5 tablet:py-[11px] dark:border-gray-100">
          <div className="flex w-full justify-between">
            <div className="max-w-48 tablet:max-w-[18rem] lgTablet:max-w-[28rem] laptop:max-w-fit">
              <h1 className="truncate text-wrap text-[10px] font-semibold text-gray-150 tablet:text-[20px] tablet:font-medium dark:text-white-200">
                {sharedPostUrl}
              </h1>
            </div>
            <div
              className="flex cursor-pointer items-center gap-[4.8px] tablet:gap-3"
              onClick={() => {
                copyToClipboard();
                showToast('success', 'copyLink');
              }}
            >
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copylinkblue.png`}
                alt="eye-cut"
                className="h-3 w-3 tablet:h-[22.92px] tablet:w-[19.79px]"
              />
              <h1 className="text-[10.45px] font-semibold text-[#6BA5CF] tablet:text-[20px]">Copy Link</h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
