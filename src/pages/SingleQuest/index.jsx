import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

// utils
import { getQuestById, getQuestByUniqueShareLink } from '../../services/api/homepageApis';

// components
import Topbar from '../Dashboard/components/Topbar';
import SidebarRight from '../Dashboard/components/SidebarRight';

import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { createGuestMode, userInfo, userInfoById } from '../../services/api/userAuth';

import { addUser } from '../../features/auth/authSlice';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import SEO from '../../utils/SEO';
import WelcomePopup from '../../components/dialogue-boxes/WelcomePopup';
import { questImpression } from '../../services/api/questsApi';

const SingleQuest = () => {
  let { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const persistedUserInfo = useSelector((state) => state.auth.user);

  // const [startTest, setStartTest] = useState(null);
  // const [viewResult, setViewResult] = useState(null);
  const [singleQuestResp, setSingleQuestResp] = useState(null);
  const [submitResponse, setSubmitResponse] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const openWelcomeDialogue = () => setModalVisible(true);
  const closeWelcomeDialogue = () => setModalVisible(false);
  // const handleStartTest = (testId) => {
  //   setViewResult(null);
  //   setStartTest((prev) => (prev === testId ? null : testId));
  // };

  // const handleViewResults = (testId) => {
  //   setStartTest(null);
  //   setViewResult((prev) => (prev === testId ? null : testId));
  // };

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      dispatch(addUser(resp?.data));
      localStorage.setItem('uuid', resp.data.uuid);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
  });

  const handleUserInfo = async () => {
    try {
      const resp = await getUserInfo();

      if (resp?.status === 200) {
        if (resp.data) {
          dispatch(addUser(resp?.data));

          if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', resp.data.uuid);
          }
        }

        if (!resp.data) {
          const res = await userInfoById(localStorage.getItem('uuid'));
          dispatch(addUser(res?.data));
          // if (res?.data?.requiredAction) {
          // }
        }
      }
    } catch (e) {
      console.log({ e });
    }
  };

  const createGuestAccount = async () => {
    await createGuest();
    await handleUserInfo();

    const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').pop());

    setSingleQuestResp(getQuest.data.data[0]);
  };

  const questByUniqueShareLink = async () => {
    await handleUserInfo();
    const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').pop());

    setSingleQuestResp(getQuest.data.data[0]);
  };

  useEffect(() => {
    // If User not exist
    if (persistedUserInfo === null) {
      createGuestAccount();
    }
    // if User exist no matter guest/normal
    if (persistedUserInfo) {
      questByUniqueShareLink();
    }

    questImpression(id)
  }, []);

  useEffect(() => {
    const hasGuestVisitedBefore = localStorage.getItem('hasGuestVisitedBefore');

    if (!hasGuestVisitedBefore) {
      openWelcomeDialogue();
      localStorage.setItem('hasGuestVisitedBefore', true);
    }
  }, []);

  return (
    <>
      <WelcomePopup modalVisible={modalVisible} handleClose={closeWelcomeDialogue} />
      {/* <SEO
        title="'Participate on foundation and have your voice heard' / 'Foundation rewards every user for their valuable insights'"
        description="'Participate on foundation and have your voice heard' / 'Foundation rewards every user for their valuable insights'"
        image="/fav96a.png"
        type="Post"
        url="https://on.foundation/"
      /> */}
      {singleQuestResp && (
        <SEO
          title={
            'Participate on foundation and have your voice heard / Foundation rewards every user for their valuable insights'
          }
          description={singleQuestResp?.Question}
          url={import.meta.env.VITE_CLIENT_URL}
          image={
            'https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v3/development.on.foundation/Foundation/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fdocuments%2F4a15bdca-57e7-4915-89e0-beebefb33798.jpg%3Ftoken%3DrRMvgkH4adxq8RhFvD14Hn1Ytn9YYw11nLcXmPnet-I%26height%3D200%26width%3D200%26expires%3D33243832830/og.png'
          }
          type={'website'}
        />
      )}
      <Topbar />
      <div className="flex h-[calc(100vh-90px)] bg-white dark:bg-[#242424]">
        <div className="quest-scrollbar w-full overflow-y-auto py-7 tablet:py-[3.81rem]">
          {(singleQuestResp || submitResponse) && (
            <div className="px-[25px] tablet:px-[86px]">
              <QuestionCardWithToggle
                questStartData={submitResponse ? submitResponse : singleQuestResp}
                isBookmarked={false}
                setSingleQuestResp={setSingleQuestResp}
                setSubmitResponse={setSubmitResponse}
              />
            </div>
          )}
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default SingleQuest;
