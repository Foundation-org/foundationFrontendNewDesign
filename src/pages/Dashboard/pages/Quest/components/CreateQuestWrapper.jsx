import React, { useRef, useEffect } from 'react';
import { Tooltip } from '../../../../../utils/Tooltip';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import ReactPlayer from 'react-player';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import { useState } from 'react';
import BasicModal from '../../../../../components/BasicModal';
import EmbedeDialogue from '../../../../../components/dialogue-boxes/EmbedeDialogue';
import { Button } from '../../../../../components/ui/Button';
import './Player.css';

export default function CreateQuestWrapper({ type, handleTab, msg, url, setUrl, setDescription, children }) {
  const dispatch = useDispatch();
  const [copyModal, setCopyModal] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [soundcloudUnique] = useState('soundcloud.com');
  const [youtubeBaseURLs] = useState(['youtube.com', 'youtube-nocookie.com', 'youtu.be']);

  const playerRef = useRef(null);
  const handleVideoEnded = () => {
    console.log('ended');
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.getInternalPlayer().play(); // Resume playback
    }
  };
  function checkVideoAgeRestriction(videoId, userValue) {
    const apiKey = import.meta.env.VITE_GG_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const contentRating = data.items[0]?.contentDetails?.contentRating?.ytRating;
        const isAdultContent = contentRating === 'ytAgeRestricted';
        // console.log('Is Adult Content:', isAdultContent);
        if (isAdultContent === false) {
          setUrl(userValue);
        } else {
          toast.error("It's an adult video");
          setUrl('');
        }
      })
      .catch((error) => console.error('Error:', error));
  }
  // https://www.youtube.com/watch?v=tWZMJoWb7ck
  const handleQuestionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 350) {
      dispatch(createQuestAction.addQuestion(inputValue));
    }
  };

  const questionVerification = async (value) => {
    if (createQuestSlice.validatedQuestion === value) return;
    dispatch(createQuestAction.checkQuestion(value));
  };

  const handleCopyOpen = () => {
    setCopyModal(true);
  };

  const handleCopyClose = () => setCopyModal(false);

  const customModalStyle = {
    backgroundColor: '#FCFCFD',
    boxShadow: 'none',
    border: '0px',
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  useEffect(() => {
    // Check if the URL is a SoundCloud playlist
    if (url.includes(soundcloudUnique) && url.includes('/sets/')) {
      toast.error('We do not support SoundCloud playlists');
      setUrl(''); // Set URL to empty string
      return; // Stop execution
    }

    // Check if the URL is a YouTube playlist
    if (youtubeBaseURLs.some((baseURL) => url.includes(baseURL)) && url.includes('list=')) {
      toast.error('We do not support YouTube playlists');
      setUrl(''); // Set URL to empty string
      return; // Stop execution
    }
  }, [url]);

  return (
    <>
      <BasicModal
        open={copyModal}
        handleClose={handleCopyClose}
        customStyle={customModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <EmbedeDialogue handleClose={handleCopyClose} setIsShowPreview={setIsShowPreview} url={url} setUrl={setUrl} />
      </BasicModal>

      <h4 className="mt-[10.5px] text-center text-[8px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25px] tablet:text-[16px]">
        {msg}
      </h4>
      <div
        className={`${
          persistedTheme === 'dark' ? 'border-[1px] border-[#858585] tablet:border-[2px]' : ''
        } mx-auto my-[10px] max-w-[85%] rounded-[8.006px] bg-white py-[8.75px] tablet:my-[15px] tablet:rounded-[26px] tablet:py-[27px] laptop:max-w-[1084px] laptop:pb-[30px] laptop:pt-[25px] dark:bg-[#141618]`}
      >
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[22.81px] laptop:text-[25px] dark:text-[#D8D8D8]">
          Create a {type}
        </h1>
        {/* {isShowPreview ? ( */}
        <div>
          <div className="w-[calc(100%-51.75px] mx-[22px] mt-1 flex flex-col gap-[6px] tablet:mx-[60px] tablet:mt-[25px] tablet:gap-[15px]">
            <TextareaAutosize
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please decribe this embeded video....."
              className="w-full resize-none rounded-[5.128px] border border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-[10.3px] tablet:border-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
            />
            <TextareaAutosize
              // onChange={(e) => setUrl(e.target.value)}
              onChange={(e) => {
                let userValue = e.target.value;
                console.log(userValue);
                if (youtubeBaseURLs.some((baseURL) => url.includes(baseURL))) {
                  let videoId = userValue.match(
                    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/,
                  )[1];
                  // console.log(videoId);
                  checkVideoAgeRestriction(videoId, userValue);
                } else {
                  setUrl(userValue);
                }
              }}
              placeholder="Paste embed link here....."
              className="w-full resize-none rounded-[5.128px] border border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-[10.3px] tablet:border-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
            />
          </div>

          <div
            className="player-wrapper relative mt-[6px] cursor-pointer tablet:mt-[15px]"
            onClick={() => {
              setUrl('');
            }}
          >
            <div
              className={`absolute -top-[5px] right-4 z-20 tablet:-top-4 tablet:right-[45px] ${url ? 'block' : 'hidden'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="41"
                viewBox="0 0 41 41"
                fill="none"
                className="size-[15px] tablet:size-[41px]"
              >
                <path
                  d="M35.6826 19.2751C35.6826 28.2373 28.4173 35.5026 19.455 35.5026C10.4928 35.5026 3.22746 28.2373 3.22746 19.2751C3.22746 10.3128 10.4928 3.04751 19.455 3.04751C28.4173 3.04751 35.6826 10.3128 35.6826 19.2751Z"
                  fill="white"
                />
                <path
                  d="M34.6479 33.8809C42.2729 25.8323 41.9295 13.1264 33.8809 5.50145C25.8323 -2.12352 13.1264 -1.78012 5.50145 6.26845C-2.12352 14.317 -1.78012 27.0229 6.26845 34.6479C14.317 42.2729 27.0229 41.9295 34.6479 33.8809ZM13.8838 16.1848C13.3089 15.6402 13.2844 14.7326 13.829 14.1577C14.3736 13.5828 15.2812 13.5583 15.8561 14.1029L20.0199 18.0476L23.9645 13.8838C24.5092 13.3089 25.4167 13.2844 25.9916 13.829C26.5665 14.3736 26.591 15.2812 26.0464 15.8561L22.1018 20.0199L26.2655 23.9645C26.8404 24.5092 26.865 25.4167 26.3203 25.9916C25.7757 26.5665 24.8681 26.591 24.2932 26.0464L20.1295 22.1018L16.1848 26.2655C15.6402 26.8404 14.7326 26.865 14.1577 26.3203C13.5828 25.7757 13.5583 24.8681 14.1029 24.2932L18.0476 20.1295L13.8838 16.1848Z"
                  fill="#7C7C7C"
                />
              </svg>
            </div>
            {/* <ReactPlayer
              url={url}
              className="react-player"
              onError={(e) => {
                toast.error("Invalid URL"), setUrl("")
              }}
              width="100%"
              height="100%"
              // single_active={true}
              controls={true} // Hide player controls
              muted={false} // Unmute audio
              playing={false} // Do not autoplay
              // loop={true} // Enable looping
              loop={!url.includes(soundcloudUnique)}
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
                    download: false // Disable download option
                  }
                },
                youtube: {
                  playerVars: {
                    modestbranding: 1, // Hide YouTube logo
                    showinfo: 0, // Hide video title and uploader info
                    autoplay: 0, // Disable autoplay
                    loop: 1 // Enable looping
                  }
                }
              }}
              onEnded={handleVideoEnded}
            // onReady={(player) => {
            //   // Check if the URL is a SoundCloud playlist
            //   if (url.includes(soundcloudUnique) && url.includes("/sets/")) {
            //     toast.error("We do not support SoundCloud playlists");
            //     setUrl(""); // Set URL to empty string
            //     return; // Stop execution
            //   }
            //   // Check if the URL is a YouTube playlist
            //   if (youtubeBaseURLs.some(baseURL => url.includes(baseURL)) && url.includes("list=")) {
            //     toast.error("We do not support YouTube playlists");
            //     setUrl(""); // Set URL to empty string
            //     return; // Stop execution
            //   }
            // }}
            />

            {/* 
            https://soundcloud.com/mrjteze/huh
            https://youtu.be/JaR7hhdBt-0?si=bTjEAhF9wxdQRCRc?rel=0
            https://soundcloud.com/mrjteze/huh?si=0f922f04744e4d74a0ed5ac4ae7fcb41&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing
            https://www.youtube.com/embed/Xf0yP-kNyXQ
            https://youtube.com/embed/Xf0yP-kNyXQ?feature=shared
            https://youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/)[1]}
            https://youtu.be/JaR7hhdBt-0?si=bTjEAhF9wxdQRCRc?rel=0
            https://soundcloud.com/mrjteze/huh?si=0f922f04744e4d74a0ed5ac4ae7fcb41&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing
            https://soundcloud.com/mrjteze/huh 
            https://youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/)[1]} */}
          </div>
        </div>
        {/* ) : (
          <Button
            variant="addEmbeded"
            className="ml-[21.55px] mt-[16px] tablet:ml-[60px] tablet:mt-[33px]"
            onClick={handleCopyOpen}
          >
            + Add Embeded Link
          </Button>
        )} */}
        <div className="w-[calc(100%-51.75px] mx-[22px] mt-[6px] flex tablet:mx-[60px] tablet:mt-[15px] tablet:pb-[13px]">
          <TextareaAutosize
            id="input-0"
            aria-label="multiple choice question"
            onChange={handleQuestionChange}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={createQuestSlice.question}
            placeholder="Pose a question"
            tabIndex={1}
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
          />
          <button
            id="new"
            className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${questionStatus.color}`}
          >
            <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
              {createQuestSlice.questionTyping ? `${createQuestSlice.question.length}/350` : questionStatus.name}
            </div>
            <Tooltip optionStatus={questionStatus} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
