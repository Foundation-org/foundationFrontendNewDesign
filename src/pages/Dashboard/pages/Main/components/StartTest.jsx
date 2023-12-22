import { STDropHandler } from "../../../../../utils/STDropHandler";
import { SortableList, SortableItem } from "@thaddeusjiang/react-sortable-list";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
import SingleAnswerRankedChoice from "../../../components/SingleAnswerRankedChoice";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { resetQuests } from "../../../../../features/quest/questsSlice";
import Copy from "../../../../../assets/Copy";
import Link from "../../../../../assets/Link";
import Mail from "../../../../../assets/Mail";
import Twitter from "../../../../../assets/Twitter";
import Facebook from "../../../../../assets/Facebook";
import BasicModal from "../../../../../components/BasicModal";
import CopyDialogue from "./Shareables/CopyDialogue";
import UrlDialogue from "./Shareables/UrlDialogue";
import EmailDialogue from "./Shareables/EmailDialogue";
import TwitterDialogue from "./Shareables/TwitterDialogue";
import FbDialogue from "./Shareables/FbDialogue";

const StartTest = ({
  id,
  title,
  answers,
  SingleAnswer,
  quests,
  handleToggleCheck,
  whichTypeQuestion,
  handleSubmit,
  handleOpen,
  btnText,
  usersAddTheirAns,
  setAnswerSelection,
  answersSelection,
  multipleOption,
  rankedAnswers,
  setRankedAnswers,
  addOptionField,
  addOptionLimit,
  setAddOptionLimit,
  createdBy,
  img,
  alt,
  badgeCount,
  question,
  time
}) => {
  const dispatch = useDispatch();
  const [timeAgo, setTimeAgo] = useState("");
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [copyModal, setCopyModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [twitterModal, setTwitterModal] = useState(false);
  const [fbModal, setFbModal] = useState(false);

  const handleCopyOpen = () => setCopyModal(true);
  const handleCopyClose = () => setCopyModal(false);
  const handleLinkOpen = () => setLinkModal(true);
  const handleLinkClose = () => setLinkModal(false);
  const handleEmailOpen = () => setEmailModal(true);
  const handleEmailClose = () => setEmailModal(false);
  const handleTwitterOpen = () => setTwitterModal(true);
  const handleTwitterClose = () => setTwitterModal(false);
  const handleFbOpen = () => setFbModal(true);
  const handleFbClose = () => setFbModal(false);

  useEffect(() => {
    const updatedAnswersSelection = answers.map((questAnswer) => ({
      label: questAnswer.question,
      check: false,
      contend: false,
    }));
    

    setAnswerSelection(updatedAnswersSelection);
    setRankedAnswers(
      updatedAnswersSelection.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
      })),
    );
  }, [answers]);

  useEffect(() => {
    // Trigger a re-render when answersSelection is updated
  }, [answersSelection]);

  const handleCheckChange = (index, check) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, check } : answer,
      ),
    );
  };

  const handleContendChange = (index, contend) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, contend } : answer,
      ),
    );
  };

  const handleCheckChangeSingle = (index) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index
          ? { ...answer, check: true, contend: false }
          : { ...answer, check: false },
      ),
    );
  };

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentDate = new Date();
      const createdAtDate = new Date(time);

      const timeDifference = currentDate - createdAtDate;
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeAgo(`${days} ${days === 1 ? "day" : "days"} ago`);
      } else if (hours > 0) {
        setTimeAgo(`${hours} ${hours === 1 ? "hour" : "hours"} ago`);
      } else if (minutes > 0) {
        setTimeAgo(`${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`);
      } else {
        setTimeAgo(`${seconds} ${seconds === 1 ? "second" : "seconds"} ago`);
      }
    };

    calculateTimeAgo();
  }, [time]);

  const handleContendChangeSingle = (index) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index
          ? { ...answer, contend: true, check: false }
          : { ...answer, contend: false },
      ),
    );
  };

  function findLabelChecked(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    return labelFound[0]?.check === true;
  }

  function findLabelContend(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    return labelFound[0]?.contend === true;
  }

  const handleOnSortEnd = (sortedItems) => {
    setRankedAnswers(sortedItems.items);
  };

  const customModalStyle = {
    backgroundColor: "#FCFCFD",
    borderRadius: "26px",
    boxShadow: "none",
    border: "0px",
    outline: "none",
  };


  return (
    <>
    <>
      <div className="mt-[11.66px] flex flex-col gap-[5.7px] tablet:mt-[26px] tablet:gap-[10px]">
        {title === "Yes/No" || title === "Agree/Disagree" ? (
          <>
            {title === "Yes/No" ? (
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
                  />
              </>
            ) : (
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
            )}
          </>
        ) : title === "Multiple Choice" ? (
          [...answersSelection].map((item, index) => (
            <SingleAnswerMultipleChoice
            key={index}
            number={"#" + (index + 1)}
            answer={item.label}
            editable={item.edit}
            deleteable={item.delete}
            title={title}
            multipleOption={multipleOption}
            setAddOptionLimit={setAddOptionLimit}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            checkInfo={true}
            check={findLabelChecked(answersSelection, item.label)}
            contend={findLabelContend(answersSelection, item.label)}
            whichTypeQuestion={whichTypeQuestion}
            handleCheckChange={
              multipleOption === true
              ? (check) => handleCheckChange(index, check)
              : (check) => handleCheckChangeSingle(index, check)
            }
            handleContendChange={
              multipleOption === true
              ? (contend) => handleContendChange(index, contend)
              : (contend) => handleContendChangeSingle(index, contend)
            }
            />
            ))
            ) : (
              <SortableList
              items={rankedAnswers}
              setItems={setRankedAnswers}
              onSortEnd={handleOnSortEnd}
              >
            {({ items }) => (
              <div
              id="dragIcon2"
              className="flex flex-col gap-[5.7px] tablet:gap-[16px]"
              >
                {[...items].map((item, index) => (
                  <SortableItem
                  key={item.id}
                  id={item.id}
                  DragHandler={STDropHandler}
                  >
                    <SingleAnswerRankedChoice
                      number={"#" + (index + 1)}
                      editable={item.edit}
                      deleteable={item.delete}
                      answer={item.label}
                      answersSelection={answersSelection}
                      setAnswerSelection={setAnswerSelection}
                      title={title}
                      checkInfo={false}
                      check={findLabelChecked(answersSelection, item.label)}
                      handleCheckChange={(check) =>
                        handleCheckChange(index, check)
                      }
                      setAddOptionLimit={setAddOptionLimit}
                      />
                  </SortableItem>
                ))}
              </div>
            )}
          </SortableList>
        )}

        {/* Add Options Button */}
        {usersAddTheirAns && addOptionLimit === 0 ? (
          <div>
            {title === "Yes/No" ||
            title === "Agree/Disagree" ? null : btnText !== "change answer" ? (
              <button
              onClick={handleOpen}
              className="ml-[55.38px] mt-[11.29px] flex w-fit items-center gap-[5.8px] rounded-[4.734px] bg-[#D9D9D9] px-[10px] py-[3.4px] text-[8.52px] font-normal leading-normal text-[#435059] dark:bg-[#595C60] dark:text-[#BCBCBC] tablet:ml-[135px] tablet:mt-3 tablet:gap-[11.37px] tablet:rounded-[10px] tablet:px-[21px] tablet:py-[10px] tablet:text-[18px]"
              >
                {persistedTheme === "dark" ? (
                  <img
                  src="/assets/svgs/dashboard/add-dark.svg"
                  alt="add"
                  className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                  />
                  ) : (
                    <img
                    src="/assets/svgs/dashboard/add.svg"
                    alt="add"
                    className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                    />
                    )}
                Add Option
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {/* Submit Button */}
      <div
        className={`${
          title === "Multiple Choice"
          ? "mt-8"
          : addOptionField === 1
          ? "mt-[8rem]"
          : "mt-8"
        } mb-8 flex w-full justify-end`}
        >
        <div>
          <button
            className={` ${
              persistedTheme === "dark"
              ? "bg-[#333B46]"
              : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            } inset-0 mr-[14px] w-[82.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#EAEAEA] shadow-inner dark:text-[#B6B6B6] tablet:mr-[30px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
            onClick={() => handleSubmit()}
            >
            Submit
          </button>
        </div>
      </div>
            </>
            <div className="mx-[0.57rem] mb-[0.55rem] mt-[0.86rem] flex items-center justify-between tablet:mx-[2.4rem] tablet:mb-[1.83rem] tablet:mt-[3.99rem]">
        <div className="flex items-center gap-[0.17rem] tablet:gap-[6px]">
          <div onClick={handleCopyOpen} className="cursor-pointer">
            {persistedTheme === "dark" ? <Copy /> : <Copy />}
          </div>
          <BasicModal
            open={copyModal}
            handleClose={handleCopyClose}
            customStyle={customModalStyle}
          >
            <CopyDialogue
              handleClose={handleCopyClose}
              id={id}
              createdBy={createdBy}
              img={img}
              alt={alt}
              badgeCount={badgeCount}
            />
          </BasicModal>
          <div className="cursor-pointer" onClick={handleLinkOpen}>
            {persistedTheme === "dark" ? <Link /> : <Link />}
          </div>
          <BasicModal
            open={linkModal}
            handleClose={handleLinkClose}
            customStyle={customModalStyle}
          >
            <UrlDialogue
              handleClose={handleLinkClose}
              id={id}
              createdBy={createdBy}
              img={img}
              alt={alt}
              badgeCount={badgeCount}
            />
          </BasicModal>
          <div className="cursor-pointer" onClick={handleEmailOpen}>
            {persistedTheme === "dark" ? <Mail /> : <Mail />}
          </div>
          <BasicModal
            open={emailModal}
            handleClose={handleEmailClose}
            customStyle={customModalStyle}
          >
            <EmailDialogue handleClose={handleEmailClose} />
          </BasicModal>
          <div className="cursor-pointer" onClick={handleTwitterOpen}>
            {persistedTheme === "dark" ? <Twitter /> : <Twitter />}
          </div>
          <BasicModal
            open={twitterModal}
            handleClose={handleTwitterClose}
            customStyle={customModalStyle}
          >
            <TwitterDialogue
              handleClose={handleTwitterClose}
              id={id}
              createdBy={createdBy}
              img={img}
              alt={alt}
              badgeCount={badgeCount}
              title={title}
              question={question}
              timeAgo={timeAgo}
            />
          </BasicModal>
          <div className="cursor-pointer" onClick={handleFbOpen}>
            {persistedTheme === "dark" ? <Facebook /> : <Facebook />}
          </div>
          <BasicModal
            open={fbModal}
            handleClose={handleFbClose}
            customStyle={customModalStyle}
          >
            <FbDialogue
              handleClose={handleFbClose}
              createdBy={createdBy}
              img={img}
              alt={alt}
              badgeCount={badgeCount}
              title={title}
              question={question}
              timeAgo={timeAgo}
              id={id}
            />
          </BasicModal>
        </div>
        <div className="flex h-3 w-[53.9px] items-center justify-center gap-[2px] rounded-[4.73px] bg-white dark:bg-[#090A0D] tablet:h-[26px] tablet:w-[114px] tablet:gap-1 tablet:rounded-[10px]">
          <img
            src="/assets/svgs/dashboard/clock-outline.svg"
            alt="clock"
            className="h-[7.64px] w-[7.64px] tablet:h-4 tablet:w-4"
          />
          <p className="text-[6px] font-[400] leading-normal text-[#9C9C9C] tablet:text-[10px]">
            {timeAgo}
          </p>
        </div>
      </div>
    </>
  );
};

export default StartTest;
