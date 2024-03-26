import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector, useDispatch } from 'react-redux';

import PopUp from '../ui/PopUp';
// extras
import * as homeFilterActions from '../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';

function valuetext(value) {
  return <p style={{ background: '#4A8DBD', color: 'white' }}>`${value}`</p>;
}

export default function Ratings({ handleClose, modalVisible, questStartData }) {
  const location = useLocation();

  let filtersActions;
  if (location.pathname === '/dashboard/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  const dispatch = useDispatch();
  const filterStates = useSelector(filtersActions.getFilters);

  const [value, setValue] = useState([0, 60]);

  useEffect(() => {
    setValue([
      filterStates.moderationRatingFilter?.initial ? filterStates.moderationRatingFilter?.initial : 0,
      filterStates.moderationRatingFilter?.final ? filterStates.moderationRatingFilter?.final : 60,
    ]);
    dispatch(
      filtersActions.setRatings({
        initial: value[0],
        final: value[1],
      }),
    );
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/ratings-icon.svg`}
      title={'Rating'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[75px] tablet:py-[25px]">
        <h1 className="text-center text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Rating Category
        </h1>
        <div className="mt-[10px] flex items-center justify-center gap-[36.8px] tablet:mt-[15px]  tablet:gap-[100px]">
          <Button
            variant={'submit'}
            onClick={() => {
              dispatch(
                filtersActions.setRatings({
                  initial: 0,
                  final: 60,
                }),
              );
              handleClose();
            }}
          >
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-e.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p>Everyone</p>
            </div>
          </Button>
          <Button
            variant={'submit'}
            onClick={() => {
              dispatch(
                filtersActions.setRatings({
                  initial: 61,
                  final: 100,
                }),
              );
              handleClose();
            }}
          >
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-r.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p>Adult</p>
            </div>
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
