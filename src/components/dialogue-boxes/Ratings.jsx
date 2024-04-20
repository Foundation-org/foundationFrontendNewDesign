import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector, useDispatch } from 'react-redux';

import PopUp from '../ui/PopUp';
// extras
import * as homeFilterActions from '../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';

const FilterContainer = () => {
  return (
    <div className="w-full rounded-t-[15px]">
      <div className="rounded-t-[15px] bg-[#DEE6F7] py-2">
        <h1 className="text-center text-[22px] font-bold text-[#707175]">Status</h1>
      </div>
      <div className="rounded-b-[15px] border-x-[3px] border-b-[3px] border-[#DEE6F7] bg-[#FDFDFD] p-[15px]">
        <div className="flex items-center gap-6">
          <input id="red-radio" type="radio" value="" name="colored-radio" class="size-6 accent-[#525252]" />
          <h3 className="text-center text-[18px] font-semibold leading-[18px] text-[#707175]">All</h3>
        </div>
      </div>
    </div>
  );
};

export default function Ratings({ handleClose, modalVisible, selectedOptions, setSelectedOptions, setFilters }) {
  const location = useLocation();

  let filtersActions;
  if (location.pathname === '/dashboard/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  const dispatch = useDispatch();
  const filterStates = useSelector(filtersActions.getFilters);

  useEffect(() => {
    dispatch(
      filtersActions.setRatings({
        initial: filterStates.moderationRatingFilter?.initial ? filterStates.moderationRatingFilter?.initial : 0,
        final: filterStates.moderationRatingFilter?.final ? filterStates.moderationRatingFilter?.final : 0,
      }),
    );
    if (filterStates.moderationRatingFilter?.initial === 0 && filterStates.moderationRatingFilter?.final === 100) {
      setSelectedOptions(['adult', 'everyone']);
    } else if (
      filterStates.moderationRatingFilter?.initial === 1 &&
      filterStates.moderationRatingFilter?.final === 100
    ) {
      setSelectedOptions(['adult']);
    } else {
      setSelectedOptions(['everyone']);
    }
  }, []);

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      if (selectedOptions.length > 1) {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      }
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.includes('adult') && selectedOptions.includes('everyone')) {
      dispatch(
        filtersActions.setRatings({
          initial: 0,
          final: 100,
        }),
      );
      setFilters({
        ...filterStates,
        filterByType: '',
        filterByStatus: '',
        filterBySort: 'Newest First',
        filterByScope: '',
        bookmarks: false,
        topics: {
          ...filterStates.topics,
          Block: {
            ...filterStates.topics.Block,
            list: [],
          },
        },
        moderationRatingFilter: {
          initial: 0,
          final: 100,
        },
        selectedBtnId: localStorage.removeItem('selectedButtonId'),
      });
    } else if (selectedOptions.includes('adult')) {
      dispatch(
        filtersActions.setRatings({
          initial: 1,
          final: 100,
        }),
      );
      setFilters({
        ...filterStates,
        filterByType: '',
        filterByStatus: '',
        filterBySort: 'Newest First',
        filterByScope: '',
        bookmarks: false,
        topics: {
          ...filterStates.topics,
          Block: {
            ...filterStates.topics.Block,
            list: [],
          },
        },
        moderationRatingFilter: {
          initial: 1,
          final: 100,
        },
        selectedBtnId: localStorage.removeItem('selectedButtonId'),
      });
    } else {
      dispatch(
        filtersActions.setRatings({
          initial: 0,
          final: 0,
        }),
      );
      setFilters({
        ...filterStates,
        filterByType: '',
        filterByStatus: '',
        filterBySort: 'Newest First',
        filterByScope: '',
        bookmarks: false,
        topics: {
          ...filterStates.topics,
          Block: {
            ...filterStates.topics.Block,
            list: [],
          },
        },
        moderationRatingFilter: {
          initial: 0,
          final: 0,
        },
        selectedBtnId: localStorage.removeItem('selectedButtonId'),
      });
    }

    handleClose();
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/ratings-icon.svg`}
      title={'Rating'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] pt-[10px] tablet:px-[45px] tablet:pt-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Rating Category
        </h1>
        <div className="mt-[10px] flex items-center justify-center gap-[36.8px] border-b border-[#7C7C7C] pb-[25px] tablet:mt-[25px] tablet:gap-[100px]">
          <div className="flex items-center justify-center gap-[10px] tablet:gap-[25px]">
            <div id="custom-rating-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[13.5px] w-[13.5px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={selectedOptions.includes('everyone')}
                onChange={() => handleCheckboxChange('everyone')}
                readOnly
              />
            </div>
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-e.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Everyone</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[10px] tablet:gap-[25px]">
            <div id="custom-rating-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[13.5px] w-[13.5px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={selectedOptions.includes('adult')}
                onChange={() => handleCheckboxChange('adult')}
                readOnly
              />
            </div>
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-r.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Adult</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-[18px] py-[10px] tablet:px-[45px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Filter Options
        </h1>
        <div className="grid grid-cols-3 gap-[15px]">
          <FilterContainer />
          <FilterContainer />
          <FilterContainer />
        </div>
        <div className="mt-[10px] flex items-center justify-end gap-[25px] tablet:mt-[25px] tablet:gap-[49px]">
          <Button
            variant={'danger'}
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>

          <Button variant={'submit'} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
