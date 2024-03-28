import React from 'react';
import ReactPlayer from 'react-player';

export const EmbededVideo = ({ description, url }) => {
  return (
    <div className="align-items border-red w-90% flex flex-col justify-start border-[1px] border-solid">
      <div>{description}</div>
      <div className="player-wrapper">
        <ReactPlayer
          url={url}
          className="react-player"
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
