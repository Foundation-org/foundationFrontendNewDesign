const Navbar = ({ handleTab, tab }) => {
  return (
    <div className="flex justify-center gap-[15.44px] tablet:gap-[30px]">
      <div>
        <div className="create-quest-box-shadow flex h-[60px] justify-center rounded-xl bg-[#FCFCFC]">
          <p className="-mt-[15px] h-fit w-fit bg-[#F3F3F3] text-[25px] font-semibold leading-none text-[#7C7C7C]">
            Polls
          </p>
        </div>
        <div className="-m-[30px] mx-[25px] flex gap-[25px]">
          <button
            className={`${
              tab === 3
                ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
                : "border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
            } quest-topbar`}
            onClick={() => {
              handleTab(3);
            }}
          >
            Yes/No
          </button>
          <button
            className={`${
              tab === 1
                ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
                : "border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
            } quest-topbar`}
            onClick={() => {
              handleTab(1);
            }}
          >
            Multiple choice
          </button>
          <button
            className={`${
              tab === 0
                ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
                : "border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
            } quest-topbar`}
            onClick={() => {
              handleTab(0);
            }}
          >
            Rank Choice
          </button>
        </div>
      </div>

      <div>
        <div className="create-quest-box-shadow flex h-[60px] justify-center rounded-xl bg-[#FCFCFC]">
          <p className="-mt-[15px] h-fit w-fit bg-[#F3F3F3] text-[25px] font-semibold leading-none text-[#7C7C7C]">
            Statements
          </p>
        </div>
        <div className="-m-[30px] mx-[25px] flex gap-[25px]">
          <button
            className={`${
              tab === 2
                ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
                : "border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
            } quest-topbar`}
            onClick={() => {
              handleTab(2);
            }}
          >
            Agree/Disagree
          </button>
          <button
            className={`${
              tab === 4
                ? "bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]"
                : "border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]"
            } quest-topbar`}
            onClick={() => {
              handleTab(4);
            }}
          >
            Like/Dislike
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
