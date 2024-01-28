import { useSelector } from 'react-redux';
import Close from '../../../assets/Close';
import Twitter from '../../../assets/Twitter';
import CardTopbar from '../CardTopbar';
import QuestBottombar from '../QuestBottombar';
import { Button } from '../../ui/Button';

const TwitterDialogue = ({ handleClose, createdBy, img, alt, badgeCount, title, question, timeAgo, id }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/quest/${id}`;

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="relative rounded-t-[9.251px] social-blue-gradiant flex gap-[10px] tablet:gap-4 items-center py-1 tablet:py-[8px] px-[15px] tablet:px-[30px] tablet:rounded-t-[26px]">
        <div className="bg-black p-[5px] tablet:p-[10px] rounded-full w-fit">
          <Twitter color="white" />
        </div>
        <p className="text-white text-[12px] tablet:text-[20px] font-semibold tablet:font-medium">Twitter</p>
        <div
          className="absolute right-[12px] top-[14px] cursor-pointer tablet:right-[26px] tablet:top-1/2 tablet:-translate-y-1/2"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="w-[8px] h-[8px] tablet:w-[23px] tablet:h-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>
      <div className="px-6 pt-[19.84px] tablet:pt-7 tablet:px-[27px] pb-[17px] border-2 border-[#D9D9D9] mt-1">
        {/* QuestionCard Preview */}
        <div className="w-full rounded-[9.8px] tablet:rounded-[15px] border-2 border-[#D9D9D9]">
          <CardTopbar badgeCount={5} QuestTopic="Technology" />
          <div className="pb-[0.94rem] pt-[0.84rem] tablet:pb-5 tablet:pt-[0.94rem]">
            <div className="ml-[1.39rem] mr-[0.62rem] tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem]">
              <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem] leading-none">
                {question?.endsWith('?') ? 'Q.' : 'S.'} {question}
              </h4>
            </div>
            {/* Children */}
          </div>
          <div className="my-[16.2px] tablet:my-[24px] pr-[30px] flex w-full justify-end gap-[19.14px] tablet:gap-[42px]">
            <button className="w-[81.8px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[18px]">
              Start
            </button>
            <button className="w-[78px] rounded-[7.1px] border-[1.42px] border-[#20D47E] px-[7.1px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#20D47E] tablet:w-[173px] tablet:rounded-[15px] tablet:border-[3px] tablet:px-5 tablet:py-2 tablet:text-[18px] dark:border-[#7C7C7C] dark:text-[#C9C8C8]">
              Results
            </button>
          </div>
          <QuestBottombar
            time={timeAgo}
            // id={questStartData._id}
            // createdBy={questStartData.uuid}
            // title={getQuestionTitle(questStartData.whichTypeQuestion)}
            // question={questStartData.Question}
            img={'assets/svgs/dashboard/badge.svg'}
            alt={'badge'}
            badgeCount={5}
          />
          {/* <div className="flex items-start justify-between">
            {createdBy === persistedUserInfo?.uuid ? (
              <div className="relative h-fit pb-[15px]">
                <img
                  src="/assets/svgs/dashboard/MeBadge.svg"
                  alt={alt}
                  className="h-[18.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]"
                />
                <p className="absolute left-[50%] top-[24%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[9px] font-[400] leading-normal text-[#7A7016] tablet:top-[39%] tablet:pb-3 tablet:text-[24px]">
                  {persistedUserInfo?.badges?.length}
                </p>
              </div>
            ) : (
              <div className="relative h-fit pb-[15px]">
                <img src={img} alt={alt} className="h-[18.379px] w-[22.722px] tablet:h-[60px] tablet:w-[48px]" />
                <p className="absolute left-[50%] top-[24%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[9px] font-[400] leading-normal text-[#F6F6F6] tablet:top-[39%] tablet:pb-3 tablet:text-[24px]">
                  {badgeCount}
                </p>
              </div>
            )}
            <div>
              <h1 className="text-[8.25px] font-semibold leading-normal text-[#5B5B5B] tablet:text-[22px]">{title}</h1>
              <p className="text-center text-[5.2px] font-medium leading-normal text-[#9A9A9A] tablet:text-[14px]">
                Technology
              </p>
            </div>
            <p></p>
          </div> */}
          {/* <h1 className="mt-[7px] text-[7.58px] font-medium leading-normal text-[#7C7C7C] tablet:text-[20px] tablet:font-semibold">
            {question?.endsWith('?') ? 'Q.' : 'S.'} {question}
          </h1> */}

          {/* <div className="mt-[11.36px] flex h-3 w-full items-center justify-end gap-[2px] rounded-[4.73px] tablet:mt-[30px] tablet:h-[26px] tablet:gap-1 tablet:rounded-[10px]">
            <img
              src="/assets/svgs/dashboard/clock-outline.svg"
              alt="clock"
              className="h-[7.64px] w-[7.64px] tablet:h-4 tablet:w-4"
            />
            <p className="text-[6px] font-[400] leading-normal text-[#9C9C9C] tablet:text-[10px]">{timeAgo}</p>
          </div> */}
        </div>
      </div>
      {/* Share Buttons */}
      <div className="mt-[18.51px] flex flex-col items-center justify-center gap-3 tablet:my-5 laptop:flex-row laptop:gap-[43px]">
        <a
          className="w-[212px] rounded-[5.56px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-center text-[12px] font-semibold leading-normal text-white tablet:w-[341px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] laptop:w-[212px]"
          href={`https://twitter.com/intent/tweet?text=${url}`}
          target="_blank"
        >
          Share a Post
        </a>
        <button className="w-[212px] rounded-[5.56px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[12px] font-semibold leading-normal text-white tablet:w-[341px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]">
          Send in a Personal Message
        </button>
      </div>
    </div>
  );
};

export default TwitterDialogue;
