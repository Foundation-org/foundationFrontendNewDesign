import { useEffect, useState } from 'react';
import { Button } from './ui/Button';

import * as homeFilterActions from '../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Slider({ columns, setColumns }) {
  console.log('first', columns);
  let filtersActions;
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  if (pathname === '/dashboard/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  const [scrollPosition, setScrollPosition] = useState(0);

  const [multipleOption, setMultipleOption] = useState(
    localStorage.getItem('filterByState') !== undefined
      ? localStorage.getItem('filterByState') === 'true'
        ? true
        : false
      : false,
  );
  const [localMe, setLocalMe] = useState(multipleOption);

  const handleMyPosts = () => {
    setLocalMe(!multipleOption);
    dispatch(filtersActions.setFilterByScope(multipleOption ? 'All' : 'Me'));
    localStorage.setItem('filterByState', !multipleOption ? 'true' : 'false');
    setMultipleOption(!multipleOption);
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

  const handleRightArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth;
    setScrollPosition(scrollPosition + scrollAmount);
    container.scrollTo({
      left: scrollPosition + scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleLeftArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth;
    setScrollPosition(scrollPosition - scrollAmount);
    container.scrollTo({
      left: scrollPosition - scrollAmount,
      behavior: 'smooth',
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
      } else {
        // If the item does not exist, add it to the Block list
        blockList.push(item);
      }

      return updatedColumns; // Return the updated columns object
    });
  };

  return (
    <div className="mx-4 my-[7px] flex items-center tablet:mx-6 tablet:my-[14.82px]">
      {scrollPosition > 0 && (
        <button
          onClick={handleLeftArrowClick}
          className="h-[10px] w-[20px] rotate-180 tablet:h-[21px] tablet:w-[42px] "
          style={{
            background: 'url(/assets/svgs/arrow-right.svg',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        ></button>
      )}
      <div
        className="no-scrollbar mx-[5px] flex items-center gap-[6.75px] overflow-x-auto tablet:mx-[0px] tablet:gap-[13.82px]"
        id="buttonContainer"
      >
        <div className="flex gap-[6.75px] border-r-[2.4px] border-[#CECECE] pr-[6.75px] tablet:gap-[13.82px] tablet:pr-[13.82px]">
          <Button variant={'topics'} className={'bg-white text-[#ABABAB]'}>
            New!
          </Button>
          <Button variant={'topics'} className={'bg-white text-[#ABABAB]'}>
            Trending!
          </Button>
          <Button
            variant={'topics'}
            className={`${localMe ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'}`}
            onClick={handleMyPosts}
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
                  handleSelectTopic(item);
                }}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>
      <button
        onClick={handleRightArrowClick}
        className="h-[10px] w-[20px] tablet:h-[21px] tablet:w-[42px] "
        style={{
          background: 'url(/assets/svgs/arrow-right.svg',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      ></button>{' '}
    </div>
  );
}

export default Slider;
