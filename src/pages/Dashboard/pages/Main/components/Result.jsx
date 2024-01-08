import { useSelector } from "react-redux";
import { getQuests } from "../../../../../features/quest/questsSlice";
import { useQuery } from "@tanstack/react-query";
import { getStartQuestPercent } from "../../../../../api/questsApi";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { getRankedQuestPercent } from "../../../../../api/questsApi";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SingleAnswer from "../../../components/SingleAnswer";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
import RankedResult from "../../../components/RankedResult";

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
import { useParams } from "react-router-dom";

const Result = (props) => {
  const quests = useSelector(getQuests);
  const { isFullScreen } = useParams();
  const persistedTheme = useSelector((state) => state.utils.theme);

  const [timeAgo, setTimeAgo] = useState("");
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

  function updateAnswerSelection(apiResponse, answerSelectionArray) {
    answerSelectionArray.forEach((item, index) => {
      // Check in selected array
      if (
        apiResponse.selected.some(
          (selectedItem) => selectedItem.question === item.label,
        )
      ) {
        answerSelectionArray[index].check = true;
      }

      // Check in contended array
      if (
        apiResponse.contended.some(
          (contendedItem) => contendedItem.question === item.label,
        )
      ) {
        answerSelectionArray[index].contend = true;
      }
    });
    props.setAnswerSelection(answerSelectionArray);
  }

  useEffect(() => {
    const data = {
      questForeignKey: props.id,
      uuid: localStorage.getItem("uId"),
    };
    getStartQuestDetail(data);
  }, []);

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentDate = new Date();
      const createdAtDate = new Date(props.time);

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
        setTimeAgo(`${minutes} ${minutes === 1 ? "min" : "mins"} ago`);
      } else {
        setTimeAgo(`${seconds} ${seconds === 1 ? "sec" : "secs"} ago`);
      }
    };

    calculateTimeAgo();
  }, [props.time]);

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      // console.log(res?.data?.data);
      // console.log(props.whichTypeQuestion);
      if (res.data) {
        if (
          props.whichTypeQuestion === "agree/disagree" ||
          props.whichTypeQuestion === "yes/no"
        ) {
          props.setHowManyTimesAnsChanged(res?.data.data.length);
          if (
            res?.data.data[res.data.data.length - 1].selected === "Agree" ||
            res?.data.data[res.data.data.length - 1].selected === "Yes"
          ) {
            console.log("ran 1");
            props.handleToggleCheck(
              res.data.data[res.data.data.length - 1].selected,
              true,
              false,
            );
          }
          if (
            res?.data.data[res.data.data.length - 1].contended === "Agree" ||
            res?.data.data[res.data.data.length - 1].contended === "Yes"
          ) {
            console.log("ran 2");

            props.handleToggleCheck(
              res.data.data[res.data.data.length - 1].contended,
              false,
              true,
            );
          }
          if (
            res?.data.data[res.data.data.length - 1].contended === "Disagree" ||
            res?.data.data[res.data.data.length - 1].contended === "No"
          ) {
            console.log("ran 3");

            props.handleToggleCheck(
              res.data.data[res.data.data.length - 1].contended,
              false,
              true,
            );
          }
          if (
            res?.data.data[res.data.data.length - 1].selected === "Disagree" ||
            res?.data.data[res.data.data.length - 1].selected === "No"
          ) {
            console.log("ran 4");

            props.handleToggleCheck(
              res.data.data[res.data.data.length - 1].selected,
              true,
              false,
            );
          }
        }

        if (props.whichTypeQuestion === "multiple choise") {
          updateAnswerSelection(
            res?.data.data[res.data.data.length - 1],
            props.answersSelection,
          );
        }
        if (props.whichTypeQuestion === "ranked choise") {
          console.log(
            "ranked response" +
              res?.data.data[res.data.data.length - 1].selected,
          );

          const updatedRankedAnswers = res?.data.data[
            res.data.data.length - 1
          ].selected.map((item) => {
            const correspondingRankedAnswer = props.rankedAnswers.find(
              (rankedItem) => rankedItem.label === item.question,
            );

            if (correspondingRankedAnswer) {
              return {
                id: correspondingRankedAnswer.id,
                label: correspondingRankedAnswer.label,
                check: false,
                contend: false,
              };
            }

            return null;
          });
          // Filter out any null values (items not found in rankedAnswers)
          const filteredRankedAnswers = updatedRankedAnswers.filter(Boolean);

          // Update the state with the new array
          props.setRankedAnswers(filteredRankedAnswers);
        }
      }
    },
    onError: (err) => {
      toast.error(err.response?.data);
      console.log("Mutation Error", err);
    },
  });

  const { data: ResultsData } = useQuery({
    queryFn: async () => {
      const params = {
        questForeignKey: props.id,
        uuid: localStorage.getItem("uId"),
      };
      if (props.whichTypeQuestion === "ranked choise") {
        return await getRankedQuestPercent(params);
      } else {
        return await getStartQuestPercent(params);
      }
    },
    queryKey: ["ResultsData", props.id],
  });

  function findLabelChecked(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    if (labelFound[0]?.check === true) {
      return true;
    } else {
      return false;
    }
  }

  function findLabelContend(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    if (labelFound[0]?.contend === true) {
      return true;
    } else {
      return false;
    }
  }

  const customModalStyle = {
    backgroundColor: "#FCFCFD",
    borderRadius: "26px",
    boxShadow: "none",
    border: "0px",
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      <div className="mx-1 mt-[23.7px] flex flex-col gap-[5.7px] tablet:mt-[38px] tablet:gap-[10px] ">
        {props.title === "Yes/No" || props.title === "Agree/Disagree" ? (
          <>
            {props.title === "Yes/No" ? (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Yes"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.yesNo.yes.check}
                  contend={quests.yesNo.yes.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"No"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.yesNo.no.check}
                  contend={quests.yesNo.no.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
              </>
            ) : props.title === "Agree/Disagree" ? (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Agree"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.agreeDisagree.agree.check}
                  contend={quests.agreeDisagree.agree.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"Disagree"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.agreeDisagree.disagree.check}
                  contend={quests.agreeDisagree.disagree.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
              </>
            ) : null}
          </>
        ) : props.title === "Multiple Choice" ? (
          <div
            className={`${
              isFullScreen === undefined
                ? "quest-scrollbar max-h-[250px] min-h-fit overflow-auto md:max-h-[496px] tablet:max-h-[23.2rem]"
                : ""
            }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
          >
            {props.answers?.map((item, index) => (
              <SingleAnswerMultipleChoice
                number={"#" + (index + 1)}
                answer={item.question}
                addedAnswerUuid={item.uuid}
                title={props.title}
                checkInfo={true}
                percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                check={findLabelChecked(props.answersSelection, item.question)}
                contend={findLabelContend(
                  props.answersSelection,
                  item.question,
                )}
                btnText={"Results"}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
              />
            ))}
          </div>
        ) : props.title === "Ranked Choice" ? (
          <div
            className={`${
              isFullScreen === undefined
                ? "quest-scrollbar max-h-[250px] min-h-fit overflow-auto md:max-h-[496px]"
                : ""
            }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
          >
            {props.rankedAnswers?.map((item, index) => (
              <RankedResult
                number={"#" + (index + 1)}
                answer={item.label}
                addedAnswerUuid={item.uuid}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                title={props.title}
                percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                checkInfo={false}
                setAddOptionLimit={props.setAddOptionLimit}
                btnText={"Results"}
              />
            ))}
          </div>
        ) : null}

        {props.expanded && props.btnText === "change answer" ? (
          <div className="mt-2.5 flex justify-end tablet:mt-8">
            <button
              className="inset-0 mr-[14.4px] h-[23.48px] w-[81.8px] rounded-[7.1px] bg-[#FDD503] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-white shadow-inner tablet:mr-[30px] tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:bg-[#BB9D02]"
              onClick={() => {
                props.handleChange(props.id);
              }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end tablet:mt-10">
            <button
              className={`${
                persistedTheme === "dark"
                  ? "bg-[#333B46]"
                  : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
              } inset-0 mr-[14px] h-[23.48px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-[#FFF] shadow-inner tablet:mr-[30px] tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:text-[#B6B6B6]`}
              onClick={() => {
                props.handleViewResults(null);
              }}
            >
              Ok
            </button>
          </div>
        )}
      </div>
      <div className="mt-7 flex items-center justify-between border-t-2 border-[#D9D9D9] px-[0.57rem] pb-[0.55rem] pt-[0.86rem] tablet:px-[1.37rem] tablet:py-[0.85rem]">
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
              id={props.id}
              createdBy={props.createdBy}
              img={props.img}
              alt={props.alt}
              badgeCount={props.badgeCount}
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
              id={props.id}
              createdBy={props.createdBy}
              img={props.img}
              alt={props.alt}
              badgeCount={props.badgeCount}
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
            <EmailDialogue handleClose={handleEmailClose} id={props.id} />
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
              id={props.id}
              createdBy={props.createdBy}
              img={props.img}
              alt={props.alt}
              badgeCount={props.badgeCount}
              title={props.title}
              question={props.question}
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
              createdBy={props.createdBy}
              img={props.img}
              alt={props.alt}
              badgeCount={props.badgeCount}
              title={props.title}
              question={props.question}
              timeAgo={timeAgo}
              id={props.id}
            />
          </BasicModal>
        </div>
        <div className="flex h-4 items-center justify-center gap-[2px] rounded-[4.73px] bg-white px-2 tablet:h-[29px] tablet:gap-1 tablet:rounded-[10.9px] dark:bg-[#090A0D]">
          <img
            src="/assets/svgs/dashboard/clock-outline.svg"
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[18px] tablet:w-[18px]"
          />
          <p className="text-[8.5px] font-[400] leading-normal text-[#9C9C9C] tablet:text-[17.48px]">
            {timeAgo}
          </p>
        </div>
      </div>
    </>
  );
};

export default Result;
