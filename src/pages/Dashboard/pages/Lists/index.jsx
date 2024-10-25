import { useEffect, useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLists, updatePostOrder } from '../../../../services/api/listsApi';
import { useNavigate } from 'react-router-dom';
import { referralModalStyle } from '../../../../constants/styles';
import DeleteListPopup from '../../../../components/dialogue-boxes/DeleteListPopup';
import ShareListLink from '../../../../components/dialogue-boxes/ShareListLink';
import Copy from '../../../../assets/Copy';
import BasicModal from '../../../../components/BasicModal';
import ManagePostInListPopup from '../../../../components/dialogue-boxes/ManagePostInListPopup';
import DeleteListPostPopup from '../../../../components/dialogue-boxes/DeleteListPostPopup';
import EditListNameDialogue from '../../../../components/dialogue-boxes/EditListNameDialogue';
import showToast from '../../../../components/ui/Toast';
import ListItem from './components/list-item';
import { closestCorners, DndContext, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SummaryCard from '../../../../components/SummaryCard';
import { calculateTimeAgo } from '../../../../utils/utils';

const Lists = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [copyModal, setCopyModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addPostModal, setAddPostModal] = useState(false);
  const [deletePostPopup, setDeletePostPopup] = useState(false);
  const [editListPopup, setEditListPopup] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [selectedItem, setSelectedItem] = useState();
  const [postId, setPostId] = useState('');
  const [listName, setListName] = useState('');
  const [hasReordered, setHasReordered] = useState('');
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 0,
    },
  });

  const handleCopyClose = () => setCopyModal(false);
  const handleClose = () => setModalVisible(false);
  const handleAddPostClose = () => setAddPostModal(false);
  const handleCloseDeletePost = () => setDeletePostPopup(false);
  const handleCloseEditList = () => setEditListPopup(false);

  const {
    data: listData = [],
    isError,
    isSuccess,
  } = useQuery({
    queryFn: () => fetchLists(),
    queryKey: ['lists'],
  });

  useEffect(() => {
    if (isSuccess) {
      setItems(listData);
    }
  }, [isSuccess, listData]);

  if (isError) {
    console.log('some error occur');
  }

  const { mutateAsync: updatePostsOrder } = useMutation({
    mutationFn: updatePostOrder,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'orderUpdated');
        setHasReordered(false);
      }
      queryClient.invalidateQueries('lists');
    },
    onError: (err) => {
      console.log('err', err);
    },
  });

  const handleSavePostsOrder = (posts, categoryId) => {
    const ids = posts?.map((item) => item._id);
    updatePostsOrder({ order: ids, userUuid: persistedUserInfo.uuid, categoryId });
  };

  const handleOnDragEnd = (event, categoryIndex, categoryId) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items[categoryIndex].post.findIndex((item) => item._id === active.id);
        const newIndex = items[categoryIndex].post.findIndex((item) => item._id === over.id);

        const data = arrayMove(items[categoryIndex].post, oldIndex, newIndex);
        const updatedItems = [{ ...items[categoryIndex], post: data }];

        const orders = data.map((post) => post.order);
        const isAscending = orders.every((value, index, array) => {
          if (index === 0) return true;
          return value >= array[index - 1];
        });

        if (isAscending) {
          setHasReordered('');
        } else {
          setHasReordered(categoryId);
        }

        return [...items.slice(0, categoryIndex), ...updatedItems, ...items.slice(categoryIndex + 1)];
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-70px)] w-full flex-col gap-2 overflow-y-auto px-4 pb-[10px] no-scrollbar tablet:mb-[0.94rem] tablet:gap-5 tablet:px-6 tablet:pb-5">
      <BasicModal
        open={copyModal}
        handleClose={handleCopyClose}
        customStyle={referralModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <ShareListLink handleClose={handleCopyClose} selectedItem={selectedItem} />
      </BasicModal>
      {modalVisible && (
        <DeleteListPopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Delete List'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          categoryId={categoryId}
        />
      )}
      {addPostModal && (
        <ManagePostInListPopup
          handleClose={handleAddPostClose}
          modalVisible={addPostModal}
          title={'Add Post'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/lists/white-list-icon.svg`}
          categoryId={categoryId}
          selectedItem={selectedItem}
        />
      )}
      {deletePostPopup && (
        <DeleteListPostPopup
          handleClose={handleCloseDeletePost}
          modalVisible={deletePostPopup}
          title={'Delete Post'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          categoryId={categoryId}
          postId={postId}
        />
      )}
      {editListPopup && (
        <EditListNameDialogue
          handleClose={handleCloseEditList}
          modalVisible={editListPopup}
          title={'Edit List Name'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/lists/white-list-icon.svg`}
          categoryId={categoryId}
          listData={listName}
        />
      )}

      {/* Summary Section */}
      <SummaryCard headerIcon="/assets/summary/my-list-logo.svg" headerTitle="My Lists">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Sharing lists is a great way to earn FDX - especially if people engage with them.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Lists you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total list clicks
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total list engagement
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
            </h5>
          </div>
        </div>
      </SummaryCard>

      {/* Main Content */}
      {items.length < 1 ? (
        <div className="flex justify-center gap-4 px-4 pb-8 pt-3 tablet:py-[27px]">
          <p className="text-center text-[4vw] laptop:text-[2vw]">
            <b>No shared lists found!</b>
          </p>
        </div>
      ) : (
        <>
          {items.length > 0 &&
            items?.map((categoryItem, categoryIndex) => (
              <div
                key={categoryItem._id}
                className="mx-auto w-full max-w-[730px] rounded-[7px] border-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[15px]"
              >
                <div className="flex items-center justify-between gap-2 border-b-[0.125rem] border-gray-250 px-3 py-1 tablet:px-[1.56rem] tablet:py-[0.87rem]">
                  <div className="flex gap-2">
                    <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] dark:text-gray-300 tablet:text-[1.25rem] tablet:leading-[23px]">
                      {categoryItem.category}
                    </h4>
                    <h4
                      className="cursor-pointer text-[9px] font-normal leading-[9px] text-[#7C7C7C] underline dark:text-gray-300 tablet:text-[1rem] tablet:leading-[23px]"
                      onClick={() => {
                        setCategoryId(categoryItem._id);
                        setListName(categoryItem.category);
                        setEditListPopup(true);
                      }}
                    >
                      Edit List Name
                    </h4>
                  </div>
                  <div
                    onClick={() => {
                      setSelectedItem(categoryItem);
                      setCopyModal(true);
                    }}
                    className="cursor-pointer"
                  >
                    {persistedTheme === 'dark' ? <Copy /> : <Copy />}
                  </div>
                </div>

                <div className="mx-7 my-[10px] tablet:my-[0.94rem] tablet:mr-[2.25rem]">
                  <h4 className="my-2 text-[10px] font-normal leading-[10px] text-[#7C7C7C] dark:text-gray-300 tablet:my-[27px] tablet:text-[1.125rem] tablet:font-semibold tablet:leading-[18px]">
                    {categoryItem.post.length} Post{categoryItem.post.length > 1 ? 's' : ''} (drag and drop to change
                    order)
                  </h4>

                  <ul className="space-y-[5.34px] tablet:space-y-[0.69rem]">
                    <DndContext
                      sensors={[touchSensor, mouseSensor, keyboardSensor]}
                      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                      collisionDetection={closestCorners}
                      onDragEnd={(e) => {
                        handleOnDragEnd(e, categoryIndex, categoryItem._id);
                      }}
                    >
                      <SortableContext items={categoryItem.post.map((post) => post._id)}>
                        {categoryItem?.post?.map((post) => (
                          <ListItem
                            key={post._id}
                            post={post}
                            setCategoryId={setCategoryId}
                            categoryItem={categoryItem}
                            setPostId={setPostId}
                            setDeletePostPopup={setDeletePostPopup}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </ul>

                  {listData[categoryIndex]?.post?.length <= 0 && (
                    <div className="flex w-full items-center gap-1 tablet:gap-20">
                      <h2 className="px-2 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] text-[#435059] outline-none dark:text-[#D3D3D3] tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px]">
                        This list has no posts
                      </h2>
                    </div>
                  )}

                  <div className="my-2 ml-10 flex items-center gap-1 tablet:my-[27px] tablet:ml-16 tablet:gap-20">
                    <div className="flex items-center gap-[1px] tablet:gap-2">
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                        alt="clicks"
                        className="h-2 w-2 tablet:h-6 tablet:w-6"
                      />
                      <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] dark:text-gray-300 tablet:text-[18px] tablet:leading-[21.78px]">
                        {categoryItem.clicks === null ? 0 : categoryItem.clicks} Clicks{' '}
                      </h2>
                    </div>
                    <div className="flex items-center gap-[1px] tablet:gap-2">
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/group.svg' : 'assets/svgs/participants.svg'}`}
                        alt="participants"
                        className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
                      />
                      <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] dark:text-gray-300 tablet:text-[18px] tablet:leading-[21.78px]">
                        {categoryItem.participents === null ? 0 : categoryItem.participents} Engagements{' '}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 tablet:gap-4">
                    <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
                      <Button
                        variant="cancel"
                        className="w-full max-w-[320px] bg-[#A3A3A3] tablet:w-full laptop:w-full"
                        onClick={() => {
                          setSelectedItem(categoryItem);
                          setCategoryId(categoryItem._id);
                          setAddPostModal(true);
                        }}
                      >
                        + Add Post
                      </Button>
                      {categoryItem._id === hasReordered && hasReordered !== '' ? (
                        <Button
                          variant="submit"
                          className="w-full min-w-full"
                          onClick={() => {
                            handleSavePostsOrder(categoryItem.post, categoryItem._id);
                          }}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button variant="hollow-submit" className="w-full tablet:max-w-[320px]" disabled={true}>
                          Save
                        </Button>
                      )}
                    </div>
                    <div className="flex w-full items-center justify-end gap-3 tablet:gap-[1.4rem]">
                      {listData[categoryIndex]?.post?.length > 0 && (
                        <Button
                          variant={'submit-green'}
                          className={'w-full tablet:w-full'}
                          onClick={() =>
                            navigate('/shared-list-link/result', {
                              state: { categoryItem: categoryItem._id },
                            })
                          }
                        >
                          View My List Results
                        </Button>
                      )}
                      {/* {questStartData.userQuestSetting.linkStatus === 'Enable' ? ( */}
                      <Button
                        variant="danger"
                        // onClick={showDisableSharedLinkPopup}
                        className={'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'}
                      >
                        Disable Sharing
                      </Button>
                      {/* // ) : (
                    //   <Button
                    //     variant="submit"
                    //     className={'w-full !px-0 laptop:!px-0'}
                    //     onClick={showEnableSharedLinkPopup}
                    //   >
                    //     Enable Sharing
                    //   </Button>
                    // )} */}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-[0.125rem] border-gray-250 px-3 py-1 tablet:px-[1.56rem] tablet:py-[0.87rem]">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/trash-icon.svg'}`}
                    alt="trash-icon"
                    className="h-[15px] w-3 cursor-pointer tablet:h-[25px] tablet:w-5"
                    onClick={() => {
                      setCategoryId(categoryItem._id);
                      setModalVisible(true);
                    }}
                  />
                  <div className="flex items-center gap-3 tablet:gap-[1.62rem]">
                    <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
                        alt="clock"
                        className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
                      />
                      <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C] dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
                        {`Created list ${calculateTimeAgo(categoryItem.createdAt)}`}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Lists;
