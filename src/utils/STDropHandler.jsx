import { useSelector } from "react-redux";

export const STDropHandler = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  return (
    <div
      {...props}
      className="left-[6rem] z-10 flex h-full w-fit items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]"
      style={{ position: "absolute" }}
    >
      {persistedTheme === "dark" ? (
        <img src="/assets/svgs/dashboard/six-dots-dark.svg" alt="six dots" />
      ) : (
        <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
      )}
    </div>
  );
};
