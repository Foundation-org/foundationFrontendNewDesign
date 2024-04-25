import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// components
import Topbar from '../Dashboard/components/Topbar';
import QuestionCard from './components/QuestionCard';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useGetSingleQuest } from '../../services/queries/quest';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import Loader from '../../components/ui/Loader';
import DashboardLayout from '../Dashboard/components/DashboardLayout';

const Guests = () => {
  let { isFullScreen } = useParams();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState('Participate');
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [submitResponse, setSubmitResponse] = useState();

  useEffect(() => {
    if (isFullScreen !== 'isfullscreen') {
      setStartTest(null);
      setViewResult(null);
    }
  }, [isFullScreen]);

  const { data: singleQuestResp } = useGetSingleQuest(persistedUserInfo?.uuid, location.state);

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
      <div className="w-full bg-[#F2F3F5]">
        <DashboardLayout>
          <div className="flex h-[calc(100dvh-101px)] w-full tablet:h-[calc(100vh-96px)] laptop:h-[calc(100vh-70px)] dark:bg-[#242424]">
            <div className="no-scrollbar w-full overflow-y-auto py-2 tablet:px-6 tablet:py-5 laptop:px-0">
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
                      img={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
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
                    <div className="mx-auto max-w-[730px] px-4 tablet:px-[0px]">
                      <QuestionCardWithToggle
                        questStartData={submitResponse ? submitResponse : singleQuestResp}
                        img={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                        alt="badge"
                        startTest={startTest}
                        setStartTest={setStartTest}
                        viewResult={viewResult}
                        setViewResult={setViewResult}
                        handleViewResults={handleViewResults}
                        handleStartTest={handleStartTest}
                        expandedView={true}
                        setSubmitResponse={setSubmitResponse}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default Guests;
