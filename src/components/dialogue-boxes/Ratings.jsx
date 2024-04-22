import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector, useDispatch } from 'react-redux';

import PopUp from '../ui/PopUp';
// extras
import * as homeFilterActions from '../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';

export const StatusFiltersList = [
  {
    id: 1,
    title: 'All',
  },
  {
    id: 2,
    title: 'Not Participated',
  },
  {
    id: 3,
    title: 'Participated',
  },
];

export const MediaFiltersList = [
  {
    id: 1,
    title: 'Images',
  },
  {
    id: 2,
    title: 'Video',
  },

  {
    id: 3,
    title: 'Audio',
  },
  {
    id: 4,
    title: 'None',
  },
];

export const TypeFiltersList = [
  {
    id: 1,
    title: 'All',
  },
  {
    id: 2,
    title: 'Yes/No',
  },
  {
    id: 3,
    title: 'Multiple Choice',
  },
  {
    id: 4,
    title: 'Open Choice',
  },
  {
    id: 5,
    title: 'Rank Choice',
  },
  {
    id: 6,
    title: 'Agree/Disagree',
  },
  {
    id: 7,
    title: 'Like/Dislike',
  },
];

const FilterContainer = (props) => {
  const { list, style } = props;
  return (
    <div className="w-full">
      <div className="rounded-t-[15px] bg-[#DEE6F7] py-2">
        <h1 className="text-center text-[12px] font-bold text-[#707175] tablet:text-[22px]">Status</h1>
      </div>
      <div
        className={` ${style === 'yes' ? 'grid h-[calc(125px-26px)] grid-cols-2' : 'flex h-[calc(100%-34px)]'} flex-col gap-[6px] rounded-b-[15px] border-x-[3px] border-b-[3px] border-[#DEE6F7] bg-[#FDFDFD] p-2 tablet:h-[calc(100%-49px)] tablet:gap-4 tablet:p-[15px]`}
      >
        {list?.map((item) => (
          <div className="flex items-center gap-3 tablet:gap-6">
            <div className="flex size-4 items-center justify-center rounded-full border-2 border-[#525252] tablet:size-6">
              <div className="size-2 rounded-full bg-[#525252] tablet:size-[14px]"></div>
            </div>
            <h3 className="whitespace-nowrap text-center text-[12px] font-normal leading-[12px] text-[#707175] tablet:text-[18px] tablet:font-semibold tablet:leading-[18px]">
              {item.title}
            </h3>
          </div>
        ))}
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
        <div className="mt-3 grid grid-cols-2 gap-[15px] tablet:mt-5 tablet:grid-cols-3">
          <FilterContainer list={StatusFiltersList} />
          <FilterContainer list={MediaFiltersList} />
          <div className="hidden tablet:block">
            <FilterContainer list={TypeFiltersList} />
          </div>
        </div>
        <div className="mt-3 block tablet:hidden">
          <FilterContainer list={TypeFiltersList} style="yes" />
        </div>
        <div className="mt-[10px] flex items-center justify-end gap-[25px] tablet:mt-[25px] tablet:gap-[35px]">
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
