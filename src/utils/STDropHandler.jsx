import { useSelector } from "react-redux";

export const STDropHandler = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  return (
    <div
      {...props}
      className="left-8 z-10 flex h-[21px] w-fit items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[3.3px] pb-[6.6px] pt-[6.15px] dark:bg-[#9E9E9E] tablet:left-12 tablet:h-full tablet:px-[7px] tablet:pb-[13px] tablet:pt-[14px]"
      style={{ position: "absolute" }}
    >
      {persistedTheme === "dark" ? (
        <img
          src="/assets/svgs/dashboard/six-dots-dark.svg"
          alt="six dots"
          className="h-[8.5px] w-[5.2px] tablet:h-auto tablet:w-auto"
        />
      ) : (
        <img
          src="/assets/svgs/dashboard/six-dots.svg"
          alt="six dots"
          className="h-[8.5px] w-[5.2px] tablet:h-auto tablet:w-auto"
        />
      )}
    </div>
  );
};
