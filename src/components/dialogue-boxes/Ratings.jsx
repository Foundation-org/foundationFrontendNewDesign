import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector, useDispatch } from 'react-redux';

import PopUp from '../ui/PopUp';
// extras
import * as homeFilterActions from '../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';

export default function Ratings({ handleClose, modalVisible, selectedOptions, setSelectedOptions }) {
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
      console.log('inside');
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
    } else if (selectedOptions.includes('adult')) {
      dispatch(
        filtersActions.setRatings({
          initial: 1,
          final: 100,
        }),
      );
    } else {
      dispatch(
        filtersActions.setRatings({
          initial: 0,
          final: 0,
        }),
      );
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
      <div className="px-[18px] py-[10px] tablet:px-[45px] tablet:py-[25px]">
        <h1 className="text-center text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Rating Category
        </h1>
        <div className="mt-[10px] flex items-center justify-center gap-[36.8px] tablet:mt-[15px]  tablet:gap-[100px]">
          <div className="flex items-center justify-center gap-[10px] tablet:gap-[32px]">
            <input
              type="checkbox"
              className="h-[15px] w-[15px] tablet:h-[25px] tablet:w-[25px]"
              checked={selectedOptions.includes('everyone')}
              onChange={() => handleCheckboxChange('everyone')}
            />
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-e.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p className="text-[10px] tablet:text-[20px]">Everyone</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[10px] tablet:gap-[32px]">
            <input
              type="checkbox"
              className="h-[15px] w-[15px] tablet:h-[25px] tablet:w-[25px]"
              checked={selectedOptions.includes('adult')}
              onChange={() => handleCheckboxChange('adult')}
            />
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-r.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p className="text-[10px] tablet:text-[20px]">Adult</p>
            </div>
          </div>
        </div>
        <div className="mt-[10px] flex items-center  justify-end gap-[25px] tablet:mt-[15px] tablet:gap-[49px]">
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
