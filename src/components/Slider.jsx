import { Button } from './ui/Button';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as homeFilterActions from '../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../features/sidebar/bookmarkFilterSlice';
import * as QuestServices from '../services/queries/quest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setFilterStates } from '../services/api/userAuth';
import { setIsShowPlayer, setPlayingPlayerId, resetPlayingIds } from '../features/quest/utilsSlice';

function Slider({ isFetching }) {
  let filtersActions;
  const dispatch = useDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { pathname } = location;
  if (pathname === '/dashboard/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }
  const containerRef = useRef(null);
  const filterStates = useSelector(filtersActions.getFilters);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();

  useEffect(() => {
    const selectedButtonId = localStorage.getItem('selectedButtonId');
    const selectedButton = document.getElementById(selectedButtonId);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [filterStates.topics]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(homeFilterActions.setTopics(topicsData?.data.data || []));
    }
  }, [topicsData, isSuccess]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const container = containerRef.current;

    if (!container) return;

    const startX = e.pageX;
    const initialScrollLeft = container.scrollLeft;

    const handleMouseMove = (e) => {
      const dx = e.pageX - startX;
      container.scrollLeft = initialScrollLeft - dx;
      if (dx < 0) {
        setScrollPosition(startX - e.pageX);
        localStorage.setItem('sliderScrollPosition', startX - e.pageX);
      } else {
        setScrollPosition(e.pageX - startX);
        localStorage.setItem('sliderScrollPosition', e.pageX - startX);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    setScrollPosition(0);
    const container = document.getElementById('buttonContainer');

    container.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  }, [filterStates.clearFilter]);

  const handleRightArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth / 2;
    setScrollPosition(scrollPosition + scrollAmount);
    localStorage.setItem('sliderScrollPosition', scrollPosition + scrollAmount);
    container.scrollTo({
      left: scrollPosition + scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleLeftArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth / 2;
    setScrollPosition(scrollPosition - scrollAmount);
    localStorage.setItem('sliderScrollPosition', scrollPosition - scrollAmount);
    container.scrollTo({
      left: scrollPosition - scrollAmount,
      behavior: 'smooth',
    });
  };

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  const handleButtonSelection = async (type, data, id) => {
    // Save the id of the selected button in localStorage for scrolling it into view
    await queryClient.cancelQueries();
    localStorage.setItem('selectedButtonId', id);
    const selectedButton = document.getElementById(id);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (isFetching) return;

    switch (type) {
      case 'newest-first':
        if (filterStates.filterBySort !== 'Newest First') {
          // setSliderloading(true);
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setFilterBySort('Newest First'));
          setFilters({
            ...filterStates,
            filterBySort: 'Newest First',
            filterByScope: '',
            bookmarks: false,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
          });
        }
        break;
      case 'most-popular':
        if (filterStates.filterBySort !== 'Most Popular') {
          // setSliderloading(true);
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setFilterBySort('Most Popular'));
          setFilters({
            ...filterStates,
            filterByScope: '',
            filterBySort: 'Most Popular',
            bookmarks: false,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
          });
        }
        break;
      case 'my-posts':
        if (filterStates.filterByScope !== 'Me') {
          // setSliderloading(true);
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterBySort(''));
          dispatch(filtersActions.setFilterByScope('Me'));
          setFilters({
            ...filterStates,
            filterByScope: 'Me',
            bookmarks: false,
            filterBySort: '',
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
          });
        }
        break;
      case 'bookmarks':
        if (filterStates.bookmarks !== true) {
          // setSliderloading(true);
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterBySort(''));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setBookmarks(true));
          setFilters({
            ...filterStates,
            filterBySort: '',
            filterByScope: '',
            bookmarks: true,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
          });
        }
        break;
      case 'topics':
        if (filterStates.topics?.Block && filterStates.topics?.Block.list.includes(data)) return;

        dispatch(setIsShowPlayer(false));
        dispatch(setPlayingPlayerId(''));
        dispatch(resetPlayingIds());
        dispatch(filtersActions.setBookmarks(false));
        dispatch(filtersActions.setBlockTopics([data]));
        dispatch(filtersActions.setFilterBySort(''));
        dispatch(filtersActions.setFilterByScope('All'));
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center px-4 py-2 tablet:px-6 tablet:py-[14.82px]">
      {scrollPosition > 0 && (
        <button
          onClick={handleLeftArrowClick}
          className="size-[10px] min-w-[10px] max-w-[10px] rotate-180 tablet:size-5 tablet:min-w-5 tablet:max-w-5"
          style={{
            background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        ></button>
      )}
      <div
        className="no-scrollbar mx-[5px] flex items-center gap-[6.75px] overflow-x-scroll tablet:mx-4 tablet:gap-[13.82px]"
        id="buttonContainer"
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        <div className="flex gap-[6.75px] border-r-[2.4px] border-[#CECECE] pr-[6.75px] tablet:gap-[13.82px] tablet:pr-[13.82px] ">
          <Button
            variant={'topics'}
            className={`${filterStates.filterBySort === 'Newest First' ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#ABABAB]'}`}
            onClick={() => {
              // queryClient.invalidateQueries('FeedData');
              handleButtonSelection('newest-first', null, 'newButton');
            }}
            disabled={isFetching}
            id={'newButton'}
          >
            New!
          </Button>
          <Button
            variant={'topics'}
            className={`${filterStates.filterBySort === 'Most Popular' ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#ABABAB]'}`}
            onClick={() => {
              // queryClient.invalidateQueries('FeedData');
              handleButtonSelection('most-popular', null, 'trendingButton');
            }}
            disabled={isFetching}
            id={'trendingButton'}
          >
            Trending!
          </Button>
          <Button
            variant={'topics'}
            className={`${filterStates.filterByScope === 'Me' ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#ABABAB]'}`}
            onClick={() => {
              // queryClient.invalidateQueries('FeedData');
              handleButtonSelection('my-posts', null, 'myPostButton');
            }}
            disabled={isFetching}
            id={'myPostButton'}
          >
            My Posts
          </Button>
          <Button
            variant={'topics'}
            className={`${filterStates.bookmarks === true ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#ABABAB]'}`}
            onClick={() => {
              // queryClient.invalidateQueries('FeedData');
              handleButtonSelection('bookmarks', null, 'bookmarkButton');
            }}
            disabled={isFetching}
            id={'bookmarkButton'}
          >
            Bookmarks
          </Button>
        </div>
        <div className="flex gap-[6.75px] tablet:gap-[13.82px]">
          {filterStates.topics?.All?.list.map((item, index) => {
            const isItemBlocked = filterStates.topics?.Block && filterStates.topics?.Block?.list?.includes(item);
            let startX = 0;
            let startY = 0;

            const handleMouseDown = (e) => {
              startX = e.clientX;
              startY = e.clientY;
            };

            const handleMouseUp = (e) => {
              const distance = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
              if (distance < 5) {
                // queryClient.invalidateQueries('FeedData');
                setFilters({
                  ...filterStates,
                  filterBySort: '',
                  filterByScope: '',
                  bookmarks: false,
                  topics: {
                    ...filterStates.topics,
                    Block: {
                      ...filterStates.topics.Block,
                      list: [item],
                    },
                  },
                  selectedBtnId: `topic-${index}`,
                });
                handleButtonSelection('topics', item, `topic-${index}`);
              }
            };

            return (
              <Button
                variant={'topics'}
                className={`${isItemBlocked ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#707175]'}`}
                key={index}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                disabled={isFetching}
                id={`topic-${index}`}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>
      <button
        onClick={handleRightArrowClick}
        className="size-[10px] min-w-[10px] max-w-[10px] tablet:size-5 tablet:min-w-5 tablet:max-w-5"
        style={{
          background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      ></button>
    </div>
  );
}

export default Slider;
