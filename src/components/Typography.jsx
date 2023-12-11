import classNames from "classnames";

const Typography = ({
  children,
  variant = "textBase",
  color = "",
  align = "left",
  className,
}) => {
  const variants = {
    textTitle:
      "tall:text-[32px] text-[20.396px] md:text-[40px] 5xl:text-[52px] font-[700] text-black dark:text-white",
    "textTitle-2":
      "text-[21.023px] md:text-[40px] 5xl:text-[52px] font-[700] text-[#344054] dark:text-white",
    textInfo:
      "short:text-[16px] tall:text-[20px] text-[13.426px] md:text-[26.331px] 5xl:text-[30px] font-normal tacking-[2.633px] text-gray-300 dark:text-white",
    textBase: "text-[11.21px] md:text-[22px] font-[500]",
    textSmall:
      "text-[10.512px] md:text-[20px] font-[400] leading-[34.49px] text-[#667085] dark:text-white",
    p: "text-[10.575px] md:text-[20.12px] font-[500] leading-[28.743px] text-gray-400 dark:text-white leading-none",
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
    className,
  );

  return <p className={classes}>{children}</p>;
};

export default Typography;
