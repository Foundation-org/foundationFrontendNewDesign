const Close = ({ color }) => {
  return (
    <svg
      className="h-[8.52px] w-[8.52px] tablet:h-[22px] tablet:w-[22px] "
      xmlns="http://www.w3.org/2000/svg"
      // width="22"
      // height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M0.741902 4.55464C-0.210687 3.65219 -0.251328 2.14838 0.651124 1.19579C1.55358 0.243205 3.05738 0.202563 4.00997 1.10501L10.9092 7.64115L17.4454 0.741901C18.3478 -0.210686 19.8516 -0.251328 20.8042 0.651123C21.7568 1.55357 21.7974 3.05738 20.895 4.00997L14.3588 10.9092L21.2581 17.4454C22.2107 18.3478 22.2513 19.8516 21.3489 20.8042C20.4464 21.7568 18.9426 21.7974 17.99 20.895L11.0908 14.3588L4.55464 21.2581C3.65219 22.2107 2.14838 22.2513 1.19579 21.3489C0.243206 20.4464 0.202563 18.9426 1.10501 17.99L7.64115 11.0908L0.741902 4.55464Z"
        fill={color ? color : "#707175"}
      />
    </svg>
  );
};

export default Close;
