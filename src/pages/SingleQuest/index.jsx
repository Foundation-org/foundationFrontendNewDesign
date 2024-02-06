import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

// utils
import { getQuestById, getQuestByUniqueShareLink } from '../../services/api/homepageApis';

// components
import Topbar from '../Dashboard/components/Topbar';
import SidebarRight from '../Dashboard/components/SidebarRight';
import QuestionCard from './components/QuestionCard';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { createGuestMode, userInfo } from '../../services/api/userAuth';
import { useGetSingleQuest } from '../../services/queries/quest';
import { addUser } from '../../features/auth/authSlice';

const SingleQuest = () => {
  let { isFullScreen } = useParams();
  const location = useLocation();
  const dispatch = useDispatch()
  console.log({ location });
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState('Participate');
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [singleQuestResp, setSingleQuestResp] = useState(null);
  const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   if (isFullScreen !== 'isfullscreen') {
  //     setStartTest(null);
  //     setViewResult(null);
  //   }
  // }, [isFullScreen]);
  console.log("location",location);
  console.log("id",location.pathname.split('/').pop());

  console.log("🚀 ~ useEffect ~ persistedUserInfo:", persistedUserInfo)

  // const { data: singleQuestResp } = useGetSingleQuest(persistedUserInfo?.uuid, location.state);

  function getQuestionTitle(whichTypeQuestion) {
    switch (whichTypeQuestion) {
      case 'like/dislike':
        return 'Like/Dislike';
      case 'agree/disagree':
        return 'Agree/Disagree';
      case 'multiple choise':
        return 'Multiple Choice';
      case 'ranked choise':
        return 'Ranked Choice';
      case 'yes/no':
        return 'Yes/No';
      default:
        return null;
    }
  }

  const handleStartTest = (testId) => {
    setViewResult(null);
    setStartTest((prev) => (prev === testId ? null : testId));
  };

  const handleViewResults = (testId) => {
    setStartTest(null);
    setViewResult((prev) => (prev === testId ? null : testId));
  };

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('jwt', resp.data.token);
      localStorage.setItem('uId', resp.data.uuid);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
    onSuccess: async(res) => {
      console.log('User info fetched:', res.data);
      // const questById = await getQuestById(location.pathname.split('/').pop())
      // console.log("🚀 ~ onSuccess:async ~ questById:", questById./data.data[0])
      // setSingleQuestResp(questById.data.data[0])
      // setUserData(res.data)
      // return res.data;
      dispatch(addUser(res.data));
    },
    onError: (error) => {
      console.error('Error fetching user info:', error);
      localStorage.setItem('loggedIn', 'false');
    },
  });

  const createGuestAccount = async() => {
    await createGuest();
    await getUserInfo();
    // console.log("🚀 ~ createGuestAccount ~ getUserData:", getUserData)
    const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').pop())
    console.log("🚀 ~ createGuestAccount ~ getQuest:", getQuest.data.data[0])
    setSingleQuestResp(getQuest.data.data[0])
  }

  const questByUniqueShareLink = async() => {
    const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').pop())
    console.log("🚀 ~ createGuestAccount ~ getQuest:", getQuest.data.data[0])
    setSingleQuestResp(getQuest.data.data[0])
  }

  // useEffect(() => {
  //   if(userData){
  //   setSingleQuestResp(getQuestById(location.state))
  //   console.log("inside...........");
  //   }
  // }, [userData])

  useEffect(() => {
    // If User not exist
    if (persistedUserInfo === null) {
      createGuestAccount()
    }
    // if User exist no matter guest/normal
    if(persistedUserInfo) {
      questByUniqueShareLink()
    }
    // fetch the single quest only when the user exists (normal, guest)
    console.log("if user exist outside.........");
    // if(persistedUserInfo){
    //   console.log("if user exist");
    //   setSingleQuestResp(useGetSingleQuest(persistedUserInfo?.uuid, location.state))
    // }
  }, []);

  console.log(singleQuestResp, 'tesging..........................');

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
          {singleQuestResp && (
            <div>
              {isFullScreen === 'isfullscreen' ? (
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
                />
              ) : (
                <div className="px-[25px] tablet:px-[86px]">
                  <QuestionCardWithToggle
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
                    startTest={startTest}
                    setStartTest={setStartTest}
                    viewResult={viewResult}
                    setViewResult={setViewResult}
                    handleViewResults={handleViewResults}
                    handleStartTest={handleStartTest}
                    multipleOption={singleQuestResp?.userCanSelectMultiple}
                    QuestTopic={singleQuestResp?.QuestTopic}
                    createdBy={singleQuestResp?.uuid}
                    lastInteractedAt={singleQuestResp?.lastInteractedAt}
                    usersChangeTheirAns={singleQuestResp?.usersChangeTheirAns}
                    startStatus={singleQuestResp?.startStatus}
                    expandedView={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default SingleQuest;
