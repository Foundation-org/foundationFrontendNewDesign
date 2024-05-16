import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Loader from '../../../../../../components/ui/Loader';
import Topbar from '../../../../components/Topbar';
import QuestionCardWithToggle from '../../../QuestStartSection/components/QuestionCardWithToggle';
import { getQuestById } from '../../../../../../services/api/homepageApis';
import DashboardLayout from '../../../../components/DashboardLayout';

export default function SharedLinkResults() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState(persistedUserInfo.role === 'guest' ? 'All Results' : 'My Link Results');
  const [questData, setQuestData] = useState();
  const [allQuestData, setAllQuestData] = useState();
  const [loading, setLoading] = useState(false);

  const getAllResult = async () => {
    try {
      const response = await getQuestById(persistedUserInfo?.uuid, location.state.questId);
      setAllQuestData(response.data.data[0]);
    } catch (error) {
      console.error('API call failed:', error);
    }
    // finally {
    //   // setLoading(false);
    // }
  };

  const getSharedResult = async () => {
    try {
      const sharedLink = 'SharedLink';
      const response = await getQuestById(
        persistedUserInfo?.uuid,
        location.state.questId,
        sharedLink,
        location.state.link,
      );
      setQuestData(response.data.data[0]);
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      // setLoading(false);
    }
  };

  const render = async () => {
    setLoading(true);
    await getSharedResult();
    await getAllResult();
    setLoading(false);
  };
  useEffect(() => {
    render();
  }, []);

  return (
    <>
      <Topbar />
      <div className="bg-[#F2F3F5] dark:bg-[#242424]">
        <DashboardLayout>
          <div className="no-scrollbar h-[calc(100dvh-101px)] w-full overflow-y-auto tablet:h-[calc(100vh-70px)]">
            {persistedUserInfo?.role === 'user' && (
              <div className="mb-[10px] mt-[15px] flex justify-center gap-[15px] tablet:gap-5 laptop:mb-[37px] laptop:mt-[43px] laptop:gap-[35px]">
                <button
                  className={`${
                    tab === 'All Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
                      : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
                  } tab-button`}
                  onClick={() => setTab('All Results')}
                >
                  All Results
                </button>
                <button
                  className={`${
                    tab === 'My Link Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
                      : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
                  } tab-button`}
                  onClick={() => setTab('My Link Results')}
                >
                  My Link Results
                </button>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : tab === 'My Link Results' ? (
              questData && (
                <div className="mx-auto px-4 tablet:px-6 laptop:max-w-[730px] laptop:px-[0px]">
                  <QuestionCardWithToggle
                    questStartData={questData}
                    postProperties={'sharedlink-results'}
                    SharedLinkButton={'shared-links-results-button'}
                  />
                </div>
              )
            ) : (
              allQuestData && (
                <div
                  className={`${persistedUserInfo?.role === 'guest' ? 'pt-5' : ''} mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]`}
                >
                  <QuestionCardWithToggle
                    questStartData={allQuestData}
                    postProperties={'actual-results'}
                    SharedLinkButton={'shared-links-results-button'}
                  />
                </div>
              )
            )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
