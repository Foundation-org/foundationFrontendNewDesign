import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Loader from '../../../../components/ui/Loader';

// import { getQuestById } from '../../../../services/api/homepageApis';

import { Button } from '../../../../components/ui/Button';
import Topbar from '../../components/Topbar';
import QuestionCardWithToggle from '../QuestStartSection/components/QuestionCardWithToggle';
import DashboardLayout from '../../components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { findPostsBySharedLink, viewListResults } from '../../../../services/api/listsApi';

export default function SharedListResults() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState(persistedUserInfo.role === 'guest' ? 'All Results' : 'My List Results');
  // const [questData, setQuestData] = useState();
  // const [allQuestData, setAllQuestData] = useState();
  // const [loading, setLoading] = useState(false);

  // const getAllResult = async () => {
  //   try {
  //     const response = await getQuestById(persistedUserInfo?.uuid, location.state.questId);
  //     setAllQuestData(response.data.data[0]);
  //   } catch (error) {
  //     console.error('API call failed:', error);
  //   }
  // };

  // const getSharedResult = async () => {
  //   try {
  //     const sharedLink = 'SharedLink';
  //     const response = await getQuestById(
  //       persistedUserInfo?.uuid,
  //       location.state.questId,
  //       sharedLink,
  //       location.state.link,
  //     );
  //     setQuestData(response.data.data[0]);
  //   } catch (error) {
  //     console.error('API call failed:', error);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  // const render = async () => {
  //   setLoading(true);
  //   await getSharedResult();
  //   await getAllResult();
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   render();
  // }, []);

  const {
    data: sharedlistData,
    isPending,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      return await viewListResults({ categoryId: location.state.categoryItem });
    },
    queryKey: ['postsByCategory', persistedUserInfo.uuid],
  });

  return (
    <>
      <Topbar />
      <div className="bg-[#F2F3F5] dark:bg-[#242424]">
        <DashboardLayout>
          <div className="no-scrollbar h-[calc(100dvh-101px)] w-full overflow-y-auto tablet:h-[calc(100vh-70px)]">
            {persistedUserInfo?.role === 'user' && (
              <div className="my-2 flex justify-center gap-[15px] tablet:gap-5 laptop:my-[14.82px] laptop:gap-[35px]">
                <Button
                  variant={'topics'}
                  className={`${
                    tab === 'All Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('All Results')}
                >
                  All Results
                </Button>
                <Button
                  variant={'topics'}
                  className={`${
                    tab === 'My List Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('My List Results')}
                >
                  My List Results
                </Button>
              </div>
            )}

            {isPending ? (
              <Loader />
            ) : tab === 'My List Results' ? (
              <div className="mb-5 flex flex-col gap-2 tablet:gap-5">
                {isSuccess &&
                  sharedlistData.data.category.post.map((item) => (
                    <div
                      key={item._id}
                      className="mx-auto w-full px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]"
                    >
                      <QuestionCardWithToggle
                        questStartData={item.questForeginKey}
                        postProperties={'sharedlink-results'}
                        SharedLinkButton={'shared-links-results-button'}
                      />
                    </div>
                  ))}
              </div>
            ) : null}

            {/* {loading ? ( */}
            {/* <Loader /> */}
            {/* {tab === 'My Link Results'
              ? sharedlistData && sharedlistData?.data?.length > 0 && sharedlistData?.data.category.post.length > 0
                ? sharedlistData.data.category.post.map((item) => (
                    <div key={item._id} className="mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]">
                      <QuestionCardWithToggle
                        questStartData={item.questForeginKey}
                        postProperties={'sharedlink-results'}
                        SharedLinkButton={'shared-links-results-button'}
                      />
                    </div>
                  ))
                : null
              : allQuestData && (
                  <div
                    className={`${persistedUserInfo?.role === 'guest' ? 'pt-5' : ''} mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-0`}
                  >
                    <QuestionCardWithToggle
                      questStartData={allQuestData}
                      postProperties={'actual-results'}
                      SharedLinkButton={'shared-links-results-button'}
                    />
                  </div>
                )} */}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
