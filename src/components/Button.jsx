import classNames from "classnames";

const Button = ({
  children,
  type = "button",
  size = "medium",
  color = "primary",
  group = "",
  disabled = false,
  onClick,
}) => {
  const buttonClasses = classNames(
    "inline-flex justify-center items-center py-0 rounded-[6.043px] 2xl:rounded-[11.703px]",
    {
      "bg-dark-blue text-white": color === "blue",
      "bg-white dark:bg-dark-gray text-black dark:text-white": color === "gray",
      "bg-white dark:bg-gray-500 text-black dark:text-white":
        color === "darkgray",
      "bg-blue-200 dark:bg-[#2759A5]": color === "blue-200",
      "text-primary bg-white hover:bg-gray-200 border-[1px] border-gray-300":
        color === "light",
      "disabled:bg-gray-300 disabled:cursor-not-allowed": disabled,
    },
    {
      "text-[13px] font-[500] px-[10px] h-[30px] gap-[15px]": size === "small",
      "px-2 text-[8.951px] md:text-[17.554px] font-[500] text-center h-[34.3px] taller:h-[52px] md:h-[67.2px] w-fit border-[1px] border-gray-200 dark:border-white whitespace-nowrap":
        size === "medium",
      "taller:text-[20px] taller:h-[44px] text-[14.91px] md:text-[29.257px] font-[500] text-center py-3 h-[33.23px] md:h-[67.2px] w-full":
        size === "large",
    },
    {
      "rounded-r-none": group === "left",
      "rounded-none": group === "middle",
      "rounded-l-none": group === "right",
    },
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
