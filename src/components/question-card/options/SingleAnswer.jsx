const SingleAnswer = (props) => {
  return (
    <div
      className={`flex items-center ${props.questStartData.type === 'embed' ? 'px-7 tablet:px-[3.94rem]' : 'pl-7 pr-12 tablet:pl-[3.94rem] tablet:pr-[6.3rem]'}`}
    >
      <div className="flex h-[21.8px] w-3 min-w-[12px] items-center justify-center rounded-l-[5.387px] bg-white-500 tablet:h-[49px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] laptop:min-w-[25px] dark:bg-gray-100">
        &#x200B;
      </div>
      <div
        className={`flex w-full justify-between rounded-r-[4.73px] border-y border-r border-white-500 bg-white tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] dark:border-gray-100 dark:bg-accent-100 ${props.btnText === 'Results' ? 'pointer-events-none' : 'cursor-pointer'}`}
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
        <div className="relative flex w-full items-center">
          <div
            className="absolute top-0 block h-[5px] bg-green-100 tablet:h-[10px]"
            style={{
              width: props.percentage,
            }}
          />
          <h1 className="pb-[5.7px] pl-2 pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] tablet:py-3 tablet:pl-[18px] tablet:text-[19px] dark:text-[#D3D3D3]">
            {props.answer}
          </h1>
        </div>
        {props?.postProperties !== 'HiddenPosts' && (
          <div
            className={`flex items-center gap-[10.3px] pr-[10px] text-[9.2px] tablet:gap-[22px] tablet:text-[16px] ${
              props.btnText === 'Results' ? 'pointer-events-none' : ''
            }`}
          >
            <div className="flex items-center gap-1 laptop:gap-[18px]">
              {props?.questStartData?.type !== 'embed' &&
                props?.postProperties !== 'sharedlink-results' &&
                props.postProperties !== 'actual-results' && (
                  <div id="custom-checkbox" className="flex h-full items-center">
                    <input
                      id="small-checkbox"
                      type="checkbox"
                      className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                      checked={props.check}
                      readOnly
                    />
                  </div>
                )}
              {props.btnText === 'Results' ? (
                props.percentage === undefined ? (
                  <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
                ) : (
                  <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">{props.percentage}</span>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswer;
