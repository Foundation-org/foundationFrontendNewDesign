import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeOptions } from "../../../../../utils/options";
import Options from "../components/Options";
import CustomSwitch from "../../../../../components/CustomSwitch";

const RankChoice = () => {
  const navigate = useNavigate();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [question, setQuestion] = useState("");
  const [optionsCount, setOptionsCount] = useState(1);
  const [typedValues, setTypedValues] = useState(Array(optionsCount).fill(""));
  const [addOption, setAddOption] = useState(false);
  const [changeOption, setChangeOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleAddOption = () => {
    setOptionsCount((prevCount) => prevCount + 1);
  };

  const handleChange = (index, value) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index] = value;
    setTypedValues(newTypedValues);
  };

  return (
    <div>
      <h4 className="mt-[47px] text-center text-[25px] font-medium leading-normal text-[#ACACAC]">
        Create a selection of choices that can be arranged in order of
        preference.
      </h4>
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
        <div className="mt-10 flex flex-col gap-[30px]">
          {[...Array(optionsCount)].map((_, index) => (
            <Options
              key={index}
              allowInput={true}
              label={`Option ${index + 1} #`}
              options={true}
              trash={true}
              dragable={true}
              handleChange={(value) => handleChange(index, value)}
              typedValue={typedValues[index]}
            />
          ))}
          <button
            className="ml-[50px] mt-5 w-fit rounded-[23.6px] bg-[#C9C9C9] px-6 py-3 text-[31px] font-semibold leading-normal text-[#7C7C7C]"
            onClick={handleAddOption}
          >
            Add Option
          </button>
        </div>
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
            <CustomSwitch enabled={changeOption} setEnabled={setChangeOption} />
          </div>
          {changeOption ? (
            <div className="flex justify-center gap-4">
              {changeOptions.map((item) => (
                <button
                  key={item.id}
                  className={`${
                    selectedOption === item.title
                      ? "bg-[#389CE3]"
                      : "bg-[#7C7C7C]"
                  } rounded-md px-4 py-2 text-[#F4F4F4]`}
                  onClick={() => {
                    setSelectedOption(item.title);
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
          <button className="mr-[70px] mt-[60px] w-fit rounded-[23.6px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[60px] py-3 text-[31.5px] font-semibold leading-normal text-white">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankChoice;
