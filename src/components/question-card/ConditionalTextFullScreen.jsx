import { useNavigate, useParams } from "react-router-dom";
import QuestTimeRemaining from "../../pages/Dashboard/pages/QuestStartSection/components/QuestTimeRemaining";

const ConditionalTextFullScreen = ({
  show,
  answersSelection,
  rankedAnswers,
  questStartData,
}) => {
  const { isFullScreen } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pb-[0.62rem] pl-[2.19rem] pr-12 pt-[0.56rem] tablet:pb-[1.44rem] tablet:pl-20 tablet:pt-[1.2rem]">
      <QuestTimeRemaining
        lastInteractedAt={localStorage.getItem("lastInteractedAt")}
        howManyTimesAnsChanged={localStorage.getItem("howManyTimesAnsChanged")}
        usersChangeTheirAns={localStorage.getItem("usersChangeTheirAns")}
        show={show}
      />
      {(isFullScreen === undefined && answersSelection?.length > 6) ||
      (isFullScreen === undefined && rankedAnswers?.length > 6) ? (
        <div
          className="flex cursor-pointer items-center justify-end gap-1 text-[#435059] tablet:gap-[0.66rem] dark:text-[#ACACAC] "
          onClick={() => {
            navigate(`/quest/${questStartData._id}/isfullscreen`);
          }}
        >
          <svg
            className="h-[23px] w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 23"
            fill="none"
          >
            <path
              d="M6.30165 0H0.943359C0.422241 0 0 0.477316 0 1.06641V7.10938C0 7.69846 0.422241 8.17578 0.943359 8.17578C1.46448 8.17578 1.88672 7.69846 1.88672 7.10938V2.13281H6.30165C6.82277 2.13281 7.24501 1.6555 7.24501 1.06641C7.24501 0.477316 6.82277 0 6.30165 0ZM18.5527 13.8633C18.0316 13.8633 17.6094 14.3406 17.6094 14.9297V19.9062H13.2258C12.7046 19.9062 12.2824 20.3836 12.2824 20.9727C12.2824 21.5617 12.7046 22.0391 13.2258 22.0391H18.5527C19.0739 22.0391 19.4961 21.5617 19.4961 20.9727V14.9297C19.4961 14.3406 19.0739 13.8633 18.5527 13.8633ZM6.30165 19.9062H1.88672V14.9297C1.88672 14.3406 1.46448 13.8633 0.943359 13.8633C0.422241 13.8633 0 14.3406 0 14.9297V20.9727C0 21.5617 0.422241 22.0391 0.943359 22.0391H6.30165C6.82277 22.0391 7.24501 21.5617 7.24501 20.9727C7.24501 20.3836 6.82277 19.9062 6.30165 19.9062ZM18.5527 0H13.2258C12.7046 0 12.2824 0.477316 12.2824 1.06641C12.2824 1.6555 12.7046 2.13281 13.2258 2.13281H17.6094V7.10938C17.6094 7.69846 18.0316 8.17578 18.5527 8.17578C19.0739 8.17578 19.4961 7.69846 19.4961 7.10938V1.06641C19.4961 0.477316 19.0739 0 18.5527 0Z"
              fill="#435059"
            />
          </svg>
          <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem]">
            Full Screen
          </p>
        </div>
      ) : (
        <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem]">
          &#x200B;
        </p>
      )}
    </div>
  );
};

export default ConditionalTextFullScreen;
