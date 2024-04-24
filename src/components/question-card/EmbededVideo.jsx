// import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { soundcloudUnique, youtubeBaseURLs } from '../../constants/addMedia';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';

export const EmbededVideo = ({
  description,
  url,
  questId,
  // setPlayingPlayerId,
  playing,
  // setIsShowPlayer,
  // setIsPlaying,
  // isPlaying,
}) => {
  const playerRef = useRef(null);
  const [mediaURL, setMediaURL] = useState(url);
  const dispatch = useDispatch();
  const questUtilsState = useSelector(getQuestUtils);

  const handleVideoEnded = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.getInternalPlayer().play(); // Resume playback
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 744) {
        // Hide artwork for screens smaller than 400px
        setMediaURL(`${url}&show_artwork=false`);
      } else {
        // Show artwork for larger screens
        setMediaURL(url);
      }
    };

    // Initial call
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [url]);

  return (
    <div className="mx-[22px] mb-2 mt-[12px] flex flex-col justify-start rounded-[9.183px] border border-[#DEE6F7] px-[5px] py-2 tablet:mx-[60px] tablet:mb-[0px] tablet:mt-[23px] tablet:border-[2.755px] tablet:px-2">
      <h2 className="mb-1 text-[8px] font-medium text-[#7C7C7C] tablet:text-[14.692px]">{description}</h2>
      <div>
        <ReactPlayer
          ref={playerRef}
          url={mediaURL}
          className="react-player"
          onError={(e) => {
            // toast.error('Invalid URL');
            console.log('Invalid URl', e);
          }}
          onStart={() => {
            console.log('selectedQuestId', questId);
            dispatch(setPlayingPlayerId(questId));
            // setPlayingPlayerId(questId);
            if (!playing) {
              dispatch(toggleMedia(true));
              // setIsPlaying(true);
            }
            dispatch(setIsShowPlayer(true));
            // setIsShowPlayer(true);
          }}
          onPlay={() => {
            dispatch(setPlayingPlayerId(questId));
            // setPlayingPlayerId(questId);
            if (!playing) {
              // setIsPlaying(true);
              dispatch(toggleMedia(true));
            }
            dispatch(setIsShowPlayer(true));
            // setIsShowPlayer(true);
          }}
          width="100%"
          height="100%"
          onPause={() => {
            if (playing) {
              // setIsPlaying(false);
              dispatch(toggleMedia(false));
            }
          }}
          // single_active={true}
          controls={true} // Hide player controls
          muted={false} // Unmute audio
          playing={playing} // Do not autoplay
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
      </div>
    </div>
  );
};

// className={`align-items mx-[22px] mb-2 mt-[12px] flex flex-col justify-start rounded-[9.183px] border border-[#DEE6F7] px-[5px] py-2 tablet:mx-[60px] tablet:mb-[0px] tablet:mt-[23px] tablet:border-[2.755px] tablet:px-2 ${
//   url
//     ? youtubeBaseURLs.some((baseURL) => url.includes(baseURL))
//       ? 'h-[169px] tablet:h-[420px]'
//       : url.includes(soundcloudUnique)
//         ? 'h-[162px] tablet:h-[226px]'
//         : ''
//     : ''
// }`}
