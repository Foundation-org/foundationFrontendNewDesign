import PropTypes from "prop-types";
import classNames from "classnames";

export const Button = ({ className, children, rounded, variant, ...props }) => (
  <button
    className={classNames(
      "cursor-pointer select-none rounded-[0.9375rem] shadow-md [outline:none] focus:ring-[1px] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-100 disabled:shadow-inner",
      rounded ? "rounded" : "",
      variant === "addOption"
        ? "flex h-[3.125rem] w-[11.125rem] items-center justify-center bg-[#D9D9D9] text-[1.25rem] font-normal text-[#435059]"
        : "",
      variant === "cancel"
        ? "flex h-[3.125rem] w-[10.8125rem] items-center justify-center bg-[#707175] text-[1.25rem] font-semibold text-white"
        : "",
      variant === "submit"
        ? "flex h-[3.125rem] w-[10.8125rem] items-center justify-center bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] text-[1.25rem] font-semibold text-white"
        : "",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

Button.defaultProps = {
  rounded: true,
  variant: "primary",
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  rounded: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(["addOption", "cancel", "submit"]),
};
