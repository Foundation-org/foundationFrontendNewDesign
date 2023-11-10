import classNames from 'classnames';

const Button = ({ children, type = 'button', color = 'gray', onClick }) => {
  const buttonClasses = classNames(
    'py-[21px] px-[45px] rounded-[23px] text-[32px] font-semibold leading-normal mr-[18.5px]',
    {
      'border-[5px] border-[#949494] text-[#949494]': color === 'gray',
      'bg-[#FF4057] text-white': color === 'red',
      'border-[5px]  bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] text-white':
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
