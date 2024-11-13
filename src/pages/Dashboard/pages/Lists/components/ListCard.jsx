import { useEffect, useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePostOrder } from '../../../../../services/api/listsApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { referralModalStyle } from '../../../../../constants/styles';
import DeleteListPopup from '../../../../../components/dialogue-boxes/DeleteListPopup';
import ShareListLink from '../../../../../components/dialogue-boxes/ShareListLink';
import BasicModal from '../../../../../components/BasicModal';
import ManagePostInListPopup from '../../../../../components/dialogue-boxes/ManagePostInListPopup';
import DeleteListPostPopup from '../../../../../components/dialogue-boxes/DeleteListPostPopup';
import EditListNameDialogue from '../../../../../components/dialogue-boxes/EditListNameDialogue';
import showToast from '../../../../../components/ui/Toast';
import ListItem from './list-item';
import { closestCorners, DndContext, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { calculateTimeAgo } from '../../../../../utils/utils';
import DisabledListPopup from '../../../../../components/dialogue-boxes/DisabledListPopup';
import { useUpdateSpotLight } from '../../../../../services/api/profile';
import SharedListAdminSection from '../../../../../components/admin-card-section/sharedlist-admin-section';
import Copy from '../../../../../assets/Copy';

const ListCard = ({ listData }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile/me';
  const notPublicProfile = !location.pathname.startsWith('/h/');
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [copyModal, setCopyModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [enableDisableModal, setEnableDisableModal] = useState(false);
  const [enableDisableType, setEnableDisableType] = useState('');
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

  const plusImg = `${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/plus.svg' : 'assets/svgs/dashboard/add.svg'}`;

  const handleCopyClose = () => setCopyModal(false);
  const handleClose = () => setModalVisible(false);
  const handleAddPostClose = () => setAddPostModal(false);
  const handleCloseDeletePost = () => setDeletePostPopup(false);
  const handleCloseEditList = () => setEditListPopup(false);

  const copyToClipboard = async (link) => {
    const { protocol, host } = window.location;
    let sharedPostUrl = `${protocol}//${host}/l/${link}`;

    const textToCopy = sharedPostUrl;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();

  useEffect(() => {
    if (listData) {
      setItems(listData);
    }
  }, [listData]);

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

        const ids = updatedItems[0].post?.map((item) => item._id);
        updatePostsOrder({ order: ids, userUuid: persistedUserInfo.uuid, categoryId });

        return [...items.slice(0, categoryIndex), ...updatedItems, ...items.slice(categoryIndex + 1)];
      });
    }
  };

  return (
    <>
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
          title={'Edit'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/lists/white-list-icon.svg`}
          categoryId={categoryId}
          listData={listName}
        />
      )}
      {enableDisableModal && (
        <DisabledListPopup
          handleClose={() => {
            setEnableDisableModal(false);
          }}
          modalVisible={enableDisableModal}
          type={enableDisableType}
          categoryId={categoryId}
        />
      )}

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
                <div className="flex items-center justify-end gap-2 border-b-[0.125rem] border-gray-250 px-3 py-1 dark:border-gray-100 tablet:px-[1.56rem] tablet:py-[0.87rem]">
                  {/* Pin To SpotLight */}
                  {
                    isProfilePage && !categoryItem?.spotLight ? (
                      <button
                        className="whitespace-nowrap text-[12px] font-medium text-[#6BA5CF] underline tablet:text-[18px]"
                        onClick={() => {
                          const domain = persistedUserInfo.badges.find((badge) => badge.domain)?.domain.name;
                          handleSpotLight({ domain, type: 'lists', id: categoryItem._id, status: 'set' });
                        }}
                      >
                        Pin to Spotlight
                      </button>
                    ) : null
                    // <div
                    //   className="flex cursor-pointer items-center gap-[4.8px] tablet:gap-3"
                    //   onClick={() => {
                    //     if (categoryItem.link === null) {
                    //       setSelectedItem(categoryItem);
                    //       setCopyModal(true);
                    //     } else {
                    //       copyToClipboard(categoryItem.link);
                    //       showToast('success', 'copyLink');
                    //     }
                    //   }}
                    // >
                    //   <img
                    //     src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copylinkblue.png`}
                    //     alt="eye-cut"
                    //     className="h-3 w-3 tablet:h-[22.92px] tablet:w-[19.79px]"
                    //   />
                    //   <h1 className="text-[10.45px] font-semibold text-[#6BA5CF] tablet:text-[20px]">Copy Link</h1>
                    // </div>
                  }
                  <div className="flex items-center gap-3 tablet:gap-[1.62rem]">
                    <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
                        alt="clock"
                        className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
                      />
                      <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C] dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
                        {calculateTimeAgo(categoryItem.createdAt)}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="mx-7 my-[10px] tablet:mx-10 tablet:mb-6 tablet:mt-4">
                  <div className="flex gap-2">
                    <h4 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
                      {categoryItem.category}
                    </h4>
                    {notPublicProfile && (
                      <h4
                        className="cursor-pointer text-[9px] font-normal leading-[9px] text-[#7C7C7C] underline dark:text-gray-300 tablet:text-[1rem] tablet:leading-[23px]"
                        onClick={() => {
                          setCategoryId(categoryItem._id);
                          setListName(categoryItem.category);
                          setEditListPopup(true);
                        }}
                      >
                        Edit
                      </h4>
                    )}
                  </div>
                  {notPublicProfile && (
                    <h4 className="py-[0.38rem] pl-[28px] text-[7.5px] font-normal leading-3 text-accent-400 dark:text-accent-300 tablet:py-[10px] tablet:pl-7 tablet:text-[1rem] tablet:leading-[30px]">
                      {categoryItem.post.length} Post{categoryItem.post.length > 1 ? 's' : ''} (drag and drop to change
                      order)
                    </h4>
                  )}

                  {/* Posts Statements */}
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

                  <div className="grid grid-cols-2 gap-2 pt-[5.7px] tablet:gap-4 tablet:pl-7 tablet:pt-[9px]">
                    <Button
                      variant={'addOption'}
                      onClick={() => {
                        setSelectedItem(categoryItem);
                        setCategoryId(categoryItem._id);
                        setAddPostModal(true);
                      }}
                      className="px-5"
                    >
                      <img src={plusImg} alt="add" className="size-[7.398px] tablet:size-[15.6px]" />
                      Add Post
                    </Button>
                  </div>

                  <div className="mt-[50px] grid grid-cols-2 gap-2 tablet:gap-4">
                    <dir className="col-span-1"></dir>
                    <Button
                      variant={'submit-green'}
                      className={'w-full tablet:w-full'}
                      onClick={() => {
                        navigate(`/l/${listData[categoryIndex]?.link}`);
                      }}
                    >
                      Participate
                    </Button>
                  </div>

                  {listData[categoryIndex]?.post?.length <= 0 && (
                    <div className="flex w-full items-center gap-1 tablet:gap-20">
                      <h2 className="px-2 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] text-[#435059] outline-none dark:text-[#D3D3D3] tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px]">
                        This list has no posts
                      </h2>
                    </div>
                  )}

                  {/* Clicks & Engagement */}
                  {/* {notPublicProfile && (
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
                  )} */}

                  {/* Buttons Row  */}
                  {/* Buttons Row 1 */}
                  {/* Buttons Row 2 */}
                  {/* {notPublicProfile && (
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
                        <Button
                          variant={'submit-green'}
                          className={'w-full tablet:w-full'}
                          onClick={() => {
                            if (listData[categoryIndex]?.post?.length > 0) {
                              navigate('/shared-list-link/result', {
                                state: { categoryItem: categoryItem._id },
                              });
                            } else {
                              showToast('warning', 'noPostsInList');
                            }
                          }}
                        >
                          View My List Results
                        </Button>
                        <Button
                          variant={categoryItem.isEnable && categoryItem.link !== null ? 'danger' : 'submit'}
                          onClick={() => {
                            if (categoryItem.link !== null) {
                              setEnableDisableType(
                                categoryItem.isEnable && categoryItem.link !== null ? 'disable' : 'enable'
                              );
                              setCategoryId(categoryItem._id);
                              setEnableDisableModal(true);
                            } else {
                              setSelectedItem(categoryItem);
                              setCopyModal(true);
                            }
                          }}
                          className={
                            categoryItem.isEnable
                              ? 'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'
                              : 'w-full !px-0 laptop:!px-0'
                          }
                        >
                          {categoryItem.isEnable && categoryItem.link !== null ? 'Disable Sharing' : 'Enable Sharing'}
                        </Button>
                      </div>
                    </div>
                  )} */}
                </div>

                <div className="flex items-center justify-between border-t-[0.125rem] border-gray-250 px-3 py-1 dark:border-gray-100 tablet:px-[1.56rem] tablet:py-[0.87rem]">
                  <button
                    className={`${'w-fit'} flex items-center gap-1 tablet:gap-2`}
                    onClick={() => {
                      if (categoryItem.link === null) {
                        setSelectedItem(categoryItem);
                        setCopyModal(true);
                      } else {
                        copyToClipboard(categoryItem.link);
                        showToast('success', 'copyLink');
                      }
                    }}
                  >
                    {persistedTheme === 'dark' ? <Copy /> : <Copy />}
                    <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem]">
                      Share
                    </h1>
                  </button>
                  {/* {notPublicProfile ? (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/trash-icon.svg'}`}
                      alt="trash-icon"
                      className="h-[15px] w-3 cursor-pointer tablet:h-[25px] tablet:w-5"
                      onClick={() => {
                        setCategoryId(categoryItem._id);
                        setModalVisible(true);
                      }}
                    />
                  ) : (
                    <div />
                  )}
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
                  </div> */}
                </div>
                {notPublicProfile && (
                  <SharedListAdminSection
                    categoryItem={categoryItem}
                    setSelectedItem={setSelectedItem}
                    setCategoryId={setCategoryId}
                    setAddPostModal={setAddPostModal}
                    hasReordered={hasReordered}
                    listData={listData}
                    categoryIndex={categoryIndex}
                    setCopyModal={setCopyModal}
                    setEnableDisableModal={setEnableDisableModal}
                    setEnableDisableType={setEnableDisableType}
                    notPublicProfile={notPublicProfile}
                    setModalVisible={setModalVisible}
                    copyToClipboard={copyToClipboard}
                  />
                )}
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default ListCard;
