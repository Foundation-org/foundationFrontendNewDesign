import { useEffect, useState } from "react";
import { changeOptions } from "../../../../../utils/options";
import { createInfoQuest } from "../../../../../api/questsApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Options from "../components/Options";
import CustomSwitch from "../../../../../components/CustomSwitch";

const YesNo = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [changedOption, setChangedOption] = useState("");
  const [correctState, setCorrectState] = useState(false);
  const [changeState, setChangeState] = useState(false);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      toast.success("Successfully Created Quest");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  useEffect(() => {
    if (correctState) {
      setChangeState(false);
      setChangedOption("");
    } else {
      setSelectedOption("");
    }
  }, [correctState]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

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
    if (correctState && selectedOption === "") {
      toast.warning("You have to select one correct option to finish");
      return;
    }

    const params = {
      Question: question,
      whichTypeQuestion: "yes/no",
      usersChangeTheirAns: changedOption,
      QuestionCorrect:
        correctState === true
          ? selectedOption === "Yes"
            ? "yes"
            : "no"
          : "Not Selected",
      uuid: localStorage.getItem("uId"),
    };

    createQuest(params);
  };

  return (
    <>
      <h4 className="mt-[47px] text-center text-[25px] font-medium leading-normal text-[#ACACAC]">
        Ask a question that allows for diverse responses and multiple answer
        options.
      </h4>
      <div className=" mx-auto my-10 max-w-[979px] rounded-[26px] bg-[#F3F3F3] py-[42px]">
        <h1 className="text-center text-[32px] font-semibold leading-normal text-[#7C7C7C]">
          Create Quest
        </h1>
        <h3 className="mb-[22px] ml-[104px] mt-[38px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Make a statement or pose a question
        </h3>
        <div className="relative flex w-full justify-center">
          <input
            type="text"
            className="w-full max-w-[838px] rounded-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-28 text-[30px] font-normal leading-[0px] text-[#435059]"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <h1 className="leading-0 absolute right-[72px] top-4 border-l-2 border-[#F3F3F3] px-6 text-[30px] font-semibold text-[#0FB063]">
            OK
          </h1>
        </div>
        <div className="mt-10 flex flex-col gap-[30px]">
          <Options
            number={"#1"}
            answer={"Yes"}
            options={correctState ? true : false}
            handleOptionChange={() => handleOptionChange("Yes")}
            isSelected={selectedOption === "Yes"}
          />
          <Options
            number={"#2"}
            answer={"No"}
            options={correctState ? true : false}
            handleOptionChange={() => handleOptionChange("No")}
            isSelected={selectedOption === "No"}
          />
        </div>
        <h3 className="mb-[32px] ml-[104px] mt-[50px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Customize your Quest
        </h3>
        <div className="mx-auto flex max-w-[838px] flex-col gap-7 rounded-[16px] bg-[#FCFCFC] py-[35px]">
          <h5 className="text-center text-[30px] font-medium leading-normal text-[#435059]">
            Settings
          </h5>
          <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              This Quest has a Correct Option.
            </h5>
            <CustomSwitch enabled={correctState} setEnabled={setCorrectState} />
          </div>
          {!correctState ? (
            <>
              <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
                <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
                  This Quest has a Change Option.
                </h5>
                <CustomSwitch
                  enabled={changeState}
                  setEnabled={setChangeState}
                />
              </div>
              {changeState ? (
                <div className="flex justify-center gap-4">
                  {changeOptions.map((item) => (
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
            </>
          ) : null}
        </div>
        <div className="flex w-full justify-end">
          <button className="blue-submit-button" onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default YesNo;
