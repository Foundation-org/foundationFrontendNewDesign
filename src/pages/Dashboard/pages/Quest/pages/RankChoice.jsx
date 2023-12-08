import { useState } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeOptions } from "../../../../../utils/options";
import Options from "../components/Options";
import CustomSwitch from "../../../../../components/CustomSwitch";
import Title from "../components/Title";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useMutation } from "@tanstack/react-query";
import { createInfoQuest } from "../../../../../api/questsApi";
import { toast } from "sonner";
import { SortableItem, SortableList } from "@thaddeusjiang/react-sortable-list";
import { useSelector } from "react-redux";

const DragHandler = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  return (
    <div
      {...props}
      className="z-10 ml-[21px] flex h-[22.16px] w-[13.4px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] px-[5.2px] py-[6.84px] dark:bg-[#9E9E9E] tablet:ml-14 tablet:h-[46.4px] tablet:w-[28px] tablet:rounded-l-[10px] tablet:px-[7px] tablet:pb-[13px] tablet:pt-[14px] xl:h-[74px] xl:w-[38px]"
    >
      <div title="drag handler" className="flex items-center">
        {persistedTheme === "dark" ? (
          <img
            src="/assets/svgs/dashboard/six-dots-dark.svg"
            alt="six dots"
            className="h-[8.8px] tablet:h-7"
          />
        ) : (
          <img
            src="/assets/svgs/dashboard/six-dots.svg"
            alt="six dots"
            className="h-[8.8px] tablet:h-7"
          />
        )}
      </div>
    </div>
  );
};

const RankChoice = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [addOption, setAddOption] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [changedOption, setChangedOption] = useState("");
  const [optionsCount, setOptionsCount] = useState(2);
  const [typedValues, setTypedValues] = useState(() =>
    Array.from({ length: optionsCount }, (_, index) => ({
      id: `index-${index}`,
      question: "",
      selected: false,
    })),
  );

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      console.log("resp", resp);
      toast.success("Successfully Created Quest");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const handleSubmit = () => {
    if (changeState && changedOption === "") {
      toast.warning(
        "Looks like you missed selecting the answer change frequency",
      );
      return;
    }
    if (question === "") {
      toast.warning("Write some Question Before Submitting");
      return;
    }

    const params = {
      Question: question,
      whichTypeQuestion: "ranked choise",
      QuestionCorrect: "No option",
      QuestAnswers: typedValues,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      uuid: localStorage.getItem("uId"),
    };

    console.log({ params });

    createQuest(params);
  };

  const handleAddOption = () => {
    setOptionsCount((prevCount) => prevCount + 1);
    setTypedValues((prevValues) => [
      ...prevValues,
      { id: `index-${optionsCount}`, question: "", selected: false },
    ]);
  };

  const handleChange = (index, value) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index] = { ...newTypedValues[index], question: value };
    setTypedValues(newTypedValues);
  };

  const handleOptionSelect = (index) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index].selected = !newTypedValues[index].selected;
    setTypedValues(newTypedValues);

    if (!multipleOption) {
      newTypedValues.forEach((item, i) => {
        if (i !== index) {
          item.selected = false;
        }
      });
      setTypedValues(newTypedValues);

      const ChangedOption = newTypedValues[index].selected
        ? [{ answers: newTypedValues[index].question }]
        : [];
      setSelectedValues(ChangedOption);
    } else {
      const ChangedOption = { answers: newTypedValues[index].question };

      if (newTypedValues[index].selected) {
        setSelectedValues((prevValues) => [...prevValues, ChangedOption]);
      } else {
        setSelectedValues((prevValues) =>
          prevValues.filter((item) => item.answers !== ChangedOption.answers),
        );
      }
    }
  };

  const removeOption = (indexToRemove) => {
    if (optionsCount > 2) {
      const newOptionsCount = Math.max(optionsCount - 1, 2);

      setTypedValues((prevTypedValues) =>
        prevTypedValues.filter((_, index) => index !== indexToRemove),
      );

      setOptionsCount(newOptionsCount);
    } else {
      console.warn("Cannot remove the last two options.");
    }
  };

  const handleOnSortEnd = (sortedItems) => {
    setTypedValues(sortedItems.items);
  };

  return (
    <div>
      <Title />
      <div className="mx-auto my-[14.63px] max-w-[85%] rounded-[8.006px] bg-[#F3F3F3] py-[12.93px] tablet:my-10 tablet:rounded-[26px] tablet:py-[27px] xl:max-w-[979px] xl:py-[42px]">
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[22.81px] xl:text-[32px]">
          Create Quest
        </h1>
        <h3 className="mb-[13.54px] ml-[32px] mt-[11.71px] text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:ml-[67px] tablet:mt-[20.38px] tablet:text-[16.58px] xl:mb-[22px] xl:ml-[104px] xl:mt-[38px] xl:text-[25px]">
          Make a statement or pose a question
        </h3>
        {/* write question */}
        {/* <div className="relative flex w-full justify-center">
          <input
            type="text"
            className="w-full max-w-[85%] rounded-[4.948px] border-[1px] border-[#ACACAC] bg-white pb-[4.63px] pl-[19.35px] pr-[43px] pt-[5.54px] text-[10px] font-normal leading-[0px] text-[#435059] tablet:rounded-[10.364px] tablet:pb-[9.83px] tablet:pr-28 tablet:pt-[11.61px] tablet:text-[20.73px] xl:max-w-[857px] xl:rounded-2xl xl:py-[18px] xl:pl-9 xl:text-[30px]"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <h1 className="leading-0 absolute right-6 top-[6px] border-l-2 border-[#F3F3F3] px-[7px] text-[8.46px] font-semibold text-[#0FB063] tablet:right-11 tablet:top-3 tablet:px-[18.6px] tablet:text-[17.546px] xl:right-[72px] xl:top-4 xl:px-6 xl:text-[30px]">
            OK
          </h1>
        </div> */}
        <div className="relative mx-auto flex w-[90%] justify-center">
          <input
            type="text"
            className="w-full rounded-[4.948px] border-[1px] border-[#ACACAC] bg-white pb-[4.63px] pl-[19.35px] pr-[43px] pt-[5.54px] text-[10px] font-normal leading-[0px] text-[#435059] tablet:rounded-[10.364px] tablet:pb-[9.83px] tablet:pr-28 tablet:pt-[11.61px] tablet:text-[20.73px] xl:max-w-[857px] xl:rounded-2xl xl:py-[18px] xl:pl-9 xl:text-[30px]"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <h1 className="leading-0 absolute right-0 top-[6px] border-l-2 border-[#F3F3F3] px-[7px] text-[8.46px] font-semibold text-[#0FB063] tablet:right-11 tablet:top-3 tablet:px-[18.6px] tablet:text-[17.546px] xl:right-[72px] xl:top-4 xl:px-6 xl:text-[30px]">
            OK
          </h1>
        </div>

        {/* options */}
        <SortableList
          items={typedValues}
          setItems={setTypedValues}
          onSortEnd={handleOnSortEnd}
        >
          {({ items }) => (
            <div
              id="dragIcon"
              className="mt-[12.8px] flex flex-col gap-[9.24px] tablet:mb-8 tablet:mt-10 tablet:gap-5 xl:gap-[30px]"
            >
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  DragHandler={DragHandler}
                >
                  <Options
                    key={index}
                    title="RankChoice"
                    allowInput={true}
                    label={`Option ${index + 1} #`}
                    trash={true}
                    dragable={true}
                    handleChange={(value) => handleChange(index, value)}
                    handleOptionSelect={() => handleOptionSelect(index)}
                    typedValue={item.question}
                    isSelected={item.selected}
                    optionsCount={optionsCount}
                    removeOption={() => removeOption(index)}
                    number={index}
                  />
                </SortableItem>
              ))}
            </div>
          )}
        </SortableList>
        <button
          className="ml-[21.55px] mt-[16px] w-fit rounded-[7.287px] bg-[#C9C9C9] px-[7.29px] py-[3.89px] text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:ml-[50px] tablet:mt-5 tablet:rounded-[15.265px] tablet:px-[15.27px] tablet:py-[8.14px] tablet:text-[20.736px] xl:rounded-[23.6px] xl:px-6 xl:py-3 xl:text-[31px]"
          onClick={handleAddOption}
        >
          Add Option
        </button>
        <h3 className="mb-1 ml-[32px] mt-4 text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:mb-[32px] tablet:ml-[104px] tablet:mt-[50px] tablet:text-[25px]">
          Customize your Quest
        </h3>
        {/* settings */}
        <div className="mx-auto flex max-w-[85%] flex-col gap-[9.71px] rounded-[16px] bg-[#FCFCFC] py-[15px] tablet:gap-7 tablet:py-[35px] xl:max-w-[838px]">
          <h5 className="text-center text-[11px] font-medium leading-normal text-[#435059] tablet:text-[19.35px] xl:text-[30px]">
            Settings
          </h5>
          <div className="mx-5 flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] xl:mx-[51px] xl:px-7 xl:py-[34px]">
            <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] xl:w-full xl:text-[28px]">
              Participant can add their own options.
            </h5>
            <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
          </div>
          <div className="mx-5 flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] xl:mx-[51px] xl:px-7 xl:py-[34px]">
            <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] xl:w-full xl:text-[28px]">
              Participants can change their choice at a later time.
            </h5>
            <CustomSwitch enabled={changeState} setEnabled={setChangeState} />
          </div>
          {changeState ? (
            <div className="flex flex-wrap justify-center gap-4">
              {changeOptions?.map((item) => (
                <button
                  key={item.id}
                  className={`${
                    changedOption === item.title
                      ? "bg-[#389CE3]"
                      : "bg-[#7C7C7C]"
                  } rounded-md px-4 py-1 text-[8px] text-[#F4F4F4] tablet:py-2 tablet:text-[16px]`}
                  onClick={() => {
                    setChangedOption(item.title);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        {/* submit button */}
        <div className="flex w-full justify-end">
          <button
            className="mr-[28px] mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white tablet:mr-[70px] tablet:mt-[60px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] xl:rounded-[23.6px] xl:px-[60px] xl:py-3 xl:text-[31.5px]"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankChoice;
