import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// components
import Topbar from '../Dashboard/components/Topbar';
import SidebarRight from '../Dashboard/components/SidebarRight';
import QuestionCard from './components/QuestionCard';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useGetSingleQuest } from '../../services/queries/quest';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import Loader from '../../components/ui/Loader';

const Guests = () => {
  let { isFullScreen } = useParams();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState('Participate');
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [submitResponse, setSubmitResponse] = useState();
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    if (isFullScreen !== 'isfullscreen') {
      setStartTest(null);
      setViewResult(null);
    }
  }, [isFullScreen]);

  const { data: singleQuestResp } = useGetSingleQuest(persistedUserInfo?.uuid, location.state);
  console.log("wamniq",singleQuestResp);

  const handleStartTest = useCallback(
    (testId) => {
      setViewResult(null);
      setStartTest((prev) => (prev === testId ? null : testId));
    },
    [setViewResult, setStartTest],
  );

  const handleViewResults = useCallback(
    (testId) => {
      setStartTest(null);
      setViewResult((prev) => (prev === testId ? null : testId));
    },
    [setStartTest, setViewResult],
  );

  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100vh-90px)] bg-white dark:bg-[#242424]">
        <div className="quest-scrollbar w-full overflow-y-auto py-7 tablet:py-[3.81rem]">
          {isFullScreen !== 'isfullscreen' && (
            <div className="mb-7 flex justify-center gap-5 tablet:mb-[3.81rem] tablet:gap-[5.69rem]">
              <button
                className="w-[81.8px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:w-[250px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[23.63px]"
                onClick={() => setTab('Participate')}
              >
                Participate
              </button>
              <button
                className="w-[81.8px] rounded-[7.1px] bg-[#0FB063] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:w-[250px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[23.63px]"
                onClick={() => setTab('Result')}
              >
                Result
              </button>
            </div>
          )}
           
          {singleQuestResp ? (
            <div>
              {isFullScreen !== 'isfullscreen' ? (
                <QuestionCard
                  tab={tab}
                  questStartData={singleQuestResp}
                  id={singleQuestResp?._id}
                  img="/assets/svgs/dashboard/badge.svg"
                  alt="badge"
                  badgeCount={singleQuestResp.getUserBadge?.badges?.length}
                  time={singleQuestResp?.createdAt}
                  title={getQuestionTitle(singleQuestResp?.whichTypeQuestion)}
                  question={singleQuestResp?.Question}
                  answers={singleQuestResp?.QuestAnswers}
                  usersAddTheirAns={singleQuestResp?.usersAddTheirAns}
                  whichTypeQuestion={singleQuestResp?.whichTypeQuestion}
                  btnText={singleQuestResp?.startStatus}
                  startStatus={singleQuestResp?.startStatus}
                  viewResult={viewResult}
                  handleViewResults={handleViewResults}
                  multipleOption={singleQuestResp?.userCanSelectMultiple}
                  QuestTopic={singleQuestResp?.QuestTopic}
                  createdBy={singleQuestResp?.uuid}
                  lastInteractedAt={singleQuestResp?.lastInteractedAt}
                  usersChangeTheirAns={singleQuestResp?.usersChangeTheirAns}
                  setSubmitResponse={setSubmitResponse}
                />
              ) : (
                <div className="px-[25px] tablet:px-[86px]">
                  <QuestionCardWithToggle
                    questStartData={submitResponse ? submitResponse : singleQuestResp}
                    // id={singleQuestResp?._id}
                    img="/assets/svgs/dashboard/badge.svg"
                    alt="badge"
                    // badgeCount={singleQuestResp.getUserBadge?.badges?.length}
                    // time={singleQuestResp?.createdAt}
                    // title={getQuestionTitle(singleQuestResp?.whichTypeQuestion)}
                    // question={singleQuestResp?.Question}
                    // answers={singleQuestResp?.QuestAnswers}
                    // usersAddTheirAns={singleQuestResp?.usersAddTheirAns}
                    // whichTypeQuestion={singleQuestResp?.whichTypeQuestion}
                    // btnText={singleQuestResp?.startStatus}
                    startTest={startTest}
                    setStartTest={setStartTest}
                    viewResult={viewResult}
                    setViewResult={setViewResult}
                    handleViewResults={handleViewResults}
                    handleStartTest={handleStartTest}
                    // multipleOption={singleQuestResp?.userCanSelectMultiple}
                    // QuestTopic={singleQuestResp?.QuestTopic}
                    // createdBy={singleQuestResp?.uuid}
                    // lastInteractedAt={singleQuestResp?.lastInteractedAt}
                    // usersChangeTheirAns={singleQuestResp?.usersChangeTheirAns}
                    // startStatus={singleQuestResp?.startStatus}
                    expandedView={true}
                    setSubmitResponse={setSubmitResponse}
                  />
                </div>
              )}
            </div>
          ):<Loader/>}
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default Guests;
