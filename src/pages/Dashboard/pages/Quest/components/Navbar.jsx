const Navbar = ({ handleTab, tab }) => {
  return (
    <div className="flex justify-center gap-[15.44px] tablet:gap-[32px] laptop:gap-[50px]">
      <button
        className={`${
          tab === 0
            ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
            : "bg-[#E6E6E6] text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
        } quest-topbar`}
        onClick={() => {
          handleTab(0);
        }}
      >
        Rank Choice
      </button>
      <button
        className={`${
          tab === 1
            ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
            : "bg-[#E6E6E6] text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
        } quest-topbar`}
        onClick={() => {
          handleTab(1);
        }}
      >
        Multiple choice
      </button>
      <button
        className={`${
          tab === 2
            ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
            : "bg-[#E6E6E6] text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
        } quest-topbar`}
        onClick={() => {
          handleTab(2);
        }}
      >
        Agree/Disagree
      </button>
      <button
        className={`${
          tab === 3
            ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
            : "bg-[#E6E6E6] text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
        } quest-topbar`}
        onClick={() => {
          handleTab(3);
        }}
      >
        Yes/No
      </button>
      <button
        className={`${
          tab === 4
            ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
            : "bg-[#E6E6E6] text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
        } quest-topbar`}
        onClick={() => {
          handleTab(4);
        }}
      >
        Like/Dislike
      </button>
    </div>
  );
};

export default Navbar;
