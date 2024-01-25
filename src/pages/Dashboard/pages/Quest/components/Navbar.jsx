import { useSelector } from 'react-redux';

const Navbar = ({ handleTab, tab }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="flex justify-center gap-[6.7px] tablet:gap-4 laptop:gap-[30px]">
      <div>
        <div
          className={`flex h-5 justify-center rounded-[3.82px] bg-transparent dark:bg-[#242424] tablet:h-12 tablet:rounded-xl laptop:h-[60px] ${
            persistedTheme === 'dark'
              ? 'dark-create-quest-box-shadow border tablet:border-[3px] border-[#FBFBFB]'
              : 'create-quest-box-shadow'
          }`}
        >
          <p className="-mt-[6px] px-1 h-fit w-fit bg-[#F3F3F3] dark:bg-[#242424] text-[10px] font-semibold leading-none text-[#7C7C7C] dark:text-white tablet:-mt-[10px] tablet:text-[16px] laptop:-mt-[15px] laptop:text-[25px]">
            Polls
          </p>
        </div>
        <div className="mx-[3px] -mt-[11px] flex gap-[6.45px] tablet:mx-[25px] tablet:-mt-[30px] tablet:gap-4 laptop:gap-[25px]">
          <button
            className={`${
              tab === 0
                ? 'bg-[#459EDE] text-white dark:bg-white dark:text-black'
                : 'border-[#BABABA] dark:border-[#5F5F5F] bg-white text-[#ACACAC] dark:bg-[#5F5F5F] dark:text-[#D9D9D9]'
            } quest-topbar`}
            onClick={() => {
              handleTab(0);
            }}
          >
            Yes/No
          </button>
          <button
            className={`${
              tab === 1
                ? 'bg-[#459EDE] text-white dark:bg-white dark:text-black'
                : 'border-[#BABABA] dark:border-[#5F5F5F] bg-white text-[#ACACAC] dark:bg-[#5F5F5F] dark:text-[#D9D9D9]'
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
                ? 'bg-[#459EDE] text-white dark:bg-white dark:text-black'
                : 'border-[#BABABA] dark:border-[#5F5F5F] bg-white text-[#ACACAC] dark:bg-[#5F5F5F] dark:text-[#D9D9D9]'
            } quest-topbar`}
            onClick={() => {
              handleTab(2);
            }}
          >
            Rank Choice
          </button>
        </div>
      </div>

      <div>
        <div
          className={`flex h-5 justify-center rounded-[3.82px] bg-transparent dark:bg-[#242424] tablet:h-12 tablet:rounded-xl laptop:h-[60px] ${
            persistedTheme === 'dark'
              ? 'dark-create-quest-box-shadow border tablet:border-[3px] border-[#FBFBFB]'
              : 'create-quest-box-shadow'
          }`}
        >
          <p className="-mt-[6px] px-1 h-fit w-fit bg-[#F3F3F3] dark:bg-[#242424] text-[10px] font-semibold leading-none text-[#7C7C7C] dark:text-white tablet:-mt-[10px] tablet:text-[16px] laptop:-mt-[15px] laptop:text-[25px]">
            Statements
          </p>
        </div>
        <div className="mx-[3px]  -mt-[11px] flex gap-[6.45px] tablet:mx-[25px] tablet:-mt-[30px] tablet:gap-4 laptop:gap-[25px]">
          <button
            className={`${
              tab === 3
                ? 'bg-[#459EDE] text-white dark:bg-white dark:text-black'
                : 'border-[#BABABA] dark:border-[#5F5F5F] bg-white text-[#ACACAC] dark:bg-[#5F5F5F] dark:text-[#D9D9D9]'
            } quest-topbar`}
            onClick={() => {
              handleTab(3);
            }}
          >
            Agree/Disagree
          </button>
          <button
            className={`${
              tab === 4
                ? 'bg-[#459EDE] text-white dark:bg-white dark:text-black'
                : 'border-[#BABABA] dark:border-[#5F5F5F] bg-white text-[#ACACAC] dark:bg-[#5F5F5F] dark:text-[#D9D9D9]'
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
