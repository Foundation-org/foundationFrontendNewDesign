import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/Button';

import * as homeFilterActions from '../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../features/sidebar/bookmarkFilterSlice';
import * as QuestServices from '../services/queries/quest';
import * as prefActions from '../features/preferences/prefSlice';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function Slider({ columns, setColumns, feedData, sliderLoading, setSliderloading }) {
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
  const getPreferences = useSelector(prefActions.getPrefs);
  const filterStates = useSelector(filtersActions.getFilters);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [multipleOption, setMultipleOption] = useState(
    localStorage.getItem('filterByState') !== undefined
      ? localStorage.getItem('filterByState') === 'true'
        ? true
        : false
      : false,
  );
  const [localMe, setLocalMe] = useState(multipleOption);

  const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();
  const { data: prefSearchRes } = QuestServices.useSearchTopics(getPreferences);

  useEffect(() => {
    if (prefSearchRes?.length !== 0) {
      setColumns((prevColumns) => {
        const newList = prefSearchRes?.data.data || [];
        // const filteredList = newList.filter(
        //   (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
        // );
        const filteredList = newList.filter((item) => !prevColumns.Block.list.includes(item));

        return {
          ...prevColumns,
          All: {
            ...prevColumns.All,
            list: filteredList || [],
          },
        };
      });
    } else {
      if (isSuccess) {
        setColumns((prevColumns) => {
          const newList = topicsData?.data.data || [];
          // const filteredList = newList.filter(
          //   (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
          // );

          // const filteredList = newList.filter((item) => !prevColumns.Block.list.includes(item));

          return {
            ...prevColumns,
            All: {
              ...prevColumns.All,
              list: newList || [],
              // list: filteredList || [],
            },
          };
        });
      }
    }
  }, [topicsData, prefSearchRes, isSuccess]);

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
      } else {
        setScrollPosition(e.pageX - startX);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMyPosts = () => {
    setLocalMe(!multipleOption);
    dispatch(filtersActions.setFilterByScope(multipleOption ? 'All' : 'Me'));
    localStorage.setItem('filterByState', !multipleOption ? 'true' : 'false');
    setMultipleOption(!multipleOption);
  };

  const handleClearMyPosts = () => {
    setLocalMe(false);
    dispatch(filtersActions.setFilterByScope('All'));
    localStorage.setItem('filterByState', 'false');
    setMultipleOption(false);
  };

  useEffect(() => {
    if (localStorage.getItem('filterByState') === 'true') {
      setMultipleOption(true);
      setLocalMe(true);
    } else {
      setMultipleOption(false);
      setLocalMe(false);
    }
  }, [localStorage.getItem('filterByState')]);

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
    container.scrollTo({
      left: scrollPosition + scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleLeftArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth / 2;
    setScrollPosition(scrollPosition - scrollAmount);
    container.scrollTo({
      left: scrollPosition - scrollAmount,
      behavior: 'smooth',
    });
  };

  const clearBlockList = () => {
    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns }; // Create a shallow copy of the columns object
      updatedColumns['Block'].list = []; // Set the list property of the Block column to an empty array
      return updatedColumns; // Return the updated columns object
    });
  };

  const handleSelectTopic = (item) => {
    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns }; // Create a shallow copy of the columns object
      const blockList = updatedColumns['Block'].list;

      const itemIndex = blockList.indexOf(item); // Check if the item exists in the Block list
      if (itemIndex !== -1) {
        // If the item exists, remove it from the Block list
        blockList.splice(itemIndex, 1);
      }

      // Clear the blockList and add the new item
      updatedColumns['Block'].list = [item];

      return updatedColumns; // Return the updated columns object
    });
  };

  const handleButtonSelection = (type, data) => {
    setSliderloading(true);
    if (type === 'newest-first') {
      if (filterStates.filterBySort !== 'Newest First') {
        clearBlockList();
        handleClearMyPosts();
        dispatch(filtersActions.setFilterBySort('Newest First'));
      }
    }
    if (type === 'most-popular') {
      if (filterStates.filterBySort !== 'Most Popular') {
        handleClearMyPosts();
        clearBlockList();
        dispatch(filtersActions.setFilterBySort('Most Popular'));
      }
    }
    if (type === 'my-posts') {
      if (!localMe) {
        clearBlockList();
        dispatch(filtersActions.setFilterBySort(''));
        handleMyPosts();
      }
    }
    if (type === 'topics') {
      handleSelectTopic(data);
      dispatch(filtersActions.setFilterBySort(''));
      handleClearMyPosts();
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
              handleButtonSelection('newest-first');
            }}
            disabled={sliderLoading || feedData === undefined}
          >
            New!
          </Button>
          <Button
            variant={'topics'}
            className={`${filterStates.filterBySort === 'Most Popular' ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'}`}
            onClick={() => {
              handleButtonSelection('most-popular');
            }}
            disabled={sliderLoading || feedData === undefined}
          >
            Trending!
          </Button>
          <Button
            variant={'topics'}
            className={`${localMe ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'}`}
            onClick={() => {
              handleButtonSelection('my-posts');
            }}
            disabled={sliderLoading || feedData === undefined}
          >
            My Posts
          </Button>
        </div>
        <div className="flex gap-[6.75px]  tablet:gap-[13.82px]">
          {columns?.All.list.map((item, index) => {
            const isItemBlocked = columns?.Block.list.includes(item);
            return (
              <Button
                variant={'topics'}
                className={`${isItemBlocked ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#707175]'}`}
                key={index + 1}
                onClick={() => {
                  handleButtonSelection('topics', item);
                }}
                disabled={sliderLoading || feedData === undefined}
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
      ></button>{' '}
    </div>
  );
}

export default Slider;
