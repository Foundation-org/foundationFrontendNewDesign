import classNames from 'classnames';

const Button = ({ children, type = 'button', color = 'gray', onClick }) => {
  const buttonClasses = classNames(
    '2xl:py-[21px] px-[45px] text-[20px] 2xl:text-[32px] font-semibold leading-normal mr-[18.5px]',
    {
      'border-[5px] border-[#949494] text-[#949494] rounded-[23px]':
        color === 'gray',
      'border-[1px] border-[#BABABA] text-[#949494] bg-[#fff] rounded-[23px]':
        color === 'gray-light',
      'bg-[#FF4057] text-white rounded-[23px]': color === 'red',
      'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] text-white rounded-[23px]':
        color === 'blue',
    }
  );

  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
