import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Copy from '../../assets/Copy';
import Link from '../../assets/Link';
import Mail from '../../assets/Mail';
import Twitter from '../../assets/Twitter';
import Facebook from '../../assets/Facebook';
import BasicModal from '../BasicModal';
import CopyDialogue from '../question-card/Shareables/CopyDialogue';
import UrlDialogue from '../question-card/Shareables/UrlDialogue';
import EmailDialogue from '../question-card/Shareables/EmailDialogue';
import TwitterDialogue from '../question-card/Shareables/TwitterDialogue';
import FbDialogue from '../question-card/Shareables/FbDialogue';
import { useParams, useNavigate } from 'react-router-dom';

const QuestBottombar = ({
  time,
  id,
  createdBy,
  img,
  alt,
  uniqueShareLink,
  badgeCount,
  title,
  question,
  questStartData,
  isQuestHidden,
}) => {
  const navigate = useNavigate();

  const { isFullScreen } = useParams();
  const persistedTheme = useSelector((state) => state.utils.theme);

  const [timeAgo, setTimeAgo] = useState('');
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
        setTimeAgo('Invalid date');
        return;
      }

      const timeDifference = currentDate - createdAtDate;
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeAgo(`${days} ${days === 1 ? 'day' : 'days'} ago`);
      } else if (hours > 0) {
        setTimeAgo(`${hours} ${hours === 1 ? 'hour' : 'hours'} ago`);
      } else if (minutes > 0) {
        setTimeAgo(`${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`);
      } else {
        setTimeAgo(`${seconds} ${seconds === 1 ? 'sec' : 'secs'} ago`);
      }
    };

    calculateTimeAgo();
  }, [time]);

  const customModalStyle = {
    backgroundColor: '#FCFCFD',
    boxShadow: 'none',
    border: '0px',
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div
      className={`flex items-center border-t-2 border-[#D9D9D9] px-[0.57rem] py-2 tablet:px-5 tablet:py-[0.63rem] ${isQuestHidden === 'HiddenPosts' ? 'justify-end' : 'justify-between'}`}
    >
      {isQuestHidden !== 'HiddenPosts' && (
        <div className="flex items-center gap-[0.17rem] tablet:gap-[6px] min-w-[70px] tablet:min-w-[160px]">
          <div onClick={handleCopyOpen} className="cursor-pointer">
            {persistedTheme === 'dark' ? <Copy /> : <Copy />}
          </div>
          <BasicModal
            open={copyModal}
            handleClose={handleCopyClose}
            customStyle={customModalStyle}
            customClasses="rounded-[10px] tablet:rounded-[26px]"
          >
            <CopyDialogue
              handleClose={handleCopyClose}
              id={id}
              uniqueShareLink={uniqueShareLink}
              createdBy={createdBy}
              img={img}
              alt={alt}
              badgeCount={badgeCount}
            />
          </BasicModal>
          {/* <div className="cursor-pointer" onClick={handleLinkOpen}>
          {persistedTheme === 'dark' ? <Link /> : <Link />}
        </div>
        <BasicModal open={linkModal} handleClose={handleLinkClose} customStyle={customModalStyle}>
          <UrlDialogue
            handleClose={handleLinkClose}
            id={id}
            createdBy={createdBy}
            img={img}
            alt={alt}
            badgeCount={badgeCount}
          />
        </BasicModal> */}
          {/* <div className="cursor-pointer" onClick={handleEmailOpen}>
          {persistedTheme === 'dark' ? <Mail /> : <Mail />}
        </div> */}
          {/* <BasicModal
          open={emailModal}
          handleClose={handleEmailClose}
          customStyle={customModalStyle}
          customClasses="rounded-[10px] tablet:rounded-[26px]"
        >
          <EmailDialogue handleClose={handleEmailClose} id={id} />
        </BasicModal> */}
          {/* <div className="cursor-pointer" onClick={handleTwitterOpen}>
          {persistedTheme === 'dark' ? <Twitter /> : <Twitter />}
        </div>
        <BasicModal
          open={twitterModal}
          handleClose={handleTwitterClose}
          customStyle={customModalStyle}
          customClasses="rounded-[10px] tablet:rounded-[26px]"
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
        <div className="cursor-pointer border-r border-[#D9D9D9] pr-2 tablet:pr-5" onClick={handleFbOpen}>
          {persistedTheme === 'dark' ? <Facebook /> : <Facebook />}
        </div>
        <BasicModal
          open={fbModal}
          handleClose={handleFbClose}
          customStyle={customModalStyle}
          customClasses="rounded-[10px] tablet:rounded-[26px]"
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
        </BasicModal> */}
        </div>
      )}

      {(isQuestHidden !== 'HiddenPosts' && !window.location.href.includes("/p/")) && (
        <div className="min-w-[70px] tablet:min-w-[160px] flex justify-center">
         
          {isFullScreen === undefined ? (
            <div
              className="flex cursor-pointer items-center justify-end gap-1 text-[#85898C] dark:text-[#ACACAC] tablet:gap-[0.66rem] "
              onClick={() => {
                navigate('/quest/isfullscreen', {
                  state: questStartData._id,
                });
              }}
            >
              <svg
                className="h-3 w-3 tablet:h-[23px] tablet:w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 23"
                fill="none"
              >
                <path
                  d="M6.30165 0H0.943359C0.422241 0 0 0.477316 0 1.06641V7.10938C0 7.69846 0.422241 8.17578 0.943359 8.17578C1.46448 8.17578 1.88672 7.69846 1.88672 7.10938V2.13281H6.30165C6.82277 2.13281 7.24501 1.6555 7.24501 1.06641C7.24501 0.477316 6.82277 0 6.30165 0ZM18.5527 13.8633C18.0316 13.8633 17.6094 14.3406 17.6094 14.9297V19.9062H13.2258C12.7046 19.9062 12.2824 20.3836 12.2824 20.9727C12.2824 21.5617 12.7046 22.0391 13.2258 22.0391H18.5527C19.0739 22.0391 19.4961 21.5617 19.4961 20.9727V14.9297C19.4961 14.3406 19.0739 13.8633 18.5527 13.8633ZM6.30165 19.9062H1.88672V14.9297C1.88672 14.3406 1.46448 13.8633 0.943359 13.8633C0.422241 13.8633 0 14.3406 0 14.9297V20.9727C0 21.5617 0.422241 22.0391 0.943359 22.0391H6.30165C6.82277 22.0391 7.24501 21.5617 7.24501 20.9727C7.24501 20.3836 6.82277 19.9062 6.30165 19.9062ZM18.5527 0H13.2258C12.7046 0 12.2824 0.477316 12.2824 1.06641C12.2824 1.6555 12.7046 2.13281 13.2258 2.13281H17.6094V7.10938C17.6094 7.69846 18.0316 8.17578 18.5527 8.17578C19.0739 8.17578 19.4961 7.69846 19.4961 7.10938V1.06641C19.4961 0.477316 19.0739 0 18.5527 0Z"
                  fill="#85898C"
                />
              </svg>
              <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem] laptop:text-[1.25rem]">
                Full Screen
              </p>
            </div>
          ) : (
            <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem]">&#x200B;</p>
          )}
        </div>
      )}

      {/* <div className="border-l border-[#D9D9D9] tablet:pl-5 min-w-[70px] tablet:min-w-[160px]"> */}
      <div className="min-w-[70px] tablet:min-w-[160px] flex justify-end">
        <div className="flex h-4 w-fit items-center gap-[0.44rem] rounded-[0.625rem] md:h-[1.75rem]">
          {persistedTheme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 19"
              fill="none"
              className="h-2 w-2 tablet:h-[19px] tablet:w-[18px]"
            >
              <path
                d="M9.24484 18.3643C4.44763 18.3643 0.54541 14.4552 0.54541 9.64956C0.54541 4.8439 4.44763 0.934814 9.24484 0.934814C14.0421 0.934814 17.9443 4.8439 17.9443 9.64956C17.9443 14.4552 14.0414 18.3643 9.24484 18.3643ZM9.24484 2.32917C5.21526 2.32917 1.93732 5.61289 1.93732 9.64956C1.93732 13.6862 5.21526 16.9699 9.24484 16.9699C13.2744 16.9699 16.5524 13.6862 16.5524 9.64956C16.5524 5.61289 13.2737 2.32917 9.24484 2.32917ZM9.18916 10.291H4.72114C4.53656 10.291 4.35954 10.2175 4.22902 10.0868C4.09851 9.95602 4.02518 9.77869 4.02518 9.59379C4.02518 9.40888 4.09851 9.23155 4.22902 9.10081C4.35954 8.97006 4.53656 8.89661 4.72114 8.89661H8.49321V3.72353C8.49321 3.53863 8.56653 3.3613 8.69705 3.23055C8.82757 3.09981 9.00459 3.02635 9.18916 3.02635C9.37374 3.02635 9.55076 3.09981 9.68128 3.23055C9.8118 3.3613 9.88512 3.53863 9.88512 3.72353V9.59379C9.88512 9.77869 9.8118 9.95602 9.68128 10.0868C9.55076 10.2175 9.37374 10.291 9.18916 10.291Z"
                fill="white"
              />
            </svg>
          ) : (
            <img
              src="/assets/svgs/dashboard/clock-outline.svg"
              alt="clock"
              className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
            />
          )}

          <h4 className="whitespace-nowrap text-[0.51638rem] font-normal text-[#9C9C9C] dark:text-white tablet:text-[1.13531rem] laptop:text-[1.32569rem]">
            {timeAgo}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default QuestBottombar;
