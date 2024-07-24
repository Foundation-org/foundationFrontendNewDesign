import { useEffect } from 'react';
import * as filtersActions from '../../../../features/sidebar/filtersSlice';
import * as questUtilsActions from '../../../../features/quest/utilsSlice';
import MediaControls from '../../../../components/MediaControls';
import SidebarLeft from '../../components/SidebarLeft';
import QuestionCardWithToggle from './components/QuestionCardWithToggle';
import Slider from '../../../../components/Slider';
import api from '../../../../services/api/Axios';
import { printEndMessage } from '../../../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import SystemNotificationCard from '../../../../components/posts/SystemNotificationCard';
import ShowAdultDisabledPopup from '../../../../components/dialogue-boxes/ShowAdultDisabledPopup';

const QuestStartSection = () => {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const filterStates = useSelector(filtersActions.getFilters);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);

  const fetchPosts = async function getInfoQuestions({ pageParam, signal }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: filterStates.filterBySort === '' ? 'Newest First' : filterStates.filterBySort,
      type: filterStates.filterByType,
      filter: filterStates.filterByScope === 'Me' && true,
      participated:
        filterStates.filterByStatus === 'Participated'
          ? 'Yes'
          : filterStates.filterByStatus === 'Not Participated'
            ? 'Not'
            : 'All',
      moderationRatingInitial: filterStates.moderationRatingFilter.initial,
      moderationRatingFinal: filterStates.moderationRatingFilter.final,
      terms: filterStates.searchData,
      Page: filterStates.bookmarks ? 'Bookmark' : '',
      media: filterStates.filterByMedia,
    };

    if (filterStates.topics.Block.list.length !== 0) {
      params.blockedTerms = JSON.stringify(filterStates.topics.Block.list);
    }

    const response = await api.get('/infoquestions/getQuestsAll', { params, signal });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: [
      'posts',
      filterStates.filterBySort,
      filterStates.filterByType,
      filterStates.filterByScope,
      filterStates.moderationRatingFilter.initial,
      filterStates.moderationRatingFilter.final,
      filterStates.searchData,
      filterStates.filterByStatus,
      filterStates.topics.Block.list,
      filterStates.bookmarks,
      filterStates.filterByMedia,
    ],
    queryFn: ({ pageParam, signal }) => fetchPosts({ pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nexPage = lastPage.length ? allPages.length + 1 : undefined;
      return nexPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
    dispatch(questUtilsActions.setNextPage(hasNextPage));
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  const content = data?.pages.map((posts) =>
    posts.map((post, index) => {
      if (post.id === 'system_notification' && posts.length == index + 1) {
        return <SystemNotificationCard key={index + 1} post={post} innerRef={ref} />;
      } else if (post.id === 'system_notification' && posts.length !== index + 1) {
        return <SystemNotificationCard key={index + 1} post={post} />;
      } else {
        if (posts.length == index + 1) {
          return (
            <QuestionCardWithToggle
              innerRef={ref}
              key={post._id}
              questStartData={post}
              playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
            />
          );
        } else {
          return (
            <QuestionCardWithToggle
              key={post._id}
              questStartData={post}
              playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
            />
          );
        }
      }
    }),
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-[#F2F3F5] dark:bg-black laptop:mx-[331px] desktop:mx-auto">
      {filterStates?.moderationRatingFilter?.initial === 0 &&
        filterStates?.moderationRatingFilter?.final === 0 &&
        questUtils.adultFilterPopup.rating !== 0 && (
          <ShowAdultDisabledPopup
            handleClose={() => {
              dispatch(questUtilsActions.addAdultFilterPopup({ rating: 0 }));
            }}
            modalVisible={questUtils.adultFilterPopup.rating !== 0}
            title={'Adult Post Warning'}
            image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/adult_icon.svg`}
          />
        )}
      <div className="relative mx-auto flex w-full max-w-[778px] flex-col laptop:flex-row">
        <div className="block tablet:hidden">
          <SidebarLeft />
        </div>
        <div className="no-scrollbar mx-auto flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-134px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] dark:bg-black tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)]">
          <div className="fixed left-auto right-auto max-w-full laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
            <Slider isFetching={isFetching} />
          </div>
          <div
            id="post-container"
            className="no-scrollbar mt-10 flex h-[calc(100dvh-174px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:mt-[77.63px] tablet:h-[calc(100dvh-314px)] tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full"
          >
            {content}
            {printEndMessage(data?.pages[0], filterStates.bookmarks, isFetching)}
          </div>
        </div>
        {questUtils.isShowPlayer && (
          <div className="absolute bottom-0 left-1/2 z-10 block -translate-x-1/2 laptop:hidden">
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                alt="mediaCloseIcon"
                className="absolute -right-2 top-3 z-20 h-6 w-6 cursor-pointer text-black dark:text-white"
                onClick={() => {
                  dispatch(questUtilsActions.setIsShowPlayer(false));
                  dispatch(questUtilsActions.setPlayingPlayerId(''));
                }}
              />
            </div>
            <MediaControls />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestStartSection;
