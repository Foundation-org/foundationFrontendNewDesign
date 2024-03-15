import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// components
import Dropdown2 from '../../../components/Dropdown2';
import CustomSwitch2 from '../../../components/CustomSwitch2';
import BasicModal from '../../../components/BasicModal';
import TopicPreferences from './topicpreferences';

// extras
import * as homeFilterActions from '../../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../../features/sidebar/bookmarkFilterSlice';

// icons
import { GrClose } from 'react-icons/gr';
import { topicPreferencesModalStyle } from '../../../assets/styles';
import { setBookmarkFilterStates, setFilterStates, userInfo, userInfoById } from '../../../services/api/userAuth';
import { addUser } from '../../../features/auth/authSlice';
import { useDebounce } from '../../../utils/useDebounce';

const SidebarLeft = ({ columns, setColumns, itemsWithCross, setItemsWithCross }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState(
    pathname === '/dashboard/bookmark'
      ? persistedUserInfo?.bookmarkStates.searchData
      : persistedUserInfo?.States.searchData,
  );

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
  });

  const handleUserInfo = async () => {
    try {
      const resp = await getUserInfo();

      if (resp?.status === 200) {
        // Cookie Calling
        if (resp.data) {
          dispatch(addUser(resp?.data));
          // Set into local storage
          if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', resp.data.uuid);
          }
        }

        // LocalStorage Calling
        if (!resp.data) {
          const res = await userInfoById(localStorage.getItem('uuid'));
          dispatch(addUser(res?.data));
          if (res?.data?.requiredAction) {
            setModalVisible(true);
          }
        }

        if (resp?.data?.requiredAction) {
          setModalVisible(true);
        }
      }

      // setResponse(resp?.data);
    } catch (e) {
      console.log({ e });
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onSuccess: (resp) => {
      handleUserInfo();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: setBookmarkFilters } = useMutation({
    mutationFn: setBookmarkFilterStates,
    onSuccess: (resp) => {
      handleUserInfo();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  let filtersActions;
  if (pathname === '/dashboard/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  useEffect(() => {
    if (persistedUserInfo) {
      if (pathname === '/dashboard/bookmark') {
        dispatch(filtersActions.setFilterByScope(persistedUserInfo.bookmarkStates.filterByScope));
        dispatch(filtersActions.setFilterBySort(persistedUserInfo.bookmarkStates.filterBySort));
        dispatch(filtersActions.setFilterByStatus(persistedUserInfo.bookmarkStates.filterByStatus));
        dispatch(filtersActions.setFilterByType(persistedUserInfo.bookmarkStates.filterByType));
        dispatch(filtersActions.setExpandedView(true));
        dispatch(filtersActions.setSearchData(persistedUserInfo.bookmarkStates.searchData));
        const stateString = JSON.stringify(persistedUserInfo?.bookmarkStates?.columns);
        localStorage.setItem('bookmarkColumns', stateString);
      } else {
        dispatch(filtersActions.setFilterByScope(persistedUserInfo.States.filterByScope));
        dispatch(filtersActions.setFilterBySort(persistedUserInfo.States.filterBySort));
        dispatch(filtersActions.setFilterByStatus(persistedUserInfo.States.filterByStatus));
        dispatch(filtersActions.setFilterByType(persistedUserInfo.States.filterByType));
        dispatch(filtersActions.setExpandedView(true));
        dispatch(filtersActions.setSearchData(persistedUserInfo.States.searchData));
        const stateString = JSON.stringify(persistedUserInfo?.States?.columns);
        localStorage.setItem('columns', stateString);
      }
    }
  }, [persistedUserInfo]);

  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(filtersActions.getFilters);

  useEffect(() => {
    if (pathname === '/dashboard/bookmark') {
      setBookmarkFilters({ ...filterStates, columns: columns });
    } else {
      setFilters({ ...filterStates, columns: columns });
    }
  }, [filterStates, columns]);

  const [multipleOption, setMultipleOption] = useState(
    localStorage.getItem('filterByState') !== undefined
      ? localStorage.getItem('filterByState') === 'true'
        ? true
        : false
      : false,
  );
  const [localMe, setLocalMe] = useState(multipleOption);
  const [openTopicPref, setOpenTopicPref] = useState(false);

  const handleSwitchChange = () => {
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

  const handleExpendedView = () => {
    localStorage.setItem('expandedView', !filterStates.expandedView ? 'true' : 'false');
    dispatch(filtersActions.toggleExapandedView());
  };

  const handleTopicPref = () => {
    setOpenTopicPref(!openTopicPref);
  };

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

  return (
    <>
      <div className="no-scrollbar mt-5 hidden h-fit max-h-[calc(100vh-96px)] w-[18.75rem] min-w-[18.75rem] flex-col items-center justify-between rounded-[17.928px] bg-white pb-14 pt-8 text-[#535353] laptop:flex 5xl:w-[23rem] 5xl:min-w-[23rem] dark:bg-[#000] dark:text-white">
        <div className="flex flex-col items-center">
          <div className="flex w-full flex-col items-center justify-center gap-[4vh] border-b-[1.32px] border-[#9C9C9C] pb-[3vh] ">
            {/* <div className="flex items-center justify-center gap-[25px]">
              <h1 className="ml-[5px] flex items-center gap-2 text-[20px] font-medium leading-normal text-[#707175] dark:text-white">
                Expanded View
              </h1>
              <CustomSwitch2 enabled={filterStates.expandedView} setEnabled={handleExpendedView} />
            </div> */}
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
          </div>
          <h1 className="flex w-[212px] items-center gap-2 py-[3vh] text-[22px] font-[500] leading-none text-[#888] dark:text-white">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/filter.svg`}
              alt="filter"
              className="h-[1.188rem] w-[1.188rem]"
            />
            Filters
          </h1>
          <button
            // onClick={handleTopicPref}
            onClick={() => toast.success('Feature coming soon')}
            className={`${
              persistedTheme === 'dark' ? 'bg-[#EDEDED]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            } w-[212px] rounded-[9.338px] px-5 py-3 text-[18px] font-medium leading-[18px] text-white focus:outline-none dark:text-[#707175]`}
          >
            {/* Topics */}
            Ratings
          </button>
          <BasicModal
            open={openTopicPref}
            handleClose={handleTopicPref}
            customStyle={topicPreferencesModalStyle}
            customClasses="rounded-[0.9375rem] tablet:rounded-[2.31rem] w-[75vw] h-fit tablet:h-fit tablet:w-fit bg-[#FCFCFD] dark:bg-[#3E3E3E]"
          >
            <TopicPreferences
              columns={columns}
              setColumns={setColumns}
              handleClose={handleTopicPref}
              itemsWithCross={itemsWithCross}
              setItemsWithCross={setItemsWithCross}
            />
          </BasicModal>

          <div className="mt-[4vh] flex flex-col gap-[3vh]">
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
            {/* <Dropdown2
              label={'Sort'}
              title={filterStates.filterBySort ? filterStates.filterBySort : 'Newest First'}
              items={['Most Popular', 'Last Updated', 'Oldest First', 'Newest First']}
              handleSelect={(item) => {
                dispatch(filtersActions.setFilterBySort(item));
              }}
            /> */}
          </div>

          {/* <div className="flex w-full items-center justify-center gap-[17px] py-[3vh]">
            <h1 className="flex items-center gap-2 text-[14px] font-medium leading-normal text-[#707175] dark:text-white">
              Show Only My Posts
            </h1>
            <CustomSwitch2 enabled={localMe} setEnabled={handleSwitchChange} />
          </div> */}
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#F0F0F0]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            }  inset-0 mt-7 w-[192px] rounded-[14px] px-5 py-[6px] text-[1.25rem] font-semibold leading-normal text-white shadow-inner dark:text-[#707175]`}
            onClick={() => {
              dispatch(filtersActions.resetFilters());
              setSearch('');
              localStorage.setItem('filterByState', 'false');
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
            }  inset-0 w-4/6 rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
            // onClick={handleTopicPref}
            onClick={() => toast.success('Feature coming soon')}
          >
            Ratings
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
          {/* <Dropdown2
            label={'Sort'}
            title={filterStates.filterBySort ? filterStates.filterBySort : 'Newest First'}
            items={['Most Popular', 'Last Updated', 'Oldest First', 'Newest First']}
            handleSelect={(item) => {
              dispatch(filtersActions.setFilterBySort(item));
            }}
          /> */}
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            }  inset-0 w-full rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
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
        {/* <div className="mt-[9px] flex items-center justify-between gap-[4px] tablet:mt-[21px]">
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            }  inset-0 w-4/6 rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
            onClick={handleTopicPref}
          >
            Topics
          </button>
          <div className="flex w-full items-center justify-center gap-[6px]">
            <h1 className="whitespace-nowrap text-[8px] font-medium leading-normal text-[#707175] tablet:text-[15px] dark:text-white">
              Expanded View
            </h1>
            <CustomSwitch2 enabled={filterStates.expandedView} setEnabled={handleExpendedView} />
          </div>
          <div className="flex w-full items-center justify-center gap-[6px]">
            <h1 className="whitespace-nowrap text-[8px] font-medium leading-normal text-[#707175] tablet:text-[15px] dark:text-white">
              Show Only My Posts
            </h1>
            <CustomSwitch2 enabled={localMe} setEnabled={handleSwitchChange} />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default SidebarLeft;
