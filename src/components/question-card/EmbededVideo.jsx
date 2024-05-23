// import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
// import ReactPlayer from 'react-player/lazy';
// import { soundcloudUnique, youtubeBaseURLs } from '../../constants/addMedia';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';
import * as questUtilsActions from '../../features/quest/utilsSlice';

import { suppressPost } from '../../services/api/questsApi';
import YouTubePlayer from './YoutubePlayer';
import SoundcloudWidget from './SoundcloudWidget';

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
  const [mediaURL, setMediaURL] = useState(url[0]);
  const dispatch = useDispatch();
  const questUtilsState = useSelector(getQuestUtils);

  // const handleVideoEnded = () => {
  //   if (questUtilsState.loop === true) {
  //     if (playerRef.current) {
  //       playerRef.current.seekTo(0);
  //       playerRef.current.getInternalPlayer().play(); // Resume playback
  //     }
  //   } else {
  //     const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
  //     if (index !== -1 && index + 1 < questUtilsState.playingIds.length) {
  //       dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index + 1]));
  //     } else if (
  //       index !== -1 &&
  //       index + 1 >= questUtilsState.playingIds.length &&
  //       questUtilsState.hasNextPage === false
  //     ) {
  //       dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[0]));
  //     }
  //   }
  // };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 744) {
        setMediaURL(`${url[0]}&show_artwork=false`);
      } else {
        setMediaURL(url[0]);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [url[0]]);

  function getYouTubeId(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function identifyMediaUrl(url) {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const soundcloudRegex = /soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/;

    if (youtubeRegex.test(url)) {
      return 'YouTube';
    } else if (soundcloudRegex.test(url)) {
      return 'SoundCloud';
    } else {
      return 'Unknown';
    }
  }

  return (
    // <div className="mx-[22px] mb-2 mt-[12px] flex flex-col justify-start rounded-[9.183px] border border-[#DEE6F7] px-[5px] py-2 tablet:mx-[60px] tablet:mb-[0px] tablet:mt-[23px] tablet:border-[2.755px] tablet:px-2">
    <div className="flex flex-col justify-start pb-2 pt-1 tablet:py-2">
      <h2 className="mb-1 ml-2 text-[8px] font-medium text-[#7C7C7C] tablet:mb-2 tablet:ml-3 tablet:text-[14.692px]">
        {description}
      </h2>
      {/* <div>
        <ReactPlayer
          ref={playerRef}
          url={mediaURL}
          className="react-player"
          onError={(e) => {
            console.log('hamza', e);
            // toast.error('Invalid URL');
            console.log('Invalid URl', questId);
            // suppressPost(questId);
          }}
          onStart={() => {
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
          // loop={!url.includes(soundcloudUnique)}
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
                // loop: 1, // Enable looping
              },
            },
          }}
          onEnded={() => handleVideoEnded()}
        />
      </div> */}
      {identifyMediaUrl(url[0]) === 'YouTube' && (
        <YouTubePlayer
          YTid={getYouTubeId(url[0])}
          playing={playing}
          questId={questId}
          // handleVideoEnded={handleVideoEnded}
        />
      )}
      {identifyMediaUrl(url[0]) === 'SoundCloud' && (
        <SoundcloudWidget SCurl={mediaURL} playing={playing} questId={questId} />
      )}
    </div>
  );
};
