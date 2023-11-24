import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import { FaExclamation } from 'react-icons/fa6';

const SingleAnswer = ({
  number,
  answer,
  checkInfo,
  handleToggleCheck,
  check,
  content,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="mx-[72px] 2xl:mx-[85px] flex items-center gap-[25px]">
      <h1 className="text-[#435059] dark:text-[#D3D3D3] text-[20px] font-[500] leading-normal w-[26px] min-w-[26px]">
        {number}
      </h1>
      <div className="bg-white dark:bg-[#0D1012] rounded-[10px] w-full flex justify-between">
        <div className="flex items-center">
          {!checkInfo && (
            <div className="rounded-l-[10px] h-full w-fit bg-[#DEE6F7] dark:bg-[#9E9E9E] px-[7px] pt-[14px] pb-[13px]">
              {persistedTheme === 'dark' ? (
                <img
                  src="/assets/svgs/dashboard/six-dots-dark.svg"
                  alt="six dots"
                />
              ) : (
                <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
              )}
            </div>
          )}
          <h1 className="ml-8 text-[#435059] dark:text-[#D3D3D3] text-[19px] font-normal leading-normal pt-[12px] pb-[10px] ">
            {answer}
          </h1>
        </div>
        {!checkInfo ? (
          <div className="flex items-center gap-[37px] mr-[20.63px]">
            <img
              src="/assets/svgs/dashboard/edit.svg"
              alt="edit"
              className="w-[16px] h-[19.942px]"
            />
            <img
              src="/assets/svgs/dashboard/trash.svg"
              alt="trash"
              className="w-[16px] h-[19.942px]"
            />
          </div>
        ) : (
          <div className="flex items-center gap-[22px] mr-[20.63px] ">
            <div
              className="bg-[#0DD76A] w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => handleToggleCheck(answer, true, false)}
            >
              {check ? (
                <FaCheck className="w-[20px] h-[19.942px] text-white" />
              ) : null}
            </div>
            <div
              className="bg-[#FFD600] w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => handleToggleCheck(answer, false, true)}
            >
              {content ? (
                <FaExclamation className="w-[16px] h-[19.942px] text-white" />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswer;
