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
import { Helmet } from 'react-helmet-async';

const SingleQuest = () => {
  // let { isFullScreen } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const persistedUserInfo = useSelector((state) => state.auth.user);

  // const [startTest, setStartTest] = useState(null);
  // const [viewResult, setViewResult] = useState(null);
  const [singleQuestResp, setSingleQuestResp] = useState(null);
  const [submitResponse, setSubmitResponse] = useState();

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
  }, []);

  return (
    <>
      {/* <SEO
        title={'Foundation'}
          description={singleQuestResp?.Question}
          url={import.meta.env.VITE_CLIENT_URL}
          image={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
          type={'website'}
      /> */}
      {/* {singleQuestResp && (
        <SEO
          title={'Foundation'}
          description={singleQuestResp?.Question}
          url={import.meta.env.VITE_CLIENT_URL}
          image={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
          type={'website'}
        />
      )} */}
      <Helmet>
        <script>
          {`
            window.prerenderReady = false;
          `}
        </script>
        {/* // Metaprop */}
        <title>Foundation</title>
        <meta name="description" content={singleQuestResp.Question} />
        //OG
        <meta property="og:title" content="Foundation" />
        <meta property="og:description" content={singleQuestResp.Question} />
        <meta property="og:type" content="website" />
        {/* <meta name="theme-color" content={seoMeta.color} />
        <meta property="og:video" content={seoMeta.video} />
        <meta property="og:video:width" content={seoMeta.videoWidth} />
        <meta property="og:video:height" content={seoMeta.videoHeight} />
        <meta property="og:video:type" content={seoMeta.videoType} /> */}
        {/* Show Image Meta Tags */}
        <meta property="og:image" itemprop="image" content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`} />
        <meta
          property="og:image:secure_url"
          itemprop="image"
          content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
        />
        <meta property="og:image:type" content="image/svg" />
        {/* <meta property="og:audio" content={seoMeta.preview} />
        <meta property="og:audio:type" content="audio/vnd.facebook.bridge" />
        <meta property="og:audio:type" content="audio/mpeg" /> */}
        //Note // Twitter
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Foundation" />
        <meta property="twitter:description" content={singleQuestResp.Question} />
        <meta property="twitter:domain" content="on.foundation" />
        <meta property="twitter:image" content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`} />
        <meta name="google" content="notranslate"></meta>
      </Helmet>
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
