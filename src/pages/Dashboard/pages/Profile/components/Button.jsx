import classNames from "classnames";

const Button = ({ children, type = "button", color = "gray", onClick }) => {
  const buttonClasses = classNames(
    "py-[5.58px] tablet:text-[17.7px] tablet:py-[11.63px] 2xl:py-[21px] tablet:px-6 px-[11.9px] laptop:px-[45px] text-[8.4px] laptop:text-[20px] 2xl:text-[32px] font-semibold leading-normal tablet:mr-[18.5px]",
    {
      "border-[1.32px] tablet:border-[5px] border-[#949494] text-[#949494] rounded-[6px] tablet:rounded-[12.6px] laptop:rounded-[23px]":
        color === "gray",
      "border-[1px] border-[#BABABA] text-[#949494] dark-bg-[#252D37] bg-[#fff] rounded-[23px]":
        color === "gray-light",
      "bg-[#FF4057] dark:bg-[#C13232] text-white rounded-[6px] tablet:rounded-[12.6px] laptop:rounded-[23px]":
        color === "red",
      "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] dark:bg-[#252D37] dark:from-[#252D37] dark:to-[#252D37] text-white rounded-[6px] tablet:rounded-[12.6px] laptop:rounded-[23px]":
        color === "blue",
    },
  );

  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
