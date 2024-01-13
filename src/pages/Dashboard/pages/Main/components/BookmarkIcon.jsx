import React from "react";

const BookmarkIcon = ({ bookmarkStatus, persistedTheme, handleBookmark }) => {
  const getBookmarkIcon = () => {
    if (bookmarkStatus) {
      if (persistedTheme !== "dark") {
        return "/assets/bookmark/bookmark.png";
      } else {
        return "/assets/bookmark/darkbookmark.png";
      }
    } else {
      return "/assets/bookmark/disablebookmark.png";
    }
  };

  return (
    <div
      className="flex w-[45.7px] justify-end"
      onClick={() => handleBookmark()}
    >
      <img
        src={getBookmarkIcon()}
        alt="save icon"
        className="h-[17px] w-[12.7px] cursor-pointer tablet:h-8 tablet:w-6"
      />
    </div>
  );
};

export default BookmarkIcon;
