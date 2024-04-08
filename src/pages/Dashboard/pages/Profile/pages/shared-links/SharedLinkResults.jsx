import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Loader from '../../../../../../components/ui/Loader';
import SidebarRight from '../../../../components/SidebarRight';
import Topbar from '../../../../components/Topbar';
import QuestionCardWithToggle from '../../../QuestStartSection/components/QuestionCardWithToggle';
import { getQuestById } from '../../../../../../services/api/homepageApis';

export default function SharedLinkResults() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState('My Link Results');
  const [questData, setQuestData] = useState();
  const [allQuestData, setAllQuestData] = useState();
  const [loading, setLoading] = useState(false);

  const getAllResult = async () => {
    try {
      const response = await getQuestById(persistedUserInfo?.uuid, location.state.questId);
      setAllQuestData(response.data.data[0]);
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      // setLoading(false);
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
        <div className="mx-auto flex h-[calc(100vh-90px)] max-w-[1378px] tablet:h-[calc(100vh-70px)]">
          <div className="no-scrollbar w-full overflow-y-auto py-7 tablet:py-[3.81rem]">
            <div className="mb-7 flex justify-center gap-5 tablet:mb-[3.81rem] tablet:gap-[5.69rem]">
              <button
                className={`text-nowrap rounded-[7.1px] border  px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal tablet:rounded-[23.6px] tablet:px-[66px] tablet:py-5 tablet:text-[23.63px] ${tab === 'All Results' ? ' bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] text-white' : ' border-[#BABABA] bg-white text-[#7C7C7C]'}`}
                onClick={() => setTab('All Results')}
              >
                All Results
              </button>
              <button
                className={`text-nowrap rounded-[7.1px] border px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal tablet:rounded-[23.6px] tablet:px-[66px] tablet:py-5 tablet:text-[23.63px] ${tab === 'My Link Results' ? ' bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] text-white' : 'border-[#BABABA] bg-white text-[#7C7C7C]'}`}
                onClick={() => setTab('My Link Results')}
              >
                My Link Results
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : tab === 'My Link Results' ? (
              questData && (
                <div className="mx-auto max-w-[730px] px-[25px] tablet:px-[0px]">
                  <QuestionCardWithToggle
                    questStartData={questData}
                    postProperties={'sharedlink-results'}
                    SharedLinkButton={'shared-links-results-button'}
                  />
                </div>
              )
            ) : (
              allQuestData && (
                <div className="mx-auto max-w-[730px] px-[25px] tablet:px-[0px]">
                  <QuestionCardWithToggle
                    questStartData={allQuestData}
                    postProperties={'actual-results'}
                    SharedLinkButton={'shared-links-results-button'}
                  />
                </div>
              )
            )}
          </div>

          <SidebarRight />
        </div>
      </div>
    </>
  );
}
