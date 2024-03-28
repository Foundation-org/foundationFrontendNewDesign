import React from 'react';
import ReactPlayer from 'react-player';

export const EmbededVideo = ({ description, url }) => {
  return (
    <div className="align-items mx-[22px] flex flex-col justify-start border border-[#DEE6F7] tablet:mx-[60px]">
      <div>{description}</div>
      <div className="feed-player-wrapper">
        <ReactPlayer
          url={url}
          className="feed-react-player"
          playing
          width="100%"
          height="100%"
          controls={true}
          muted={true}
        />
      </div>
    </div>
  );
};
