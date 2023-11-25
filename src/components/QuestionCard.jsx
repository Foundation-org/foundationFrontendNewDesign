import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuests, toggleCheck } from "../features/quest/questsSlice";
import { useMutation } from "@tanstack/react-query";
import { createInfoQuest } from "../api/questsApi";
import { toast } from "sonner";
import SingleAnswer from "../pages/Dashboard/components/SingleAnswer";
import AddNewOption from "../pages/Dashboard/components/AddNewOption";
import BasicModal from "./BasicModal";

const QuestionCard = ({
  id,
  img,
  alt,
  badgeCount,
  title,
  answers,
  question,
  whichTypeQuestion,
  correctAnswers,
  btnText,
  btnColor,
  isBookmarked,
  handleStartTest,
  startTest,
}) => {
  const dispatch = useDispatch();
  const quests = useSelector(getQuests);
  const [questSelection, setQuestSelection] = useState(quests);
  const [open, setOpen] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleToggleCheck = (option, check, content) => {
    const actionPayload = {
      option,
      check,
      content,
    };

    dispatch(toggleCheck(actionPayload));
  };

  const { mutateAsync: postQuestInfo } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      // console.log('resp', resp);
      toast.success("success");
    },
    onError: (err) => {
      // console.log('error', err);
      toast.error(err.response.data);
    },
  });

  useEffect(() => {
    if (quests) {
      if (title === "Agree/Disagree") {
        const updatedQuests = { ...quests };

        updatedQuests.agree = updatedQuests.yes;
        delete updatedQuests.yes;

        updatedQuests.disagree = updatedQuests.no;
        delete updatedQuests.no;

        setQuestSelection(updatedQuests);
      } else {
        console.log(quests);
      }
    }
  }, [title, quests]);

  console.log({
    "ForYesNo ": quests,
    "ForAgreeDisAgree ": questSelection,
  });

  return (
    <div className="rounded-[26px] border-[1px] border-[#F3F3F3] bg-[#F3F3F3] dark:border-[#858585] dark:bg-[#141618]">
      <div className="flex items-center justify-between px-[22px] py-[17px]">
        <div className="relative h-fit w-fit">
          <img src={img} alt={alt} className="h-[60px] w-[48px]" />
          <p className="transform-center absolute z-50 pb-5 text-[17px] font-[400] leading-normal text-[#F6F6F6]">
            {badgeCount}
          </p>
        </div>
        <h1 className="text-[22px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF]">
          {title}
        </h1>
        {isBookmarked ? (
          persistedTheme !== "dark" ? (
            <img
              src="/assets/svgs/dashboard/bookmark-blue.svg"
              alt="save icon"
              className="h-7 w-9 cursor-pointer"
            />
          ) : (
            <img
              src="/assets/svgs/dashboard/bookmark-white.svg"
              alt="save icon"
              className="h-7 w-9 cursor-pointer"
            />
          )
        ) : (
          <img
            src="/assets/svgs/dashboard/save.svg"
            alt="save icon"
            className="h-7 w-9 cursor-pointer"
          />
        )}

        {/* isBookmarked ? (
          <img
            src="/assets/svgs/dashboard/bookmark-blue.svg"
            alt="save icon"
            className="w-9 h-7 cursor-pointer"
          />
        ) : (
          <img
            src="/assets/svgs/dashboard/bookmark-white.svg"
            alt="save icon"
            className="w-9 h-7 cursor-pointer"
          />
        ) */}
      </div>
      {question.endsWith("?") ? (
        <h1 className="ml-[52.65px] mt-[5px] text-[25px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8]">
          Q. {question}
        </h1>
      ) : (
        <h1 className="ml-[52.65px] mt-[5px] text-[25px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8]">
          S. {question}
        </h1>
      )}
      {startTest === id ? (
        <>
          <div className="mt-[26px] flex flex-col gap-[10px]">
            {title === "Yes/No" || title === "Agree/Disagree" ? (
              <>
                {quests.yes.check ? (
                  <SingleAnswer
                    number={"#1"}
                    answer={"Yes"}
                    checkInfo={true}
                    check={quests.yes.check}
                    content={quests.yes.content}
                    handleToggleCheck={handleToggleCheck}
                  />
                ) : (
                  <SingleAnswer
                    number={"#1"}
                    answer={"Yes"}
                    checkInfo={true}
                    check={quests.yes.check}
                    content={quests.yes.content}
                    handleToggleCheck={handleToggleCheck}
                  />
                )}
                {quests.no.content ? (
                  <SingleAnswer
                    number={"#2"}
                    answer={"No"}
                    checkInfo={true}
                    check={quests.no.check}
                    content={quests.no.content}
                    handleToggleCheck={handleToggleCheck}
                  />
                ) : (
                  <SingleAnswer
                    number={"#2"}
                    answer={"No"}
                    checkInfo={true}
                    check={quests.no.check}
                    content={quests.no.content}
                    handleToggleCheck={handleToggleCheck}
                  />
                )}
              </>
            ) : (
              answers.map((item, index) => (
                <SingleAnswer number={"#" + index} answer={item.question} />
              ))
            )}

            {title === "Yes/No" || title === "Agree/Disagree" ? (
              <></>
            ) : (
              <button
                onClick={handleOpen}
                className="ml-[135px] mt-3 flex w-fit items-center gap-[11.37px] rounded-[10px] bg-[#D9D9D9] px-[21px] py-[10px] text-[18px] font-normal leading-normal text-[#435059] dark:bg-[#595C60] dark:text-[#BCBCBC]"
              >
                {persistedTheme === "dark" ? (
                  <img
                    src="/assets/svgs/dashboard/add-dark.svg"
                    alt="add"
                    className="h-[15.6px] w-[15.6px]"
                  />
                ) : (
                  <img
                    src="/assets/svgs/dashboard/add.svg"
                    alt="add"
                    className="h-[15.6px] w-[15.6px]"
                  />
                )}
                Add Option
              </button>
            )}
            <BasicModal open={open} handleClose={handleClose}>
              <AddNewOption />
            </BasicModal>
          </div>
          <div className="mt-8 flex w-full justify-end">
            <div>
              <button
                className={` ${
                  persistedTheme === "dark"
                    ? "bg-[#333B46]"
                    : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                } inset-0 mr-[30px]  w-[173px] rounded-[15px] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner dark:text-[#B6B6B6]`}
                onClick={() =>
                  postQuestInfo({
                    Question: question,
                    whichTypeQuestion,
                    // complete the data for this api
                    uuid: localStorage.getItem("uId"),
                  })
                }
              >
                Submit
              </button>
              <div className="mb-[23px] mr-[22px] mt-[38px] flex justify-end gap-2">
                {persistedTheme === "dark" ? (
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
                <h4 className="text-[16px] font-medium leading-normal text-[#438BBF] dark:text-[#B6B6B6]">
                  Full Screen
                </h4>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-1 flex items-center">
            {correctAnswers && (
              <p className="ml-6 mt-12 w-fit min-w-[12rem] rounded-[15px] bg-white px-[14px] pb-[7px] pt-2 text-[18px] font-semibold leading-normal text-[#28A954] dark:bg-[#303030] dark:text-[#737373]">
                2 Correct Answers
              </p>
            )}
            <div className="mb-1 mr-[30px] flex w-full justify-end gap-[42px]">
              <button
                className={` ${
                  persistedTheme === "dark"
                    ? btnText === "correct"
                      ? "bg-[#148339]"
                      : btnText === "incorrect"
                        ? "bg-[#C13232]"
                        : btnText === "change answer"
                          ? "bg-[#BB9D02]"
                          : "inset-0 rounded-[15px] border-[1px] border-[#333B46] bg-[#333B46] shadow-inner"
                    : btnColor
                } mt-12 w-[173px] rounded-[15px] px-5 py-2 text-[20px] font-semibold leading-normal text-white`}
                onClick={() => handleStartTest(id)}
                disabled={btnText === "correct" || btnText === "incorrect"}
              >
                {btnText === "correct"
                  ? "Correct"
                  : btnText === "incorrect"
                    ? "Incorrect"
                    : btnText === "change answer"
                      ? "Change"
                      : "Start"}
              </button>
              <button className="mt-12 w-[173px] rounded-[15px] border-[3px] border-[#20D47E] px-5 py-2 text-[20px] font-semibold leading-normal text-[#20D47E] dark:border-[#7C7C7C] dark:text-[#C9C8C8]">
                Result
              </button>
            </div>
          </div>
          <div className="mb-[23px] ml-[26px] flex h-[26px] w-[114px] items-center justify-center gap-1 rounded-[10px] bg-white dark:bg-[#090A0D]">
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
