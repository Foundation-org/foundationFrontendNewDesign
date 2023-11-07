import { useState } from "react";
import SingleAnswer from "../pages/Dashboard/components/SingleAnswer";
import BasicModal from "./BasicModal";
import AddNewOption from "../pages/Dashboard/components/AddNewOption";

const QuestionCard = ({
  id,
  img,
  alt,
  badgeCount,
  title,
  question,
  correctAnswers,
  btnText,
  btnColor,
}) => {
  const [open, setOpen] = useState(false);
  const [startTest, setStartTest] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStartTest = (testId) => setStartTest(testId);

  return (
    <div className="bg-[#F3F3F3] dark:bg-[#141618] border-[1px] border-[#858585] rounded-[26px]">
      <div className="flex items-center justify-between px-[22px] py-[17px]">
        <div className="w-fit h-fit relative">
          <img src={img} alt={alt} className="w-[48px] h-[60px]" />
          <p className="absolute transform-center pb-5 z-50 font-[400] text-[#F6F6F6] text-[17px] leading-normal">
            {badgeCount}
          </p>
        </div>
        <h1 className="text-[22px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF]">
          {title}
        </h1>
        {import.meta.env.VITE_THEME_SWITCH === "dark" ? (
          <img
            src="/assets/svgs/dashboard/save.svg"
            alt="save icon"
            className="w-9 h-7"
          />
        ) : (
          <img
            src="/assets/svgs/dashboard/bookmark-blue.svg"
            alt="save icon"
            className="w-9 h-7"
          />
        )}
      </div>
      <h1 className="text-[#7C7C7C] dark:text-[#B8B8B8] text-[25px] font-semibold leading-normal ml-[52.65px] mt-[5px]">
        {question}
      </h1>
      {/* question answers options */}
      {startTest ? (
        <>
          <div className="mt-[26px] flex flex-col gap-[10px]">
            <SingleAnswer number={"#1"} answer={"Changes"} />
            <SingleAnswer number={"#2"} answer={"Technology is versatile"} />
            <SingleAnswer number={"#3"} answer={"Technology is versatile."} />
            <SingleAnswer
              number={"#4"}
              answer={"Technology is diverse and versatile."}
            />
            <button
              onClick={handleOpen}
              className="ml-[135px] mt-3 flex items-center gap-[11.37px] py-[10px] px-[21px] w-fit rounded-[10px] bg-[#D9D9D9] text-[#435059] dark:bg-[#595C60] dark:text-[#BCBCBC] text-[18px] font-normal leading-normal"
            >
              {import.meta.env.VITE_THEME_SWITCH === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/add-dark.svg"
                  alt="add"
                  className="w-[15.6px] h-[15.6px]"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/add.svg"
                  alt="add"
                  className="w-[15.6px] h-[15.6px]"
                />
              )}
              Add Option
            </button>
            <BasicModal open={open} handleClose={handleClose}>
              <AddNewOption />
            </BasicModal>
          </div>
          <div className="mt-8 w-full flex justify-end">
            <div>
              <button
                className={` ${
                  import.meta.env.VITE_THEME_SWITCH === "dark"
                    ? "bg-[#333B46]"
                    : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                } shadow-inner inset-0  rounded-[15px] py-2 px-5 text-[#EAEAEA] dark:text-[#B6B6B6] text-[20px] font-semibold leading-normal mr-[30px] w-[173px]`}
              >
                Submit
              </button>
              <div className="flex justify-end gap-2 mr-[22px] mt-[38px] mb-[23px]">
                {import.meta.env.VITE_THEME_SWITCH === "dark" ? (
                  <img
                    src="/assets/svgs/dashboard/zoom-dark.svg"
                    alt="zoom"
                    className="h-[22px] w-[22px]"
                  />
                ) : (
                  <img
                    src="/assets/svgs/dashboard/zoom.svg"
                    alt="zoom"
                    className="h-[22px] w-[22px]"
                  />
                )}
                <h4 className="text-[#438BBF] dark:text-[#B6B6B6] text-[16px] font-medium leading-normal">
                  Full Screen
                </h4>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-1">
            {correctAnswers && (
              <p className="mt-12 rounded-[15px] bg-white dark:bg-[#303030] ml-6 pt-2 pb-[7px] px-[14px] text-[#28A954] dark:text-[#737373] text-[18px] font-semibold leading-normal min-w-[12rem] w-fit">
                2 Correct Answers
              </p>
            )}
            <div className="w-full flex gap-[42px] justify-end mr-[30px] mb-1">
              <button
                className={` ${
                  import.meta.env.VITE_THEME_SWITCH === "dark"
                    ? btnColor
                    : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                } shadow-inner inset-0  rounded-[15px] py-2 px-5 text-[#D6D6D6] dark:text-white text-[20px] font-semibold mt-10 w-[173px]`}
                onClick={() => handleStartTest(id)}
              >
                {btnText}
              </button>
              <button className="rounded-[15px] py-2 px-5 text-[#20D47E] dark:text-[#EAEAEA] text-[20px] font-semibold leading-normal mt-12 w-[173px] border-[3px] border-[#20D47E] dark:border-[#7C7C7C]">
                Result
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-[#090A0D] rounded-[10px] w-[114px] h-[26px] flex gap-1 items-center justify-center ml-[26px] mb-[23px]">
            <img
              src="/assets/svgs/dashboard/clock-outline.svg"
              alt="clock"
              className="h-4 w-4"
            />
            <p className="text-[18px] font-[400] leading-normal text-[#9C9C9C]">
              5 min ago
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionCard;
