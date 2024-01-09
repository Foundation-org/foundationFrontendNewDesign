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
import Cookies from "js-cookie";

const OptionBar = ({
  id,
  btnText,
  btnColor,
  handleStartTest,
  handleViewResults,
  answersSelection,
  time,
  setHowManyTimesAnsChanged,
  whichTypeQuestion,
  handleToggleCheck,
  setAnswerSelection,
  rankedAnswers,
  setRankedAnswers,
  startStatus,
  createdBy,
  img,
  alt,
  badgeCount,
  title,
  question,
  setLoadingDetail
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
    setAnswerSelection(answerSelectionArray);
  }

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      console.log("resp", res.data.data);
      console.log({ whichTypeQuestion });
      setHowManyTimesAnsChanged(res.data.data.length);
      if (
        whichTypeQuestion === "agree/disagree" ||
        whichTypeQuestion === "yes/no" ||
        whichTypeQuestion === "like/unlike"
      ) {

        if (
          res?.data.data[res.data.data.length - 1].selected === "Agree" ||
          res?.data.data[res.data.data.length - 1].selected === "Yes" ||
          res?.data.data[res.data.data.length - 1].selected === "Like"
        ) {
          console.log("ran 1");
         handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
        if (
          res?.data.data[res.data.data.length - 1].contended === "Agree" ||
          res?.data.data[res.data.data.length - 1].contended === "Yes" ||
          res?.data.data[res.data.data.length - 1].contended === "Like"
        ) {
          console.log("ran 2");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res?.data.data[res.data.data.length - 1].contended === "Disagree" ||
          res?.data.data[res.data.data.length - 1].contended === "No" ||
          res?.data.data[res.data.data.length - 1].contended === "Unlike"
        ) {
          console.log("ran 3");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res?.data.data[res.data.data.length - 1].selected === "Disagree" ||
          res?.data.data[res.data.data.length - 1].selected === "No" ||
          res?.data.data[res.data.data.length - 1].selected === "Unlike"
        ) {
          console.log("ran 4");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
      }
      if (whichTypeQuestion === "multiple choise") {
        updateAnswerSelection(
          res?.data.data[res.data.data.length - 1],
          answersSelection,
        );
      }
      if (whichTypeQuestion === "ranked choise") {
        console.log(
          "ranked response" + res?.data.data[res.data.data.length - 1].selected,
        );

        const updatedRankedAnswers = res?.data.data[
          res.data.data.length - 1
        ].selected.map((item) => {
          const correspondingRankedAnswer = rankedAnswers.find(
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
        setRankedAnswers(filteredRankedAnswers);
      }
      setLoadingDetail(false);
    },
    onError: (err) => {
      toast.error(err.response?.data);
      console.log("Mutation Error", err);
      setLoadingDetail(false);
    },
  });

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
        setTimeAgo(`${minutes} ${minutes === 1 ? "min" : "mins"} ago`);
      } else {
        setTimeAgo(`${seconds} ${seconds === 1 ? "sec" : "secs"} ago`);
      }
    };

    calculateTimeAgo();
  }, [time]);

  const handleStartChange = () => {
    if (btnText === "") {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === "change answer") {
      setLoadingDetail(true);
      const data = { questForeignKey: id, uuid: Cookies.get("uId") };
      getStartQuestDetail(data);
      handleStartTest(id);
    }
    if (btnText === "completed") {
      setLoadingDetail(true);
      handleViewResults(id);
    }
  };

  function getButtonText(btnText) {
    switch (btnText) {
      case "completed":
        return "Completed";
      case "change answer":
        return "Change";
      default:
        return "Start";
    }
  }

  function getButtonClassName(persistedTheme, btnText, btnColor) {
    if (persistedTheme === "dark") {
      switch (btnText) {
        case "completed":
          return "bg-[#148339]";
        case "change answer":
          return "bg-[#BB9D02]";
        default:
          return "inset-0 rounded-[15px] border-[1px] border-[#333B46] bg-[#333B46] shadow-inner";
      }
    } else {
      return btnColor;
    }
  }

  const customModalStyle = {
    backgroundColor: "#FCFCFD",
    boxShadow: "none",
    border: "0px",
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      <div className="mb-1 flex items-center">
        <div className="mr-[14.4px] flex w-full justify-end gap-2 tablet:mr-[30px] tablet:gap-10">
          {getButtonText(btnText) !== "Completed" ? (
            <button
              className={`${getButtonClassName(
                persistedTheme,
                btnText,
                btnColor,
              )} mt-[16.2px] h-[23.48px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-white tablet:mt-12 tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
              onClick={handleStartChange}
            >
              {getButtonText(btnText)}
            </button>
          ) : null}

          <button
            className={`${
              startStatus?.trim() !== ""
                ? "border-none bg-[#04AD66] text-white dark:bg-[#707175] dark:text-white"
                : "border-[#20D47E] dark:border-[#7C7C7C]"
            } mt-[16.2px] h-[23.48px] w-[81.8px] rounded-[7.1px] border-[1.42px] border-[#20D47E] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-[#20D47E] tablet:mt-12 tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:border-[3px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:border-[#7C7C7C] dark:text-[#C9C8C8]`}
            onClick={() => {
              if (btnText !== "") {
                handleViewResults(id);
              } else {
                toast.error("First Start this question to see Results");
              }
            }}
          >
            Results
          </button>
        </div>
      </div>

      {/* Social shareable icons & Timestamp */}
      <div className="mt-7 flex items-center justify-between border-t-2 border-[#D9D9D9] px-[0.57rem] py-[0.4rem] tablet:px-[1.37rem] tablet:py-[0.85rem] dark:border-white">
        <div className="flex items-center gap-[0.17rem] tablet:gap-[6px]">
          <div onClick={handleCopyOpen} className="cursor-pointer">
            {persistedTheme === "dark" ? <Copy /> : <Copy />}
          </div>
          <BasicModal
            open={copyModal}
            handleClose={handleCopyClose}
            customStyle={customModalStyle}
            customClasses="rounded-[9.251px] laptop:rounded-[26px]"
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
            customClasses="rounded-[9.251px] laptop:rounded-[26px]"
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
            customClasses="rounded-[9.251px] laptop:rounded-[26px]"
          >
            <EmailDialogue handleClose={handleEmailClose} id={id} />
          </BasicModal>
          <div className="cursor-pointer" onClick={handleTwitterOpen}>
            {persistedTheme === "dark" ? <Twitter /> : <Twitter />}
          </div>
          <BasicModal
            open={twitterModal}
            handleClose={handleTwitterClose}
            customStyle={customModalStyle}
            customClasses="rounded-[9.251px] laptop:rounded-[26px]"
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
            customClasses="rounded-[9.251px] laptop:rounded-[26px]"
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
        <div className="flex h-4 w-[63.9px] items-center justify-center gap-[2px] rounded-[4.73px] bg-white tablet:h-[29px] tablet:w-[150px] tablet:gap-1 tablet:rounded-[10.9px] dark:bg-[#090A0D]">
          <img
            src="/assets/svgs/dashboard/clock-outline.svg"
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[18px] tablet:w-[18px]"
          />
          <p className="whitespace-nowrap text-[8.5px] font-[400] leading-normal text-[#9C9C9C] tablet:text-[18px]">
            {timeAgo}
          </p>
        </div>
      </div>
    </>
  );
};

export default OptionBar;
