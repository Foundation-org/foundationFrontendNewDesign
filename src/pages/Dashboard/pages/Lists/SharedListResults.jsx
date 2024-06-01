import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { viewListAllResults, viewListResults } from '../../../../services/api/listsApi';

import Loader from '../../../../components/ui/Loader';
import Topbar from '../../components/Topbar';
import QuestionCardWithToggle from '../QuestStartSection/components/QuestionCardWithToggle';
import DashboardLayout from '../../components/DashboardLayout';

export default function SharedListResults() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState(persistedUserInfo.role === 'guest' ? 'All Results' : 'My List Results');

  const {
    data: sharedlistAllData,
    isPending: allDataPending,
    isSuccess: allDataSuccess,
  } = useQuery({
    queryFn: async () => {
      return await viewListAllResults({ categoryId: location.state.categoryItem });
    },
    queryKey: ['allPostsByCategory', persistedUserInfo.uuid],
  });

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

            {tab === 'All Results' ? (
              allDataPending ? (
                <Loader />
              ) : (
                <div className="mb-5 flex flex-col gap-2 tablet:gap-5">
                  {allDataSuccess &&
                    sharedlistAllData.data.category.post.map((item) => (
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
              )
            ) : null}

            {tab === 'My List Results' ? (
              isPending ? (
                <Loader />
              ) : (
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
              )
            ) : null}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
