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

    // Add Meta Pixel script to the page head
    useEffect(() => {
      // Function to insert the script tag for Meta Pixel
      const insertMetaPixelScript = () => {
        // Check if the script is already added to avoid duplicate scripts
        if (document.getElementById('meta-pixel-script')) return;
  
        const script = document.createElement('script');
        script.id = 'meta-pixel-script';
        script.async = true;
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1534508323834469');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
  
        // Add the noscript fallback for users with JavaScript disabled
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=1534508323834469&ev=PageView&noscript=1" />
        `;
        document.body.appendChild(noscript);
      };
  
      insertMetaPixelScript();
  
      // Cleanup to remove the script when the component unmounts
      return () => {
        const script = document.getElementById('meta-pixel-script');
        if (script) document.head.removeChild(script);
      };
    }, []); 

  return (
    <>
    
      <Topbar />
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
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
                  <div key={index + 1} className="mx-auto w-full max-w-[730px] px-4 tablet:px-0">
                    <SystemNotificationCard post={item} />
                  </div>
                ) : (
                  <div key={index + 1} className="mx-auto w-full max-w-[730px] px-4 tablet:px-0">
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
