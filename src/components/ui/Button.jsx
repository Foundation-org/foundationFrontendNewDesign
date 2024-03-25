import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Button = ({ className, children, rounded, variant, ...props }) => (
  <button
    className={classNames(
      'flex cursor-pointer select-none items-center justify-center rounded-[0.28688rem] [outline:none] disabled:cursor-not-allowed tablet:rounded-[0.9375rem]',
      rounded ? 'rounded' : '',
      variant === 'addOption'
        ? 'addoption-boxShadow h-[1.375rem] w-[5.1rem] max-w-[10.8125rem] gap-[0.27rem] bg-[#D9D9D9] text-[0.625rem] font-normal text-[#435059]  tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'addOption'
        ? 'addoption-boxShadow h-[1.375rem] w-fit gap-[0.27rem] bg-[#D9D9D9] p-2 text-[0.625rem] font-normal text-[#435059] tablet:h-[3.125rem] tablet:text-[1.25rem]'
        : '',
      variant === 'cancel'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] bg-[#707175] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'submit'
        ? 'addoption-boxShadow h-[1.375rem] min-w-[4.875rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:min-w-[10.8125rem] tablet:text-[1.25rem] laptop:px-[17px] '
        : '',
      variant === 'hollow-submit'
        ? 'h-[1.375rem] w-fit rounded-[7.28px] border-[1.428px] border-[#389CE3] bg-gradient-to-tr px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-[#389CE3] tablet:h-[3.125rem] tablet:rounded-[15.2px] tablet:border-[3px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] tablet:leading-none laptop:rounded-[12px] laptop:px-[60px] laptop:py-3 laptop:text-[25px]'
        : '',
      variant === 'submit-welcome'
        ? 'addoption-boxShadow min-w-[4.875rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[6.63px] py-[9px] text-[12px] font-semibold leading-[14.562px] text-white tablet:min-w-[10.8125rem] tablet:rounded-[11.7px] tablet:py-4 tablet:text-[30px] tablet:font-semibold tablet:leading-[36px] laptop:px-[17px] '
        : '',
      variant === 'hollow-welcome'
        ? 'rounded-[7.28px] border-2 border-[#4A8DBD] bg-gradient-to-tr px-[24.5px] py-[7px] text-[12px] font-semibold leading-[14.562px] text-[#4A8DBD] tablet:rounded-[15.2px] tablet:border-[3px] tablet:px-[15.26px] tablet:py-[13px] tablet:text-[30px] tablet:font-semibold tablet:leading-[36px]'
        : '',
      variant === 'change'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] bg-[#FDD503]  text-[0.625rem] font-semibold text-white disabled:border-[1.428px] disabled:border-[#FDD503] disabled:bg-transparent disabled:text-[#FDD503] tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem] disabled:dark:text-[#FDD503]'
        : '',
      variant === 'change-outline'
        ? 'h-[1.375rem] w-[4.875rem] border-[1.428px] border-[#FDD503] text-[0.625rem] font-semibold text-[#FDD503] disabled:bg-transparent disabled:text-[#FDD503] tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:border-[3px] tablet:text-[1.25rem] disabled:dark:text-[#FDD503]'
        : '',
      variant === 'result'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] bg-[#0FB063]  text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem]'
        : '',
      variant === 'result-outline'
        ? 'h-[1.375rem] w-[4.875rem] border-[1.428px] border-[#20D47E] text-[0.625rem] font-semibold text-[#0FB063] tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:border-[3px] tablet:text-[1.25rem]'
        : '',
      variant === 'start'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'personal-work'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] bg-[#4A8DBD] text-[0.625rem] font-medium text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[20px] laptop:w-[12vw]'
        : '',
      variant === 'social-btn'
        ? 'h-[36px] w-fit whitespace-nowrap border-[1px] border-gray-200 bg-white px-2 text-center text-[2.5vw] font-[500] text-black sm:h-[50px] sm:text-[2.3vw] lg:h-[60px] lg:text-[1vw] tablet:h-[3.125rem] dark:border-white dark:bg-dark-gray dark:text-white'
        : '',
      variant === 'getintouch'
        ? 'addoption-boxShadow h-[1.375rem] text-nowrap rounded-[2.1px] bg-[#4A8DBD] px-3 text-[10px] font-semibold text-white tablet:h-[3.125rem] tablet:text-[1.25rem]'
        : '',
      variant === 'danger'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] bg-[#DC1010] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'submit-green'
        ? 'addoption-boxShadow h-[1.375rem] min-w-[4.875rem] bg-[#0FB063] px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:min-w-[10.8125rem] tablet:text-[1.25rem] laptop:px-[17px] '
        : '',
      variant === 'topics'
        ? 'whitespace-nowrap px-[4.9px] py-[6.5px] text-[0.57944rem] font-semibold focus:outline-none focus:ring-0 tablet:px-[12px] tablet:py-[12px] tablet:text-[20px] tablet:leading-[24px]'
        : '',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

Button.defaultProps = {
  rounded: true,
  variant: 'primary',
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  rounded: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf([
    'addOption',
    'cancel',
    'submit',
    'change',
    'change-outline',
    'result',
    'result-outline',
    'start',
    'personal-work',
    'social-btn',
    'hollow-submit',
    'getintouch',
    'danger',
    'submit-green',
    'topics',
  ]),
};
