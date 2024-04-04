import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

export const EmbededVideo = ({ description, url }) => {
  const playerRef = useRef(null);
  const [soundcloudUnique] = useState('soundcloud.com');

  const handleVideoEnded = () => {
    console.log('ended');
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.getInternalPlayer().play(); // Resume playback
    }
  };

  return (
    <div className="align-items mx-[22px] mb-2 flex flex-col justify-start rounded-[9.183px] border border-[#DEE6F7] px-[1px] py-2 tablet:mx-[60px] tablet:mb-[14px] tablet:border-[2.755px] tablet:px-2">
      <h2 className="mb-1 ml-[9px] text-[8px] font-medium text-[#7C7C7C] tablet:text-[14.692px]">{description}</h2>
      <div className="feed-player-wrapper">
        {/* <ReactPlayer
          url={url}
          className="feed-react-player"
          playing
          width="100%"
          height="100%"
          controls={true}
          muted={true}
        /> */}
        <ReactPlayer
          ref={playerRef}
          url={url}
          className="react-player"
          onError={(e) => {
            toast.error('Invalid URL');
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