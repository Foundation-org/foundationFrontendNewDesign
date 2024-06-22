import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { questImpression } from '../../services/api/questsApi';
import { getQuestByUniqueShareLink } from '../../services/api/homepageApis';
import Topbar from '../Dashboard/components/Topbar';
import DashboardLayout from '../Dashboard/components/DashboardLayout';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import SEO from '../../utils/SEO';

const SingleQuest = () => {
  let { id } = useParams();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);

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
          <div className="no-scrollbar mx-auto h-[calc(100vh-58px)] w-full max-w-[1440px] overflow-y-auto py-2 tablet:h-[calc(100vh-101px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] laptop:px-4 laptop:py-5 desktop:mx-auto desktop:px-0">
            {error !== '' ? <p className="text-center text-[24px] font-bold tablet:text-[25px]">{error}</p> : null}
            {singleQuestData && (
              <div className="mx-auto max-w-[730px] px-4 tablet:px-[0px] ">
                <QuestionCardWithToggle
                  questStartData={singleQuestData}
                  isBookmarked={false}
                  isSingleQuest={location.pathname.includes('/p/') ? true : false}
                  postLink={id}
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
