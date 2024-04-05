import { toast } from 'sonner';
import { Tooltip } from '../../../../../utils/Tooltip';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import ReactPlayer from 'react-player';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import './Player.css';
import { useDebounce } from '../../../../../utils/useDebounce';

export default function AddMedia({ handleTab }) {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const debouncedURL = useDebounce(getMediaStates.url, 1000);
  const [mediaURL, setMediaURL] = useState(debouncedURL);
  const [soundcloudUnique] = useState('soundcloud.com');
  const [youtubeBaseURLs] = useState([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtube-nocookie.com',
    'youtu.be',
  ]);

  const handleVideoEnded = () => {
    console.log('ended');
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.getInternalPlayer().play(); // Resume playback
    }
  };

  function extractYouTubeVideoId(url) {
    const patternLong = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const patternShort = /youtu\.be\/([^"&?/ ]{11})/;

    const matchLong = url.match(patternLong);
    const matchShort = url.match(patternShort);

    if (matchLong && matchLong[1]) {
      return matchLong[1]; // Full YouTube URL
    } else if (matchShort && matchShort[1]) {
      return matchShort[1]; // Short YouTube URL
    } else {
      return null; // Invalid or unsupported URL
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        // Hide artwork for screens smaller than 400px
        setMediaURL(`${debouncedURL}&show_artwork=false`);
      } else {
        // Show artwork for larger screens
        setMediaURL(debouncedURL);
      }
    };

    // Initial call
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedURL]);

  // Process the debounced value when it changes
  useEffect(() => {
    if (youtubeBaseURLs.some((baseURL) => debouncedURL?.includes(baseURL))) {
      const videoId = extractYouTubeVideoId(debouncedURL);
      checkVideoAgeRestriction(videoId, debouncedURL);
    } else {
      dispatch(createQuestAction.addMediaUrl(debouncedURL));
    }
  }, [debouncedURL]);

  function checkVideoAgeRestriction(videoId, userValue) {
    const apiKey = import.meta.env.VITE_GG_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const contentRating = data?.items[0]?.contentDetails?.contentRating?.ytRating;
        const isAdultContent = contentRating === 'ytAgeRestricted';

        if (isAdultContent === false) {
          dispatch(createQuestAction.addMediaUrl(userValue));
        } else {
          toast.error("It's an adult video");
          dispatch(createQuestAction.addMediaUrl(''));
        }
      })
      .catch((error) => console.error('Error:', error));
  }

  useEffect(() => {
    // Check if the URL is a SoundCloud playlist
    if (getMediaStates.url?.includes(soundcloudUnique) && getMediaStates.url?.includes('/sets/')) {
      toast.error('We do not support SoundCloud playlists');
      dispatch(createQuestAction.addMediaUrl('')); // Set URL to empty string
      return; // Stop execution
    }

    // Check if the URL is a YouTube playlist
    if (
      youtubeBaseURLs.some((baseURL) => getMediaStates.url?.includes(baseURL)) &&
      getMediaStates.url.includes('list=')
    ) {
      toast.error('We do not support YouTube playlists');
      dispatch(createQuestAction.addMediaUrl('')); // Set URL to empty string
      return; // Stop execution
    }
  }, [getMediaStates.url]);

  // TO handle Media Description
  const handleDescChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 350) {
      dispatch(createQuestAction.addMediaDesc(inputValue));
    }
  };

  const descVerification = async (value) => {
    if (getMediaStates.validatedDescription === value) return;
    dispatch(createQuestAction.checkDescription(value));
  };

  return (
    <div>
      {getMediaStates?.isMedia ? (
        <div className="w-[calc(100%-51.75px] relative mx-[15px] mt-1 flex flex-col gap-[6px] rounded-[7.175px] border border-[#DEE6F7] p-[15px] px-[5px] py-[10px] tablet:mx-11 tablet:mt-[25px] tablet:gap-[15px] tablet:border-[2.153px] tablet:px-[15px] tablet:py-[25px]">
          <h1 className="absolute -top-[5.5px] left-5 bg-white text-[10px] font-semibold leading-[10px] text-[#707175] tablet:-top-[11px] tablet:left-9 tablet:text-[20px] tablet:leading-[20px]">
            Media
          </h1>
          <div
            className="absolute -right-[7px] -top-[5px] z-0 cursor-pointer tablet:-right-5 tablet:-top-[26px]"
            onClick={() => {
              dispatch(createQuestAction.updateIsMedia(false));
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
              alt="mediaCloseIcon"
              className="size-[15px] tablet:size-[41px]"
            />
          </div>
          <div className="flex">
            <TextareaAutosize
              id="input-0"
              tabIndex={1}
              onChange={handleDescChange}
              onBlur={(e) => e.target.value.trim() !== '' && descVerification(e.target.value.trim())}
              value={getMediaStates.desctiption}
              placeholder="Please describe this media..."
              onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
              className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
            />
            <button
              className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${getMediaStates.mediaDescStatus.color}`}
            >
              <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                {getMediaStates.mediaDescStatus.name}
              </div>
              <Tooltip optionStatus={getMediaStates.mediaDescStatus} />
            </button>
          </div>
          {debouncedURL === '' && (
            <div className="mr-[50px] tablet:mr-[100px] laptop:mr-[132px]">
              <TextareaAutosize
                tabIndex={2}
                id="input-1"
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                // onChange={(e) => {
                //   let userValue = e.target.value;

                //   if (youtubeBaseURLs.some((baseURL) => getMediaStates.url.includes(baseURL))) {
                //     // let videoId = userValue.match(
                //     //   /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/,
                //     // )[1];
                //     // console.log(videoId);
                //     const videoId = extractYouTubeVideoId(userValue);

                //     checkVideoAgeRestriction(videoId, userValue);
                //   } else {
                //     dispatch(createQuestAction.addMediaUrl(userValue));
                //   }
                // }}
                onChange={(e) => {
                  dispatch(createQuestAction.addMediaUrl(e.target.value));
                }}
                value={getMediaStates.url}
                placeholder="Paste embed link here....."
                className="w-full resize-none rounded-[5.128px] border border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-[10.3px] tablet:border-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
              />
            </div>
          )}
          {debouncedURL && (
            <div
              className="player-wrapper relative mt-1 cursor-pointer rounded-[10px] tablet:mt-[10px]"
              onClick={() => {
                dispatch(createQuestAction.addMediaUrl(''));
              }}
            >
              <div
                className={`absolute -right-1 -top-[6px] z-20 tablet:-right-4 tablet:-top-4 ${getMediaStates.url ? 'block' : 'hidden'}`}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                  alt="mediaCloseIcon"
                  className="size-[15px] tablet:size-[41px]"
                />
              </div>
              <ReactPlayer
                ref={playerRef}
                url={mediaURL}
                className="react-player"
                onError={(e) => {
                  toast.error('Invalid URL');
                  // toast.error('Invalid URL'), dispatch(createQuestAction.addMediaUrl(''));
                }}
                width="100%"
                height="100%"
                // single_active={true}
                controls={true} // Hide player controls
                muted={false} // Unmute audio
                playing={false} // Do not autoplay
                // loop={true} // Enable looping
                loop={!getMediaStates.url.includes(soundcloudUnique)}
                config={{
                  soundcloud: {
                    options: {
                      auto_play: false, // Disable auto play
                      hide_related: true, // Hide related tracks
                      show_comments: false, // Hide comments
                      show_user: false, // Hide user information
                      show_reposts: false, // Hide reposts
                      show_teaser: false, // Hide track teasers
                      visual: false, // Disable visual mode
                      show_playcount: false, // Hide play count
                      sharing: false, // Disable sharing
                      buying: false, // Disable buying options
                      download: false, // Disable download option
                    },
                  },
                  youtube: {
                    playerVars: {
                      modestbranding: 1, // Hide YouTube logo
                      showinfo: 0, // Hide video title and uploader info
                      autoplay: 0, // Disable autoplay
                      loop: 1, // Enable looping
                    },
                  },
                }}
                onEnded={handleVideoEnded}
              />

              {/* 
          https://soundcloud.com/mrjteze/huh
          https://soundcloud.com/mrjteze/huh?si=0f922f04744e4d74a0ed5ac4ae7fcb41&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing
          https://youtu.be/JaR7hhdBt-0?si=bTjEAhF9wxdQRCRc?rel=0
          https://www.youtube.com/embed/Xf0yP-kNyXQ
          https://youtube.com/embed/Xf0yP-kNyXQ?feature=shared
          https://youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/)[1]}
          https://youtu.be/JaR7hhdBt-0?si=bTjEAhF9wxdQRCRc?rel=0
          https://youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/)[1]}
          https://www.youtube.com/shorts/NCj-0-OK470
          https://www.youtube.com/shorts/9YYIPiYwvGY
          */}
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="addEmbeded"
          className="ml-[21.55px] mt-[16px] px-2 tablet:ml-[60px] tablet:mt-[33px] tablet:px-[25px]"
          onClick={() => {
            dispatch(createQuestAction.updateIsMedia(true));
          }}
        >
          + Add Media
        </Button>
      )}
    </div>
  );
}
