import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Loader from '../../../../../../components/ui/Loader';
import Topbar from '../../../../components/Topbar';
import QuestionCardWithToggle from '../../../QuestStartSection/components/QuestionCardWithToggle';
import { getQuestById } from '../../../../../../services/api/homepageApis';
import DashboardLayout from '../../../../components/DashboardLayout';
import { Button } from '../../../../../../components/ui/Button';

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
          <div className="no-scrollbar mx-auto h-[calc(100dvh-101px)] w-full max-w-[1440px] overflow-y-auto tablet:h-[calc(100vh-70px)] laptop:mx-[331px] laptop:px-4 desktop:mx-auto desktop:px-0">
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
                    tab === 'My Link Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('My Link Results')}
                >
                  My Link Results
                </Button>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : tab === 'My Link Results' ? (
              questData && (
                <div className="mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]">
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
                  className={`${persistedUserInfo?.role === 'guest' ? 'pt-5' : ''} mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-0`}
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
