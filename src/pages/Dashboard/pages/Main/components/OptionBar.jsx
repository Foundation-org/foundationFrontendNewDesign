import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { resetQuests } from "../../../../../features/quest/questsSlice";

const OptionBar = ({
  correctAnswers,
  btnText,
  btnColor,
  handleStartTest,
  handleViewResults,
  id,
  setHowManyTimesAnsChanged,
}) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      console.log(res.data.data);
      setHowManyTimesAnsChanged(res.data.data.length);
      if (
        whichTypeQuestion === "agree/disagree" ||
        whichTypeQuestion === "yes/no"
      ) {
        if (
          res.data.data[res.data.data.length - 1].selected === "Agree" ||
          res.data.data[res.data.data.length - 1].selected === "Yes"
        ) {
          console.log("ran 1");
          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
        if (
          res.data.data[res.data.data.length - 1].contended === "Agree" ||
          res.data.data[res.data.data.length - 1].contended === "Yes"
        ) {
          console.log("ran 2");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            true,
            false,
          );
        }
        if (
          res.data.data[res.data.data.length - 1].contended === "Disagree" ||
          res.data.data[res.data.data.length - 1].contended === "No"
        ) {
          console.log("ran 3");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res.data.data[res.data.data.length - 1].selected === "Disagree" ||
          res.data.data[res.data.data.length - 1].selected === "No"
        ) {
          console.log("ran 4");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            false,
            true,
          );
        }
      }
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const handleStartChange = () => {
    if (btnText === "") {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === "change answer") {
      const data = { questForeignKey: id, uuid: localStorage.getItem("uId") };
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
            onClick={() => {
              handleViewResults(id);
            }}
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
  );
};

export default OptionBar;
