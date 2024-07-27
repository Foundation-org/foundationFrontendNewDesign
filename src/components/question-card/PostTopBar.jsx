import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import showToast from '../ui/Toast';

export default function PostTopBar({ questStartData, postProperties, time }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [timeAgo, setTimeAgo] = useState('');

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

  const calculateTimeAgo = () => {
    const currentDate = new Date();
    const createdAtDate = new Date(time);

    if (isNaN(createdAtDate.getTime())) {
      setTimeAgo('Invalid date');
      return;
    }

    const timeDifference = currentDate - createdAtDate;
    const seconds = Math.floor(Math.max(timeDifference / 1000, 0));
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setTimeAgo(`${days} ${days === 1 ? 'day' : 'days'} ago`);
    } else if (hours > 0) {
      setTimeAgo(`${hours} ${hours === 1 ? 'hour' : 'hours'} ago`);
    } else if (minutes > 0) {
      setTimeAgo(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`);
    } else {
      setTimeAgo(`${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`);
    }
  };

  useEffect(() => {
    calculateTimeAgo();
  }, [time]);

  return (
    <div className="flex items-center justify-between border-b-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
      {postProperties !== 'SharedLinks' && postProperties !== 'HiddenPosts' && (
        <div className="flex items-center gap-[5.64px] tablet:gap-[14.36px]">
          {ratingImage ? (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/${ratingImage}`}
              alt={ratingImage.replace('.svg', '')}
              className=" h-[15px] w-full tablet:h-[23px]"
            />
          ) : null}
          <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem] ">
            {questStartData.QuestTopic}
          </h1>
        </div>
      )}
      {postProperties !== 'SharedLinks' && (
        <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C]  dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
            {postProperties === 'HiddenPosts' ? 'Hidden' : null} {timeAgo}
          </h4>
        </div>
      )}
      {postProperties === 'SharedLinks' && !questStartData?.suppressed && (
        <div className="flex w-full justify-between">
          <div className="max-w-48 tablet:max-w-[18rem] lgTablet:max-w-[28rem] laptop:max-w-fit">
            <h1 className="truncate text-wrap text-[10px] font-semibold text-gray-150 dark:text-white-200 tablet:text-[20px] tablet:font-medium">
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
      )}
    </div>
  );
}
