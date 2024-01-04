import classNames from "classnames";

const Button = ({ children, type = "button", color, onClick }) => {
  const buttonClasses = classNames(
    "w-[19.9vw] h-[5.8vw] rounded-[1.31vw] text-[1.73vw] font-semibold leading-normal tablet:mr-[18.5px]",
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
