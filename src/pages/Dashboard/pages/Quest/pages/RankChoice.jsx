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
      className="z-10 ml-14 flex h-[74px] w-[38px] items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]"
    >
      <div title="drag handler" className="flex items-center">
        {persistedTheme === "dark" ? (
          <img
            src="/assets/svgs/dashboard/six-dots-dark.svg"
            alt="six dots"
            className="h-7"
          />
        ) : (
          <img
            src="/assets/svgs/dashboard/six-dots.svg"
            alt="six dots"
            className="h-7"
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
      <div className="mx-auto my-10 max-w-[979px] rounded-[26px] bg-[#F3F3F3] py-[42px]">
        <h1 className="text-center text-[32px] font-semibold leading-normal text-[#7C7C7C]">
          Create Quest
        </h1>
        <h3 className="ml-[104px] mt-[38px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Make a statement or pose a question
        </h3>
        {/* write question */}
        <div className="relative flex w-full justify-center">
          <input
            type="text"
            className="w-full max-w-[857px] rounded-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-28 text-[30px] font-normal leading-[0px] text-[#435059]"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <h1 className="leading-0 absolute right-[72px] top-4 border-l-2 border-[#F3F3F3] px-6 text-[30px] font-semibold text-[#0FB063]">
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
            <div id="dragIcon" className="mt-10 flex flex-col gap-[30px]">
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
          className="ml-[50px] mt-5 w-fit rounded-[23.6px] bg-[#C9C9C9] px-6 py-3 text-[31px] font-semibold leading-normal text-[#7C7C7C]"
          onClick={handleAddOption}
        >
          Add Option
        </button>
        <h3 className="mb-[32px] ml-[104px] mt-[50px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Customize your Quest
        </h3>
        {/* settings */}
        <div className="mx-auto flex max-w-[838px] flex-col gap-7 rounded-[16px] bg-[#FCFCFC] py-[35px]">
          <h5 className="text-center text-[30px] font-medium leading-normal text-[#435059]">
            Settings
          </h5>
          <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              Participant can add their own options.
            </h5>
            <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
          </div>
          <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              Participants can change their choice at a later time.
            </h5>
            <CustomSwitch enabled={changeState} setEnabled={setChangeState} />
          </div>
          {changeState ? (
            <div className="flex justify-center gap-4">
              {changeOptions?.map((item) => (
                <button
                  key={item.id}
                  className={`${
                    changedOption === item.title
                      ? "bg-[#389CE3]"
                      : "bg-[#7C7C7C]"
                  } rounded-md px-4 py-2 text-[#F4F4F4]`}
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
            className="mr-[70px] mt-[60px] w-fit rounded-[23.6px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[60px] py-3 text-[31.5px] font-semibold leading-normal text-white"
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
