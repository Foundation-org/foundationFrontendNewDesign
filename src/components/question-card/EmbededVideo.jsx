import React from 'react';
import ReactPlayer from 'react-player';

export const EmbededVideo = ({ description, url }) => {
  return (
    <div>
      <div>{description}</div>
      <ReactPlayer url={url} />
    </div>
  );
};
