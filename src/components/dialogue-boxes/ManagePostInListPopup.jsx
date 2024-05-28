import PopUp from '../ui/PopUp';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import {
  addPostinAList,
  deleteList,
  findPostsByCategoryId,
  searchPosts,
  updateCategoryName,
} from '../../services/api/listsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TextareaAutosize } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function ManagePostInListPopup({ handleClose, modalVisible, title, image, categoryId }) {
  const queryClient = useQueryClient();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [categoryName, setCategoryName] = useState('');
  const [searchPost, setSearchPost] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState('');

  const {
    data: listData,
    isError,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      return await findPostsByCategoryId({ userUuid: persistedUserInfo.uuid, categoryId });
    },
    queryKey: ['postsByCategory', categoryId, persistedUserInfo.uuid],
  });

  useEffect(() => {
    setCategoryName(listData?.category);
  }, [listData]);

  const { mutateAsync: handleDeleteList, isPending } = useMutation({
    mutationFn: deleteList,
    onSuccess: (resp) => {
      console.log('resp', resp);
      console.log('Post deleted Successfully');

      // if (resp.response.status === 500) {
      //   toast.warning('Something goes wrong.');
      //   return;
      // }

      toast.success('List deleted successfully');

      // queryClient.setQueriesData(['lists'], (oldData) => {
      //   console.log('old', oldData);
      //   return oldData?.map((page) => page.filter((item) => item._id !== categoryId));
      // });

      queryClient.invalidateQueries(['lists']);

      handleClose();
    },
    onError: (error) => {
      console.log(error);
      // toast.warning(error.response.data.message);
    },
  });

  const { mutateAsync: handleChangeCategoryName } = useMutation({
    mutationFn: updateCategoryName,
    onSuccess: (resp) => {
      console.log('resp', resp);
      console.log('Category name updated Successfully');

      // if (resp.response.status === 500) {
      //   toast.warning('Something goes wrong.');
      //   return;
      // }

      toast.success('Category name updated successfully');

      // queryClient.setQueriesData(['lists'], (oldData) => {
      //   console.log('old', oldData);
      //   return oldData?.map((page) => page.filter((item) => item._id !== categoryId));
      // });

      queryClient.invalidateQueries(['lists']);

      // handleClose();
    },
    onError: (error) => {
      console.log(error);
      // toast.warning(error.response.data.message);
    },
  });

  const { mutateAsync: addPostInList, isPending: isLoading } = useMutation({
    mutationFn: addPostinAList,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        toast.success('Post added in a list.');
        queryClient.invalidateQueries(['lists']);
        setSearchPost('');
        setSearchResult([]);
        handleClose();
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    const handleSearchPost = async () => {
      if (searchPost) {
        const resp = await searchPosts(searchPost, persistedUserInfo.uuid);
        setSearchResult(resp?.data);
        console.log('resp', resp.data);
      }
    };

    handleSearchPost();
  }, [searchPost]);

  useEffect(() => {
    if (searchPost === '') {
      setSelectedPostId('');
    }
  }, [searchPost]);

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <div className="mb-2 flex tablet:mb-5">
          <TextareaAutosize
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryName}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] py-[4px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[10px] tablet:text-[18px] tablet:leading-[18px] laptop:rounded-l-[0.625rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
          />
          <button
            className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012]`}
          >
            <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] text-[#0FB063] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[60px]">
              OK
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-[15px]">
          <div className="flex w-full items-center rounded-[5.387px] bg-transparent tablet:w-full tablet:rounded-[10px]">
            <div className="w-full rounded-[5.387px] border border-[#DEE6F7] tablet:rounded-[15px] tablet:border-[3px]">
              <div className="flex">
                <div
                  className={`${
                    false ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
                  } dragIconWrapper border-y border-s tablet:border-y-[3px] tablet:border-s-[3px]`}
                >
                  {persistedTheme === 'dark' ? (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                      alt="six dots"
                      className="h-[8.8px] tablet:h-[18px]"
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                      alt="six dots"
                      className="h-[8.8px] tablet:h-[18px]"
                    />
                  )}
                </div>
                <TextareaAutosize
                  onChange={(e) => setSearchPost(e.target.value)}
                  value={searchPost}
                  placeholder="Search Post"
                  className={`${
                    selectedPostId === '' && searchPost !== '' ? 'border-b border-[#DEE6F7] tablet:border-b-[3px]' : ''
                  } flex w-full resize-none items-center bg-white px-[9.24px] py-[6.84px] pr-2 text-[0.625rem] font-normal leading-[0.625rem] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-r-[10px] tablet:px-[11px] tablet:py-3 tablet:text-[18px] tablet:leading-[18px] dark:text-[#7C7C7C]`}
                />
              </div>
              {/* To Render and Select The Post */}
              <ul className="leading-noraml h-fit max-h-56 overflow-y-auto text-[10px] font-medium text-[#707175] tablet:text-[15.7px]">
                {selectedPostId === '' &&
                  searchPost !== '' &&
                  searchResult?.map((item) => (
                    <li
                      key={item._id}
                      className="cursor-pointer border-b border-[#DEE6F7] px-4 py-[6px] last:border-b-0 tablet:border-b-[3px] tablet:py-2"
                      onClick={() => {
                        setSearchPost(item.Question);
                        setSelectedPostId(item._id);
                        setSearchResult([]);
                      }}
                    >
                      {item.Question}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              if (selectedPostId === '') {
                handleChangeCategoryName({
                  userUuid: persistedUserInfo.uuid,
                  categoryId,
                  category: categoryName,
                });
              } else {
                addPostInList({
                  userUuid: persistedUserInfo.uuid,
                  categoryIdArray: [categoryId],
                  questForeginKey: selectedPostId,
                });
              }
            }}
          >
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Save'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
