import classNames from "classnames";

const Typography = ({
  children,
  variant = "textBase",
  color = "",
  align = "left",
  className,
}) => {
  const variants = {
    textTitle: "text-[40px] font-[700] text-black dark:text-white",
    "textTitle-2": "text-[40px] font-[700] text-[#344054] dark:text-white",
    textInfo:
      "text-[26.331px] font-normal tacking-[2.633px] text-gray-300 dark:text-white",
    textBase: "text-[22px] font-[500]",
    textSmall:
      "text-[20px] font-[400] leading-[34.49px] text-[#667085] dark:text-white",
    p: "text-[20.12px] font-[500] leading-[28.743px] text-gray-400 dark:text-white",
    h1: "text-[48px] font-semibold -tracking-[1.6px] text-dark",
    h2: "text-[32px] font-semibold -tracking-[0.2px] text-dark",
    h3: "text-[24px] font-semibold -tracking-[0.2px] leading-[32px] text-dark",
    h4: "text-[20px] font-semibold -tracking-[0.2px] leading-[28px] text-dark",
    h5: "text-[18px] font-semibold text-dark",
    h6: "text-[16px] font-semibold text-dark",
    textBtn: "text-[12px] font-normal text-gray-600",
  };

  const classes = classNames(
    variants[variant],
    color,
    {
      "text-left": align === "left",
      "text-center": align === "center",
      "text-right": align === "right",
    },
    className
  );

  return <p className={classes}>{children}</p>;
};

export default Typography;
