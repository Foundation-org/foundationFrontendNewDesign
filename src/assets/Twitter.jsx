const Twitter = ({ color, h, w }) => {
  return (
    <svg
      className="mr-[0.5rem] h-3 w-3 tablet:mr-[0.2rem] tablet:h-[1.28rem] tablet:w-[1.28rem]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 11 12"
      fill="none"
      style={{ height: h, width: w }}
    >
      <path
        d="M9.56679 10.1332L6.16595 5.19173L5.78143 4.63289L3.34787 1.09875L3.14621 0.805664H0.157227L0.886101 1.86522L4.12117 6.56573L4.50569 7.12371L7.10503 10.9005L7.30669 11.1928H10.2965L9.56679 10.1332ZM7.6613 10.516L4.96113 6.59222L4.57661 6.03339L1.44322 1.48156H2.79074L5.32514 5.16353L5.70966 5.72236L9.00967 10.5169H7.6613V10.516Z"
        fill={color ? color : "#A3A3A3"}
      />
      <path
        d="M4.57686 6.0332L4.96137 6.59203L4.50594 7.12267L1.00768 11.1917H0.145508L4.12142 6.56469L4.57686 6.0332Z"
        fill={color ? color : "#A3A3A3"}
      />
      <path
        d="M9.93599 0.805664L6.16601 5.19173L5.70971 5.72236L5.3252 5.16353L5.78149 4.63289L8.33554 1.66015L9.07381 0.805664H9.93599Z"
        fill={color ? color : "#A3A3A3"}
      />
    </svg>
  );
};

export default Twitter;
