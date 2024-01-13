import PropTypes from "prop-types";
import classNames from "classnames";

export const Button = ({ className, children, rounded, variant, ...props }) => (
  <button
    className={classNames(
      "cursor-pointer select-none rounded-[0.28688rem] shadow-md [outline:none] focus:ring-[1px] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-100 disabled:shadow-inner tablet:rounded-[0.9375rem]",
      rounded ? "rounded" : "",
      variant === "addOption"
        ? "flex h-[1.43rem] w-[5.1rem] items-center justify-center bg-[#D9D9D9] text-[0.625rem] font-normal text-[#435059] tablet:h-[3.125rem] tablet:w-[11.125rem] tablet:text-[1.25rem]"
        : "",
      variant === "cancel"
        ? "flex h-[1.375rem] w-[4.875rem] items-center justify-center bg-[#707175] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem]"
        : "",
      variant === "submit"
        ? "flex h-[1.375rem] w-[4.875rem]  items-center justify-center bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem]"
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
