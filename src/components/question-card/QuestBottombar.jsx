import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Copy from "../../assets/Copy";
import Link from "../../assets/Link";
import Mail from "../../assets/Mail";
import Twitter from "../../assets/Twitter";
import Facebook from "../../assets/Facebook";
import BasicModal from "../BasicModal";
import CopyDialogue from "../question-card/Shareables/CopyDialogue";
import UrlDialogue from "../question-card/Shareables/UrlDialogue";
import EmailDialogue from "../question-card/Shareables/EmailDialogue";
import TwitterDialogue from "../question-card/Shareables/TwitterDialogue";
import FbDialogue from "../question-card/Shareables/FbDialogue";

const QuestBottombar = ({
  time,
  id,
  createdBy,
  img,
  alt,
  badgeCount,
  title,
  question,
}) => {
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

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentDate = new Date();
      const createdAtDate = new Date(time);

      if (isNaN(createdAtDate.getTime())) {
        setTimeAgo("Invalid date");
        return;
      }

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
          <EmailDialogue handleClose={handleEmailClose} id={id} />
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
  );
};

export default QuestBottombar;
