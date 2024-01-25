const SingleAnswer = (props) => {
  return (
    <div className="flex items-center pl-7 pr-12 tablet:pl-[3.94rem] tablet:pr-[6.3rem]">
      <div className="flex min-w-[12px] h-[21.8px] w-3 items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] dark:bg-[#D9D9D9] tablet:h-[49px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px]">
        &#x200B;
      </div>
      <div
        className={` flex w-full justify-between rounded-r-[4.73px] border-y border-r border-[#DEE6F7] bg-white dark:border-[#D9D9D9] dark:bg-[#0D1012] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] ${props.btnText === 'Results' ? 'pointer-events-none' : 'cursor-pointer'}`}
        onClick={() =>
          props.btnText === 'Results'
            ? null
            : props.handleToggleCheck(
                props.questStartData.whichTypeQuestion,
                props.answer,
                !props.check,
                props.questStartData._id,
              )
        }
      >
        <div className="relative flex items-center w-full">
          <div
            className="block h-[5px] tablet:h-[10px] absolute top-0 bg-[#4DD896]"
            style={{
              width: props.percentage,
            }}
          />
          <h1 className="pb-[5.7px] pl-[18px] pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] dark:text-[#D3D3D3] tablet:py-3 tablet:text-[19px]">
            {props.answer}
          </h1>
        </div>
        <div
          className={`flex items-center gap-[10.3px] pr-[10px] text-[9.2px] tablet:gap-[22px] tablet:text-[16px] ${
            props.btnText === 'Results' ? 'pointer-events-none' : ''
          }`}
        >
          <div className="flex items-center gap-1 laptop:gap-[18px]">
            <div id="custom-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={props.check}
                readOnly
              />
            </div>
            {props.btnText === 'Results' ? (
              props.percentage === undefined ? (
                <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
              ) : (
                <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">{props.percentage}</span>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAnswer;
