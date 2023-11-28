import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuests, toggleCheck } from "../features/quest/questsSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStartQuest,
  getStartQuestInfo,
  updateChangeAnsStartQuest,
} from "../api/questsApi";
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
  viewResult,
  handleViewResults,
  lastInteractedAt,
  usersChangeTheirAns
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(getQuests);
  const [open, setOpen] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [howManyTimesAnsChanged,setHowManyTimesAnsChanged]=useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleToggleCheck = (option, check, contend) => {
    const actionPayload = {
      option,
      check,
      contend,
    };

    dispatch(toggleCheck(actionPayload));
  };

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Start Quest Created Successfully") {
        toast.success("Successfully Answered Quest");
        queryClient.invalidateQueries("FeedData");
      }
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Answer has not changed") {
        toast.warning(
          "You have selected the same option as last time. Your option was not changed.",
        );
      }
      if (
        resp.data.message === "You can change your answer once every 1 hour"
      ) {
        toast.warning("You can change your option once every 1 hour.");
      }
      if (resp.data.message === "Start Quest Updated Successfully") {
        toast.success("Successfully Changed Quest");
      }
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const extractSelectedAndContended = (quests) => {
    let selected = null;
    let contended = null;

    for (const key in quests) {
      const option = quests[key];

      if (option.check) {
        selected = key;
      }

      if (option.contend) {
        contended = key;
      }
    }

    return { selected, contended };
  };

  const handleSubmit = () => {

    const { selected, contended } = extractSelectedAndContended(whichTypeQuestion==="Agree/Disagree"?quests.agreeDisagree:quests.yesNo);
    console.log({ selected, contended });

    let ans = {
      created: new Date(),
    };
    if (selected) {
      ans.selected = selected.charAt(0).toUpperCase() + selected.slice(1);
    }
    if (contended) {
      ans.contended = contended.charAt(0).toUpperCase() + contended.slice(1);
    }
    const params = {
      questId: id,
      answer: ans,
      addedAnswer: "",
      uuid: localStorage.getItem("uId"),
    };
    // console.log("params", params);

    if (btnText === "change answer") {
      console.log(howManyTimesAnsChanged);
      const currentDate = new Date();

      // Define the time interval (in milliseconds) based on usersChangeTheirAns value
      let timeInterval = 0;
      if (usersChangeTheirAns === 'Daily') {
          timeInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      } else if (usersChangeTheirAns === 'Weekly') {
          timeInterval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      } else if (usersChangeTheirAns === 'Monthly') {
          // Assuming 30 days in a month for simplicity
          timeInterval = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      } else if (usersChangeTheirAns === 'Yearly') {
          // Assuming 365 days in a year for simplicity
          timeInterval = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
        } else if (usersChangeTheirAns === 'TwoYears') {
          // Assuming 2 years
          timeInterval = 2 * 365 * 24 * 60 * 60 * 1000; // 2 years in milliseconds
        } else if (usersChangeTheirAns === 'FourYears') {
          // Assuming 4 years
          timeInterval = 4 * 365 * 24 * 60 * 60 * 1000; // 4 years in milliseconds
        }

      // Check if enough time has passed
      if (howManyTimesAnsChanged>1 && currentDate - new Date(lastInteractedAt) < timeInterval) {
          // Alert the user if the time condition is not met
          toast.error(`You can only finish after ${usersChangeTheirAns} interval has passed.`, {
              position: 'top-right'
          })  
      } else {

      console.log("changed");

      changeAnswer(params);
    }
    } else {
      console.log("start");
      startQuest(params);
    }

    handleStartTest(null);
  };

  // to get selected answers
  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      console.log( res.data.data );
      setHowManyTimesAnsChanged(res.data.data.length)
      if(whichTypeQuestion==="agree/disagree" || whichTypeQuestion==="yes/no"){
        if(res.data.data[res.data.data.length - 1].selected === "Agree" || res.data.data[res.data.data.length - 1].selected === "Yes"){
          console.log("ran 1");
          handleToggleCheck(res.data.data[res.data.data.length - 1].selected,true,false)
        }
        if(res.data.data[res.data.data.length - 1].contended === "Agree" || res.data.data[res.data.data.length - 1].contended === "Yes"){
          console.log("ran 2");
          
          handleToggleCheck(res.data.data[res.data.data.length - 1].contended,true,false)
        }
        if(res.data.data[res.data.data.length - 1].contended === "Disagree" || res.data.data[res.data.data.length - 1].contended === "No"){
          console.log("ran 3");
          
          handleToggleCheck(res.data.data[res.data.data.length - 1].contended,false,true)
        }
        if(res.data.data[res.data.data.length - 1].selected === "Disagree" || res.data.data[res.data.data.length - 1].selected === "No"){
          console.log("ran 4");
          
          handleToggleCheck(res.data.data[res.data.data.length - 1].selected,false,true)
        }
        
    
        
      }
      
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const handleStartChange = () => {
    if (btnText === "") {
      handleStartTest(id);
    }
    if (btnText === "change answer") {
      const data = { questForeignKey:id, uuid: localStorage.getItem("uId") };
      getStartQuestDetail(data);
      handleStartTest(id);
    }
  };

  function getButtonText(btnText) {
    switch (btnText) {
      case "correct":
        return "Correct";
      case "incorrect":
        return "Incorrect";
      case "change answer":
        return "Change";
      default:
        return "Start";
    }
  }

  function getButtonClassName(persistedTheme, btnText, btnColor) {
    if (persistedTheme === "dark") {
      switch (btnText) {
        case "correct":
          return "bg-[#148339]";
        case "incorrect":
          return "bg-[#C13232]";
        case "change answer":
          return "bg-[#BB9D02]";
        default:
          return "inset-0 rounded-[15px] border-[1px] border-[#333B46] bg-[#333B46] shadow-inner";
      }
    } else {
      return btnColor;
    }
  }

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
                {title === "Yes/No" ? 
                  <>
                    <SingleAnswer
                      number={"#1"}
                      answer={"Yes"}
                      checkInfo={true}
                      check={quests.yesNo.yes.check}
                      contend={quests.yesNo.yes.contend}
                      handleToggleCheck={handleToggleCheck}
                    />
                    <SingleAnswer
                      number={"#2"}
                      answer={"No"}
                      checkInfo={true}
                      check={quests.yesNo.no.check}
                      contend={quests.yesNo.no.contend}
                      handleToggleCheck={handleToggleCheck}
                    /></> :
                  <>
                    <SingleAnswer
                      number={"#1"}
                      answer={"Agree"}
                      checkInfo={true}
                      check={quests.agreeDisagree.agree.check}
                      contend={quests.agreeDisagree.agree.contend}
                      handleToggleCheck={handleToggleCheck}
                    />
                    <SingleAnswer
                      number={"#2"}
                      answer={"Disagree"}
                      checkInfo={true}
                      check={quests.agreeDisagree.disagree.check}
                      contend={quests.agreeDisagree.disagree.contend}
                      handleToggleCheck={handleToggleCheck}
                    />
                  </>
                }
              </>
            ) : (
              answers.map((item, index) => (
                <SingleAnswer
                  number={"#" + (index + 1)}
                  answer={item.question}
                />
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
                onClick={() => handleSubmit()}
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
                className={` ${getButtonClassName(
                  persistedTheme,
                  btnText,
                  btnColor,
                )} mt-12 w-[173px] rounded-[15px] px-5 py-2 text-[20px] font-semibold leading-normal text-white`}
                onClick={handleStartChange}
                disabled={btnText === "correct" || btnText === "incorrect"}
              >
                {getButtonText(btnText)}
              </button>

              <button
                className="mt-12 w-[173px] rounded-[15px] border-[3px] border-[#20D47E] px-5 py-2 text-[20px] font-semibold leading-normal text-[#20D47E] dark:border-[#7C7C7C] dark:text-[#C9C8C8]"
                onClick={handleViewResults}
              >
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
