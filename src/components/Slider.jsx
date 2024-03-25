import { Button } from './ui/Button';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as homeFilterActions from '../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../features/sidebar/bookmarkFilterSlice';
import * as QuestServices from '../services/queries/quest';

function Slider({ nextPage, feedData, sliderLoading, setSliderloading }) {
  let filtersActions;
  const dispatch = useDispatch();
  const location = useLocation();
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

  const handleButtonSelection = (type, data, id) => {
    // Save the id of the selected button in localStorage for scrolling it into view
    localStorage.setItem('selectedButtonId', id);
    const selectedButton = document.getElementById(id);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    switch (type) {
      case 'newest-first':
        if (filterStates.filterBySort !== 'Newest First') {
          setSliderloading(true);
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setFilterBySort('Newest First'));
        }
        break;
      case 'most-popular':
        if (filterStates.filterBySort !== 'Most Popular') {
          setSliderloading(true);
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setFilterBySort('Most Popular'));
        }
        break;
      case 'my-posts':
        if (filterStates.filterByScope !== 'Me') {
          setSliderloading(true);
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterBySort(''));
          dispatch(filtersActions.setFilterByScope('Me'));
        }
        break;
      case 'topics':
        if (filterStates.topics?.Block && filterStates.topics?.Block.list.includes(data)) return;
        setSliderloading(true);
        dispatch(homeFilterActions.setBlockTopics([data]));
        dispatch(filtersActions.setFilterBySort(''));
        dispatch(filtersActions.setFilterByScope('All'));
        break;
      default:
        break;
    }
  };

  return (
    <div className="mx-4 my-[7px] flex items-center tablet:mx-6 tablet:my-[14.82px]">
      {scrollPosition > 0 && (
        <button
          onClick={handleLeftArrowClick}
          className="h-[10px] w-[20px] rotate-180 tablet:h-[21px] tablet:w-14"
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
            className={`${filterStates.filterBySort === 'Newest First' ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'}`}
            onClick={() => {
              handleButtonSelection('newest-first', null, 'newButton');
            }}
            disabled={sliderLoading}
            id={'newButton'}
          >
            New!
          </Button>
          <Button
            variant={'topics'}
            className={`${filterStates.filterBySort === 'Most Popular' ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'}`}
            onClick={() => {
              handleButtonSelection('most-popular', null, 'trendingButton');
            }}
            disabled={sliderLoading}
            id={'trendingButton'}
          >
            Trending!
          </Button>
          <Button
            variant={'topics'}
            className={`${filterStates.filterByScope === 'Me' ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'} $ text-nowrap`}
            onClick={() => {
              handleButtonSelection('my-posts', null, 'myPostButton');
            }}
            disabled={sliderLoading}
            id={'myPostButton'}
          >
            My Posts
          </Button>
        </div>
        <div className="flex gap-[6.75px]  tablet:gap-[13.82px]">
          {filterStates.topics?.All?.list.map((item, index) => {
            const isItemBlocked = filterStates.topics?.Block && filterStates.topics?.Block?.list.includes(item);
            let startX = 0;
            let startY = 0;

            const handleMouseDown = (e) => {
              startX = e.clientX;
              startY = e.clientY;
            };

            const handleMouseUp = (e) => {
              const distance = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
              if (distance < 5) {
                handleButtonSelection('topics', item, `topic-${index}`);
              }
            };

            return (
              <Button
                variant={'topics'}
                className={`${isItemBlocked ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#707175]'}`}
                key={index + 1}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                disabled={sliderLoading}
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
        className="h-[10px] w-[20px] tablet:h-[21px] tablet:w-14"
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
