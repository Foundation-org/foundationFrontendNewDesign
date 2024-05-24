import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { addPostinAList, createList, fetchLists } from '../../services/api/listsApi';
import PopUp from '../ui/PopUp';
import { useEffect } from 'react';
import { LinearProgress } from '@mui/material';

export default function AddToListPopup({ handleClose, modalVisible, questStartData }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [listName, setListName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState([]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const { mutateAsync: createNewList, isPending: IsLoadingCreate } = useMutation({
    mutationFn: createList,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        toast.success('New list created.');
        queryClient.invalidateQueries(['lists']);
        setListName('');
      }
      if (resp.response.status === 500) {
        toast.warning('List with a similar name already exists.');
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: addPostInList, isPending: isLoading } = useMutation({
    mutationFn: addPostinAList,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        toast.success('Post added in a list.');
        queryClient.invalidateQueries(['lists']);
        handleClose();
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    data: listData,
    isError,
    isPending,
  } = useQuery({
    queryFn: fetchLists,
    queryKey: ['lists'],
  });

  if (isError) {
    console.log('some eror occur');
  }

  const addMatchingQuestIds = (data, questId) => {
    let temp = [];
    data &&
      data.forEach((item) => {
        item.post.forEach((postItem) => {
          if (postItem.questForeginKey._id === questId) {
            temp.push(item._id);
          }
        });
      });
    setSelectedOption((prev) => [...prev, ...temp]);
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedOption((prevSelectedOption) => {
      if (prevSelectedOption.includes(itemId)) {
        return prevSelectedOption.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedOption, itemId];
      }
    });
  };

  useEffect(() => {
    addMatchingQuestIds(listData, questStartData._id);
  }, [listData]);

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/addToListWhite.svg`}
      title={'Add to List'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={false}
    >
      <div className="px-[27px] py-3 tablet:px-[74px] tablet:py-[37px]">
        <div className="flex flex-col gap-2 tablet:gap-[10px]">
          <label
            htmlFor=""
            className="text-[10px] font-medium leading-normal text-[#7C7C7C] tablet:text-[20px] tablet:font-semibold"
          >
            Create List
          </label>
          <input
            type="text"
            className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-[23px] w-full min-w-[280px] appearance-none rounded-[4.161px] border-[1.248px] border-[#DEE6F7] bg-transparent py-[5px] pl-[6px] pr-8 text-[10px] font-normal leading-[10px] text-[#707175] focus:outline-none focus:ring-0 tablet:h-full tablet:min-w-full tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:pl-5 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
            value={listName}
            placeholder="List here"
            onChange={(e) => setListName(e.target.value)}
          />
        </div>
        <div className="mt-2 flex justify-end tablet:mt-[25px]">
          <Button
            variant={'cancel'}
            className={'bg-[#7C7C7C]'}
            onClick={() => {
              createNewList({
                userUuid: persistedUserInfo.uuid,
                category: listName,
              });
            }}
          >
            {IsLoadingCreate === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
          </Button>
        </div>

        {listData?.length >= 1 && (
          <>
            <hr className="mx-auto my-3 h-[0.86px] max-w-[90%] bg-[#9C9C9C] tablet:my-[25px] tablet:h-[1.325px] tablet:max-w-[645px]" />
            <div>
              <h4 className="text-[10px] font-medium leading-normal text-[#7C7C7C] tablet:text-[20px] tablet:font-semibold">
                Lists
              </h4>
              <div className="relative my-3 tablet:my-[25px]">
                <div className="relative h-[23px] w-full tablet:h-[46px]">
                  <input
                    type="text"
                    id="floating_outlined"
                    className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full min-w-[280px] appearance-none rounded-[8px] border-[0.59px] border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:min-w-full tablet:rounded-[10px] tablet:border-2 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                    value={search}
                    placeholder=""
                    onChange={handleSearch}
                  />
                  <label
                    htmlFor="floating_outlined"
                    className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-[9px]  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
                  >
                    Search
                  </label>
                </div>
                {search && (
                  <button
                    className="absolute right-3 top-1/2 translate-y-[-50%] transform"
                    onClick={() => setSearch('')}
                  >
                    <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
                  </button>
                )}
                {!search && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                    alt="search"
                    className="absolute right-3 top-1/2 h-4 w-4 translate-y-[-50%] transform"
                  />
                )}
              </div>
              <div className="no-scrollbar mt-3 h-fit max-h-[280px] space-y-3 overflow-y-auto tablet:mt-[15px] tablet:space-y-[15px]">
                {listData?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-[4.161px] border-[1.248px] border-[#DEE6F7] bg-[#FBFBFB] p-2 tablet:rounded-[10px] tablet:border-[3px] tablet:p-5"
                  >
                    <div className="w-fit space-y-2 tablet:space-y-5">
                      <h4 className="text-[10px] font-normal leading-[10px] text-[#7C7C7C] tablet:text-[20px] tablet:font-medium tablet:leading-[20px]">
                        {item.category}
                      </h4>
                      <h4 className="text-[8px] font-normal leading-[8px] text-[#9A9A9A] tablet:text-[18px] tablet:font-medium tablet:leading-[18px]">
                        {item.post.length} Post{item.post.length > 1 ? 's' : ''}
                      </h4>
                    </div>
                    <div id="custom-rating-checkbox" className="flex h-full items-center">
                      <input
                        id={`checkbox-${item._id}`}
                        type="checkbox"
                        className="checkbox h-[13.5px] w-[13.5px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                        checked={selectedOption.includes(item._id)}
                        onChange={() => handleCheckboxChange(item._id)}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-[10px] flex justify-end gap-4 tablet:mt-[25px]">
              <Button
                variant={'submit'}
                className={'min-w-[68.2px] max-w-[68.2px] rounded-[7.58px] tablet:min-w-[139px] tablet:max-w-[139px]'}
                onClick={() => {
                  addPostInList({
                    userUuid: persistedUserInfo.uuid,
                    categoryIdArray: selectedOption,
                    questForeginKey: questStartData._id,
                  });
                }}
              >
                {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Save'}
              </Button>
            </div>
          </>
        )}
      </div>
    </PopUp>
  );
}
