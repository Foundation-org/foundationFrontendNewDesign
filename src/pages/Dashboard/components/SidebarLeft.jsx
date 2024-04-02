import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

// components
import Dropdown2 from '../../../components/Dropdown2';

// extras
import * as homeFilterActions from '../../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../../features/sidebar/bookmarkFilterSlice';

// icons
import { GrClose } from 'react-icons/gr';
import { setBookmarkFilterStates, setFilterStates } from '../../../services/api/userAuth';
import { useDebounce } from '../../../utils/useDebounce';
import Ratings from '../../../components/dialogue-boxes/Ratings';

const SidebarLeft = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  let filtersActions;
  if (pathname === '/dashboard/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(filtersActions.getFilters);
  const [ratingsDialogue, setRatingsDialogue] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); //for ratings
  const [search, setSearch] = useState(
    pathname === '/dashboard/bookmark'
      ? persistedUserInfo?.bookmarkStates.searchData
      : persistedUserInfo?.States.searchData,
  );

  const showRatingDialogue = () => setRatingsDialogue(true);
  const hideRatingDialogue = () => setRatingsDialogue(false);

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: setBookmarkFilters } = useMutation({
    mutationFn: setBookmarkFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (persistedUserInfo) {
      if (pathname === '/dashboard/bookmark') {
        dispatch(filtersActions.setFilterByScope(persistedUserInfo.bookmarkStates.filterByScope));
        dispatch(filtersActions.setFilterBySort(persistedUserInfo.bookmarkStates.filterBySort));
        dispatch(filtersActions.setFilterByStatus(persistedUserInfo.bookmarkStates.filterByStatus));
        dispatch(filtersActions.setFilterByType(persistedUserInfo.bookmarkStates.filterByType));
        dispatch(filtersActions.setExpandedView(true));
        dispatch(filtersActions.setSearchData(persistedUserInfo.bookmarkStates.searchData));
        dispatch(
          filtersActions.setRatings({
            initial: persistedUserInfo.bookmarkStates.moderationRatingFilter?.initial
              ? persistedUserInfo.bookmarkStates.moderationRatingFilter?.initial
              : 0,
            final: persistedUserInfo.bookmarkStates.moderationRatingFilter?.final
              ? persistedUserInfo.bookmarkStates.moderationRatingFilter?.final
              : 0,
          }),
        );
      } else {
        dispatch(filtersActions.setFilterByScope(persistedUserInfo.States.filterByScope));
        dispatch(filtersActions.setFilterBySort(persistedUserInfo.States.filterBySort));
        dispatch(filtersActions.setFilterByStatus(persistedUserInfo.States.filterByStatus));
        dispatch(filtersActions.setFilterByType(persistedUserInfo.States.filterByType));
        dispatch(filtersActions.setExpandedView(true));
        dispatch(filtersActions.setSearchData(persistedUserInfo.States.searchData));
        dispatch(filtersActions.setBlockTopics(persistedUserInfo.States.topics?.Block.list));
        dispatch(
          filtersActions.setRatings({
            initial: persistedUserInfo.States.moderationRatingFilter?.initial
              ? persistedUserInfo.States.moderationRatingFilter?.initial
              : 0,
            final: persistedUserInfo.States.moderationRatingFilter?.final
              ? persistedUserInfo.States.moderationRatingFilter?.final
              : 0,
          }),
        );
        localStorage.setItem('selectedButtonId', persistedUserInfo.States.selectedBtnId);
      }
    }
  }, []);

  useEffect(() => {
    if (pathname === '/dashboard/bookmark') {
      setBookmarkFilters({ ...filterStates, columns: filterStates.topics });
    } else {
      setFilters({ ...filterStates, selectedBtnId: localStorage.getItem('selectedButtonId') });
    }
  }, [filterStates]);

  // Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    dispatch(filtersActions.setSearchData(debouncedSearch));
  }, [debouncedSearch]);

  useEffect(() => {
    if (filterStates.searchData === '') {
      setSearch('');
    }
  }, [filterStates.searchData]);

  useEffect(() => {
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
  }, [ratingsDialogue]);

  return (
    <>
      <Ratings
        modalVisible={ratingsDialogue}
        handleClose={hideRatingDialogue}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <div className="no-scrollbar mt-5 hidden h-fit max-h-[calc(100vh-96px)] w-[18.75rem] min-w-[18.75rem] flex-col items-center justify-between rounded-[17.928px] bg-white pb-14 pt-8 text-[#535353] laptop:flex 5xl:w-[23rem] 5xl:min-w-[23rem] dark:bg-[#000] dark:text-white">
        <div className="flex flex-col items-center">
          <div className="flex w-full flex-col items-center justify-center gap-[25px] border-b-[1.32px] border-[#9C9C9C] pb-[25px]">
            <div className="relative">
              <div className="relative h-[45px] w-[212px]">
                <input
                  type="text"
                  id="floating_outlined"
                  className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                  value={search}
                  placeholder=""
                  onChange={handleSearch}
                />
                <label
                  htmlFor="floating_outlined"
                  className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
                >
                  Search
                </label>
              </div>
              {search && (
                <button
                  className="absolute right-3 top-4"
                  onClick={() => {
                    dispatch(filtersActions.setSearchData(''));
                    setSearch('');
                  }}
                >
                  <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
                </button>
              )}
              {!search && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                  alt="search"
                  className="absolute right-3 top-4 h-4 w-4"
                />
              )}
            </div>
            <div className="h-[1.325px] w-full bg-[#9C9C9C]" />
            <button
              onClick={() => {
                showRatingDialogue();
              }}
              className={`${
                persistedTheme === 'dark' ? 'bg-[#EDEDED]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
              } w-[212px] rounded-[9.338px] px-5 py-3 text-[18px] font-medium leading-[18px] text-white focus:outline-none dark:text-[#707175]`}
            >
              {/* Topics */}
              Rating
            </button>
          </div>
          <h1 className="flex w-[212px] items-center gap-2 pb-[38px] pt-[24px] text-[22px] font-[500] leading-none text-[#888] dark:text-white">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/filter.svg`}
              alt="filter"
              className="h-[1.188rem] w-[1.188rem]"
            />
            Filters
          </h1>
          <div className="flex flex-col gap-[3vh]">
            <Dropdown2
              label={'Status'}
              title={filterStates.filterByStatus ? filterStates.filterByStatus : 'All'}
              items={['All', 'Not Participated', 'Participated']}
              handleSelect={(item) => {
                dispatch(filtersActions.setFilterByStatus(item));
              }}
            />
            <Dropdown2
              label={'Type'}
              title={
                filterStates.filterByType && filterStates.filterByType === 'Multiple Choise'
                  ? 'Multiple Choice'
                  : filterStates.filterByType === 'Open Choice'
                    ? 'Open Choice'
                    : filterStates.filterByType === 'Ranked Choise'
                      ? 'Ranked Choice'
                      : filterStates.filterByType
                        ? filterStates.filterByType
                        : 'All'
              }
              items={[
                'All',
                'Yes/No',
                'Agree/Disagree',
                'Like/Dislike',
                'Multiple Choice',
                'Open Choice',
                'Ranked Choice',
              ]}
              handleSelect={(item) => {
                dispatch(filtersActions.setFilterByType(item));
              }}
            />
          </div>
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#F0F0F0]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            }  inset-0 mt-7 w-[192px] rounded-[14px] px-5 py-[6px] text-[1.25rem] font-semibold leading-normal text-white shadow-inner dark:text-[#707175]`}
            onClick={() => {
              dispatch(filtersActions.resetFilters());
              setSearch('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
      {/* sidebar mobile */}
      <div className="block border-b-4 border-[#F3F3F3] bg-white px-[15px] py-[10px] tablet:px-[37px] tablet:py-[26px] laptop:hidden dark:bg-[#0A0A0C]">
        <div className="mt-[10px] flex items-end justify-between gap-[6px]">
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            }  inset-0 w-fit text-nowrap rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-normal leading-[1.032] text-white shadow-inner tablet:w-full tablet:pt-2 tablet:text-[15px] tablet:font-semibold tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
            onClick={() => {
              showRatingDialogue();
            }}
          >
            Rating
          </button>
          <Dropdown2
            label={'Status'}
            title={filterStates.filterByStatus ? filterStates.filterByStatus : 'All'}
            items={['All', 'Not Participated', 'Participated']}
            handleSelect={(item) => {
              dispatch(filtersActions.setFilterByStatus(item));
            }}
          />
          <Dropdown2
            label={'Type'}
            title={
              filterStates.filterByType && filterStates.filterByType === 'Multiple Choise'
                ? 'Multiple Choice'
                : filterStates.filterByType === 'Open Choice'
                  ? 'Open Choice'
                  : filterStates.filterByType === 'Ranked Choise'
                    ? 'Ranked Choice'
                    : filterStates.filterByType
                      ? filterStates.filterByType
                      : 'All'
            }
            items={[
              'All',
              'Yes/No',
              'Agree/Disagree',
              'Like/Dislike',
              'Multiple Choice',
              'Open Choice',
              'Ranked Choice',
            ]}
            handleSelect={(item) => {
              dispatch(filtersActions.setFilterByType(item));
            }}
          />
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            }  inset-0 w-fit whitespace-nowrap rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-normal leading-[1.032] text-white shadow-inner tablet:w-full tablet:pt-2 tablet:text-[15px] tablet:font-semibold tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
            onClick={() => {
              dispatch(filtersActions.resetFilters());
              localStorage.setItem('filterByState', 'false');
            }}
          >
            Clear Filters
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 tablet:mt-[21px] tablet:gap-[13px]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search here...."
              className="h-[30px] w-full min-w-[215px] rounded-[8px] border-[0.59px] border-[#707175] bg-[#F6F6F6] px-[10px] text-[9px] font-normal text-[#858585] focus:outline-none tablet:h-[50.7px] tablet:text-[17.13px] dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8]"
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <button
                className="absolute right-3 top-[50%] translate-y-[-50%]"
                onClick={() => {
                  dispatch(filtersActions.setSearchData(''));
                  setSearch('');
                }}
              >
                <GrClose className="h-2 w-2 text-black dark:text-white" />
              </button>
            )}
            {!search && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                alt="search"
                className="absolute right-[12px] top-[9px] h-3 w-3 tablet:top-3 tablet:h-[26.4px] tablet:w-[24.3px]"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;
