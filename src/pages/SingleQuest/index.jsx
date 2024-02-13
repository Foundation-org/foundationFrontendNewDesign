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

const SingleQuest = () => {
  let { isFullScreen } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const persistedUserInfo = useSelector((state) => state.auth.user);

  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [singleQuestResp, setSingleQuestResp] = useState(null);

  console.log('🚀 ~ useEffect ~ persistedUserInfo:', singleQuestResp);

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
          if (res?.data?.requiredAction) {
          }
        }
      }
    } catch (e) {
      console.log({ e });
    }
  };

  const createGuestAccount = async () => {
    await createGuest();
    await handleUserInfo();

    const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').slice(-2)[0]);

    setSingleQuestResp(getQuest.data.data[0]);
  };

  const questByUniqueShareLink = async () => {
    await handleUserInfo();
    const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').slice(-2)[0]);

    setSingleQuestResp(getQuest.data.data[0]);
  };

  useEffect(() => {
    // If User not exist
    if (persistedUserInfo === null) {
      createGuestAccount();
    }
    // if User exist no matter guest/normal
    if (persistedUserInfo) {
      console.log('i am running');
      questByUniqueShareLink();
    }
  }, []);

  return (
    <>
      {/* <SEO
        title="'Participate on foundation and have your voice heard' / 'Foundation rewards every user for their valuable insights'"
        description="'Participate on foundation and have your voice heard' / 'Foundation rewards every user for their valuable insights'"
        image="/fav96a.png"
        type="Post"
        url="https://on.foundation/"
      /> */}
      <Topbar />
      <div className="flex h-[calc(100vh-90px)] bg-white dark:bg-[#242424]">
        <div className="quest-scrollbar w-full overflow-y-auto py-7 tablet:py-[3.81rem]">
          {singleQuestResp && (
            <div className="px-[25px] tablet:px-[86px]">
              <QuestionCardWithToggle
                questStartData={singleQuestResp}
                isBookmarked={false}
                setSingleQuestResp={setSingleQuestResp}
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
