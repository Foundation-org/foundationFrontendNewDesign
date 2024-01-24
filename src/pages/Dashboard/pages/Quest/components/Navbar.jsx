const Navbar = ({ handleTab, tab }) => {
  return (
    <div className="flex justify-center gap-[6.7px] tablet:gap-4 laptop:gap-[30px]">
      <div>
        <div className="create-quest-box-shadow flex h-5 justify-center rounded-[3.82px] bg-[#FCFCFC] dark:bg-[#242424] tablet:h-12 tablet:rounded-xl laptop:h-[60px]">
          <p className="-mt-[6px] h-fit w-fit bg-[#F3F3F3] text-[10px] font-semibold leading-none text-[#7C7C7C] tablet:-mt-[10px] tablet:text-[16px] laptop:-mt-[15px] laptop:text-[25px]">
            Polls
          </p>
        </div>
        <div className="mx-[3px] -mt-[11px] flex gap-[6.45px] tablet:mx-[25px] tablet:-mt-[30px] tablet:gap-4 laptop:gap-[25px]">
          <button
            className={`${
              tab === 3
                ? 'bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]'
                : 'border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]'
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
                ? 'bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]'
                : 'border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]'
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
                ? 'bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]'
                : 'border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]'
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
        <div className="create-quest-box-shadow flex h-5 justify-center rounded-[3.82px] bg-[#FCFCFC] dark:bg-[#242424] tablet:h-12 tablet:rounded-xl laptop:h-[60px]">
          <p className="-mt-[6px] h-fit w-fit bg-[#F3F3F3] text-[10px] font-semibold leading-none text-[#7C7C7C] tablet:-mt-[10px] tablet:text-[16px] laptop:-mt-[15px] laptop:text-[25px]">
            Statements
          </p>
        </div>
        <div className="mx-[3px]  -mt-[11px] flex gap-[6.45px] tablet:mx-[25px] tablet:-mt-[30px] tablet:gap-4 laptop:gap-[25px]">
          <button
            className={`${
              tab === 2
                ? 'bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]'
                : 'border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]'
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
                ? 'bg-[#459EDE] text-white dark:bg-[#252D37] dark:text-[#DDD]'
                : 'border-[#BABABA] bg-white text-[#ACACAC] dark:bg-[#212428] dark:text-[#7F8184]'
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
