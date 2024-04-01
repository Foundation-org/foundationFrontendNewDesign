import React from 'react';
import ReactPlayer from 'react-player';

export const EmbededVideo = ({ description, url }) => {
  return (
    <div className="align-items mx-[22px] mb-2 flex flex-col justify-start rounded-[9.183px] border border-[#DEE6F7] px-[1px] py-2 tablet:mx-[60px] tablet:mb-[14px] tablet:border-[2.755px] tablet:px-2">
      <h2 className="mb-1 ml-[9px] text-[8px] font-medium text-[#7C7C7C] tablet:text-[14.692px]">{description}</h2>
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
