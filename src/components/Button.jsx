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
    "inline-flex justify-center items-center py-0 rounded-[11.703px]",
    {
      "bg-dark-blue dark:text-white text-black": color === "blue",
      "bg-white dark:bg-dark-gray text-black dark:text-white": color === "gray",
      "text-primary bg-white hover:bg-gray-200 border-[1px] border-gray-300":
        color === "light",
      "disabled:bg-gray-300 disabled:cursor-not-allowed": disabled,
    },
    {
      "text-[13px] font-[500] px-[10px] h-[30px] gap-[15px]": size === "small",
      "text-[17.554px] font-[500] text-center h-[67.2px] w-[280px] border-[1px] border-gray-200 dark:border-white":
        size === "medium",
      "text-[29.257px] font-[700] text-center py-3 h-[67.2px] w-full":
        size === "large",
    },
    {
      "rounded-r-none": group === "left",
      "rounded-none": group === "middle",
      "rounded-l-none": group === "right",
    }
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
