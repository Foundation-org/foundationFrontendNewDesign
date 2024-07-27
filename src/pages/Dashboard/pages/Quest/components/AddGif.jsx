// import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
// import { Button } from '../../../../../components/ui/Button';
// import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useDebounce } from '../../../../../utils/useDebounce';
import { extractPartFromUrl, extractYouTubeVideoId } from '../../../../../utils/embeddedutils';
import { soundcloudUnique, youtubeBaseURLs } from '../../../../../constants/addMedia';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import ReactPlayer from 'react-player/lazy';
import './Player.css';
import showToast from '../../../../../components/ui/Toast';

export default function AddGif({ handleTab }) {
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const getMediaStates = useSelector(createQuestAction.getGif);
  let debouncedURL = useDebounce(getMediaStates.url, 1000);

  const autoGrow = () => {
    const element = textareaRef.current;
    element.style.height = '5px';
    element.style.height = `${element.scrollHeight}px`;
  };

  // // To show and hide artwork on different screen sizes
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 744) {
  //       // Hide artwork for screens smaller than 400px
  //       setMediaURL(`${debouncedURL}&show_artwork=false`);
  //     } else {
  //       // Show artwork for larger screens
  //       setMediaURL(debouncedURL);
  //     }
  //   };

  //   handleResize();

  //   window.addEventListener('resize', handleResize);

  //   return () => window.removeEventListener('resize', handleResize);
  // }, [debouncedURL]);

  const urlVerification = async (value) => {
    if (getMediaStates.validatedUrl === value) return;
    dispatch(createQuestAction.checkGifUrl({ url: getMediaStates.gifUrl }));
  };

  return (
    <div>
      {getMediaStates?.isGifMedia ? (
        <div className="w-[calc(100%-51.75px] relative mx-[15px] mt-3 flex flex-col gap-[6px] rounded-[7.175px] border border-white-500 p-[15px] px-[5px] py-[10px] tablet:mx-11 tablet:mt-[25px] tablet:gap-[15px] tablet:border-[2.153px] tablet:px-[15px] tablet:py-[25px] dark:border-gray-250">
          <h1 className="absolute -top-[5.5px] left-5 bg-white text-[10px] font-semibold leading-[10px] text-[#707175] tablet:-top-[11px] tablet:left-9 tablet:text-[20px] tablet:leading-[20px] dark:bg-gray-200 dark:text-white-400">
            GIF
          </h1>
          <div
            className="absolute -right-[7px] -top-[5px] z-0 cursor-pointer tablet:-right-5 tablet:-top-[26px]"
            onClick={() => {
              dispatch(createQuestAction.updateIsGifMedia(false));
              dispatch(createQuestAction.clearGif());
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
              alt="mediaCloseIcon"
              className="size-[15px] tablet:size-[41px]"
            />
          </div>
          {/* <img src={getMediaStates?.gifUrl} alt="" /> */}

          {getMediaStates.gifUrlStatus.tooltipName !== 'Question is Verified' && (
            <div className="flex">
              <textarea
                ref={textareaRef}
                onInput={autoGrow}
                id="input-1"
                tabIndex={2}
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                onChange={(e) => {
                  dispatch(createQuestAction.addGifUrl(e.target.value));
                }}
                onBlur={(e) => e.target.value.trim() !== '' && urlVerification(e.target.value.trim())}
                value={getMediaStates.gifUrl}
                placeholder={'Paste a GIPHY Sharelink or Url here'}
                className="box-border flex h-[27px] min-h-[27px] w-full resize-none items-center overflow-hidden rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] py-[7px] pr-2 text-[0.625rem] font-normal leading-[0.625rem] text-[#7C7C7C] focus-visible:outline-none tablet:h-[51px] tablet:min-h-[51px] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:text-[18px] dark:border-gray-100 dark:bg-accent-100 dark:text-white-400"
              />
              <button
                className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-gray-100 dark:bg-accent-100 ${getMediaStates.gifUrlStatus.color}`}
              >
                <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px] dark:border-gray-100">
                  {getMediaStates.gifUrlStatus.name}
                </div>
                <Tooltip optionStatus={getMediaStates.gifUrlStatus} type="mediaURL" />
              </button>
            </div>
          )}
          {getMediaStates.gifUrlStatus.tooltipName === 'Question is Verified' && (
            <div className="player-wrapper relative mt-1 cursor-pointer rounded-[10px] tablet:mt-[10px]">
              <div className="flex justify-center">
                <div
                  className={`absolute -right-1 -top-[6px] z-20 tablet:-top-4 tablet:right-10  ${getMediaStates.gifUrl ? 'block' : 'hidden'}`}
                  onClick={() => {
                    dispatch(createQuestAction.clearGifUrl());
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                    alt="mediaCloseIcon"
                    className="size-[15px] tablet:size-[41px]"
                  />
                </div>
                <img src={getMediaStates.gifUrl} alt="create post gif" />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
