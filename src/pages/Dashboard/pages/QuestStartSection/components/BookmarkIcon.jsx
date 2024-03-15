import React from 'react';

const BookmarkIcon = ({ bookmarkStatus, persistedTheme, handleBookmark }) => {
  const getBookmarkIcon = () => {
    if (bookmarkStatus) {
      if (persistedTheme !== 'dark') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/bookmark.png`;
      } else {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/darkbookmark.png`;
      }
    } else {
      return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/disablebookmark.png`;
    }
  };

  return (
    <div onClick={() => handleBookmark()}>
      <img
        src={getBookmarkIcon()}
        alt="save icon"
        className="h-[15.147px] w-[11.016px] cursor-pointer tablet:h-[30px] tablet:w-[21.818px] laptop:h-[25px] laptop:w-[18.182px]"
      />
    </div>
  );
};

export default BookmarkIcon;
