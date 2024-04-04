import { useSelector } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const Options = ({
  snapshot,
  id,
  title,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
  allowInput,
  handleChange,
  typedValue,
  isSelected,
  optionsCount,
  removeOption,
  number,
  answerVerification,
  optionStatus,
  handleTab,
  isTyping,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label ? 'flex flex-col gap-[13px]' : 'flex flex-row items-center gap-[25px]'
      } mx-[22px] tablet:ml-[60px] tablet:mr-[59.23px]`}
    >
      {!allowInput ? (
        <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
          <div className="flex w-full items-center">
            <div className="flex h-full w-[38px] items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
              {dragable ? (
                persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                    alt="six dots"
                    className="h-7"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                    alt="six dots"
                    className="h-7"
                  />
                )
              ) : null}
            </div>
            <div className="flex w-full items-center justify-between pr-[45px]">
              <h1 className="py-[18px] pl-[45px] text-[30px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] ">
                {answer}
              </h1>
              <div className="flex gap-[55px]">
                {options && (
                  <div id="green-checkbox">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="h-10 w-10 rounded"
                      onChange={handleOptionChange}
                      checked={isSelected}
                    />
                  </div>
                )}
                {trash && (
                  <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`} alt="trash" />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex w-full items-center justify-center">
            <div className="flex w-full rounded-r-[0.33rem] bg-transparent tablet:w-full tablet:rounded-[10.3px] laptop:rounded-[10px]">
              <div
                className={`${
                  snapshot.isDragging ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
                } dragIconWrapper border-y border-s tablet:border-y-[3px] tablet:border-s-[3px]`}
              >
                {persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                    alt="six dots"
                    className="h-[8.8px] tablet:h-[18px]"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                    alt="six dots"
                    className="h-[8.8px] tablet:h-[18px]"
                  />
                )}
              </div>
              <div
                className={`${
                  snapshot.isDragging
                    ? 'border-[#5FA3D5] bg-[#F2F6FF]'
                    : 'border-[#DEE6F7] bg-white dark:border-[#0D1012] dark:bg-[#0D1012]'
                } w-5 min-w-5 border-y tablet:border-y-[3px]`}
              ></div>
              <TextareaAutosize
                id={`input-${number}`}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => e.target.value.trim() !== '' && answerVerification(e.target.value)}
                value={typedValue}
                placeholder="Add your own option"
                tabIndex={number + 1}
                onKeyDown={(e) =>
                  (e.key === 'Tab' && handleTab(number)) || (e.key === 'Enter' && handleTab(number, 'Enter'))
                }
                className={`${
                  snapshot.isDragging
                    ? 'border-[#5FA3D5] bg-[#F2F6FF]'
                    : 'border-[#DEE6F7] bg-white dark:border-[#0D1012] dark:bg-[#0D1012]'
                } box-border flex w-full resize-none items-center border-y py-[7px] pr-2 text-[0.625rem] font-normal leading-[0.625rem] text-[#7C7C7C] focus-visible:outline-none tablet:h-[51px] tablet:border-y-[3px] tablet:py-[11px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:h-[45px] laptop:text-[18px] dark:text-[#7C7C7C]`}
              />
              <div
                id={`test${number}`}
                className={`${
                  snapshot.isDragging
                    ? 'border-[#5FA3D5] bg-[#F2F6FF]'
                    : 'border-[#DEE6F7] bg-white dark:border-[#0D1012] dark:bg-[#0D1012]'
                } relative flex items-center rounded-r-[0.33rem] border-y border-r text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[10px] laptop:text-[1.25rem] ${
                  optionStatus.color
                }`}
              >
                <div className="flex h-[75%] w-[50px] items-center justify-center border-l border-[#DEE6F7] tablet:w-[99.58px] tablet:border-l-[3px] laptop:w-[134px]">
                  <span> {isTyping ? `${typedValue.length}/200` : optionStatus.name} </span>
                </div>
                <Tooltip optionStatus={optionStatus} id={`input-${number}`} />
              </div>
              {(title === 'RankChoice' || title === 'MultipleChoice' || title === 'OpenChoice') && trash && (
                <div
                  id={`test${number}`}
                  className={`flex h-[24.8px] items-center text-[0.5rem] font-semibold xl:text-[1.875rem] tablet:h-[50.19px] tablet:text-[17.54px] laptop:h-[45px] dark:bg-[#141618] ${optionStatus?.color} py-[0.29rem]`}
                >
                  <div className="flex w-5 items-center justify-center tablet:w-[52.78px]">
                    <>
                      {optionsCount > 2 && (
                        <div
                          onClick={() => {
                            removeOption(id, number);
                          }}
                        >
                          <img
                            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                            alt="trash"
                            className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
                          />
                        </div>
                      )}
                    </>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`${
                optionsCount > 2
                  ? 'absolute left-[208px] tablet:left-[42rem]'
                  : 'absolute left-[221px] tablet:left-[24rem] laptop:left-[44rem]'
              } -top-[22px] flex w-fit items-center tablet:-top-[46px] laptop:-top-[74px]`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
