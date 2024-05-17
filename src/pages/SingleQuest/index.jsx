import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { useLocation, useParams } from 'react-router-dom';
import { createGuestMode } from '../../services/api/userAuth';
import { questImpression } from '../../services/api/questsApi';
import { getQuestByUniqueShareLink } from '../../services/api/homepageApis';
import Topbar from '../Dashboard/components/Topbar';
import DashboardLayout from '../Dashboard/components/DashboardLayout';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import SEO from '../../utils/SEO';
// import { useState } from 'react';

const SingleQuest = () => {
  let { id } = useParams();
  console.log({ id });
  const location = useLocation();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  // const [singleQuestResp, setSingleQuestResp] = useState(null);
  // const [submitResponse, setSubmitResponse] = useState();
  // const [error, setError] = useState('');

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      // const getQuest = getQuestByUniqueShareLink(location.pathname.split('/').pop());
      // setSingleQuestResp(getQuest.response.data.data[0]);

      dispatch(addUser(resp?.data));
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('uuid', resp.data.uuid);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  useEffect(() => {
    if (persistedUserInfo === null) {
      createGuest();
    }
  }, []);

  const {
    data: singleQuestData,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['questByShareLink'],
    queryFn: () => getQuestByUniqueShareLink(location.pathname.split('/').pop()),
    enabled: persistedUserInfo !== null,
  });

  useEffect(() => {
    if (isSuccess && singleQuestData) {
      questImpression(id);
    }
  }, [isSuccess, singleQuestData]);

  // console.log('singleQuestData', singleQuestData);
  // const questByUniqueShareLink = async () => {
  //   const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').pop());
  //   console.log('🚀 ~ questByUniqueShareLink ~ getQuest:', getQuest);

  //   if (getQuest.error === 'This link is not active') {
  //     setError(getQuest.error);
  //   } else {
  //     setSingleQuestResp(getQuest.response.data.data[0]);
  //   }
  // };

  return (
    <>
      {/* <WelcomePopup modalVisible={modalVisible} handleClose={closeWelcomeDialogue} /> */}
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
        <meta name="description" content={singleQuestData?.Question} />
        //OG
        <meta property="og:title" content="Foundation" />
        <meta property="og:description" content={singleQuestData?.Question} />
        <meta property="og:type" content="website" />
        {/* <meta name="theme-color" content={seoMeta.color} />
        <meta property="og:video" content={seoMeta.video} />
        <meta property="og:video:width" content={seoMeta.videoWidth} />
        <meta property="og:video:height" content={seoMeta.videoHeight} />
        <meta property="og:video:type" content={seoMeta.videoType} /> */}
        {/* Show Image Meta Tags */}
        <meta property="og:image" itemprop="image" content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`} />
        <meta property="og:image:secure_url" itemprop="image" content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`} />
        {/* <meta property="og:image:type" content="image/svg" /> */}
        {/* <meta property="og:audio" content={seoMeta.preview} />
        <meta property="og:audio:type" content="audio/vnd.facebook.bridge" />
        <meta property="og:audio:type" content="audio/mpeg" /> */}
        //Note // Twitter
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Foundation" />
        <meta property="twitter:description" content={singleQuestData?.Question} />
        <meta property="twitter:domain" content="on.foundation" />
        <meta property="twitter:image" content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`} />
        <meta name="google" content="notranslate"></meta>
      </Helmet>
      <Topbar />
      <div className="w-full bg-[#F2F3F5]">
        <DashboardLayout>
          <div className="no-scrollbar h-[calc(100vh-58px)] w-full overflow-y-auto py-2 tablet:h-[calc(100vh-101px)] laptop:h-[calc(100vh-70px)] laptop:py-5">
            {error !== '' ? <p className="text-center text-[24px] font-bold tablet:text-[25px]">{error}</p> : null}
            {singleQuestData && (
              <div className="mx-auto max-w-[730px] px-4 tablet:px-[0px] ">
                <QuestionCardWithToggle
                  questStartData={singleQuestData}
                  isBookmarked={false}
                  // setSingleQuestResp={setSingleQuestResp}
                  // setSubmitResponse={setSubmitResponse}
                  isSingleQuest={location.pathname.includes('/p/') ? true : false}
                  postLink={id}
                  // guestResult={singleQuestData.startStatus === 'change answer' ? true : false}
                />
              </div>
            )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default SingleQuest;
