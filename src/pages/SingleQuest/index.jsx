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
import SystemNotificationCard from '../../components/posts/SystemNotificationCard';

const SingleQuest = () => {
  let { id } = useParams();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const {
    data: singleQuestData,
    error,
    isLoading,
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
  }, [isSuccess, singleQuestData?.data?.data]);

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
        <meta name="description" content={singleQuestData?.data.data?.Question} />
        //OG
        <meta property="og:title" content="Foundation" />
        <meta property="og:description" content={singleQuestData?.data.data?.Question} />
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
        <meta property="twitter:description" content={singleQuestData?.data?.data?.Question} />
        <meta property="twitter:domain" content="on.foundation" />
        <meta property="twitter:image" content={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`} />
        <meta name="google" content="notranslate"></meta>
      </Helmet>
      <Topbar />
      <div className="w-full bg-[#F2F3F5]">
        <DashboardLayout>
          <div className="no-scrollbar relative mx-auto flex h-[calc(100dvh-91px)] w-full max-w-[1440px] flex-col gap-2 overflow-y-auto py-2 tablet:h-[calc(100vh-101px)] tablet:gap-5 laptop:mx-[331px] laptop:h-[calc(100vh-70px)] laptop:px-4 laptop:py-5 desktop:mx-auto desktop:px-0">
            {isLoading ? (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                Loading...
              </p>
            ) : !singleQuestData && error !== '' ? (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                {error?.response?.data?.message
                  ? error?.response?.data?.message
                  : 'An error occurred while fetching the quest.'}
              </p>
            ) : null}
            {singleQuestData &&
              singleQuestData?.data.data?.map((item, index) =>
                item.id === 'guest_notification' ? (
                  <div className="mx-auto w-full max-w-[730px] px-4 tablet:px-0">
                    <SystemNotificationCard post={item} key={index + 1} />
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-[730px] px-4 tablet:px-0">
                    <QuestionCardWithToggle
                      questStartData={item}
                      isBookmarked={false}
                      isSingleQuest={location.pathname.includes('/p/') ? true : false}
                      postLink={id}
                    />
                  </div>
                ),
              )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default SingleQuest;
