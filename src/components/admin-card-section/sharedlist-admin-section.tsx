import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateTimeAgo } from '../../utils/utils';
import { Button } from '../ui/Button';
import showToast from '../ui/Toast';
import { useUpdateSpotLight } from '../../services/api/profile';

interface IAdminSectionProps {
  categoryItem: any;
  setSelectedItem: (arg?: any) => void;
  setCategoryId: (arg?: any) => void;
  setAddPostModal: (arg?: any) => void;
  hasReordered: any;
  listData: any;
  categoryIndex: any;
  setEnableDisableType: (arg?: any) => void;
  setEnableDisableModal: (arg?: any) => void;
  setCopyModal: (arg?: any) => void;
  notPublicProfile: any;
  setModalVisible: (arg?: any) => void;
  copyToClipboard: (arg?: any) => void;
}

export default function SharedListAdminSection(props: IAdminSectionProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    categoryItem,
    setSelectedItem,
    setCategoryId,
    setAddPostModal,
    hasReordered,
    listData,
    categoryIndex,
    setEnableDisableType,
    setEnableDisableModal,
    setCopyModal,
    notPublicProfile,
    setModalVisible,
    copyToClipboard,
  } = props;
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  // const plusImg = `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/add-white.svg`;
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();

  return (
    <>
      <div className="border-t-2 border-gray-250 dark:border-gray-100">
        <div className="my-[15px] tablet:my-6">
          <div className="my-[15px] ml-10 flex items-center gap-1 tablet:my-6 tablet:ml-16 tablet:gap-20">
            <div className="flex items-center gap-[1px] tablet:gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                alt="clicks"
                className="h-2 w-2 tablet:h-6 tablet:w-6"
              />
              <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] dark:text-gray-300 tablet:text-[18px] tablet:leading-[21.78px]">
                {categoryItem.clicks === null ? 0 : categoryItem.clicks} Views{' '}
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
          {/* Button Row 1 */}
          <div className="flex w-full flex-col gap-2 px-[0.87rem] tablet:gap-4 tablet:px-10">
            {isProfilePage && !categoryItem?.spotLight && (
              <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
                <div></div>
                <Button
                  variant={'submit'}
                  className={'w-full tablet:w-full'}
                  onClick={() => {
                    const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;
                    handleSpotLight({ domain, type: 'lists', id: categoryItem._id, status: 'set' });
                  }}
                >
                  Pin to Spotlight
                </Button>
              </div>
            )}
            {/* Buttons Row 2 */}
            <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
              <Button
                variant={'submit-green'}
                className={'w-full tablet:w-full'}
                onClick={() => {
                  if (listData[categoryIndex]?.post?.length > 0) {
                    navigate('/shared-collection-link/result', {
                      state: { categoryItem: categoryItem._id },
                    });
                  } else {
                    showToast('warning', 'noPostsInList');
                  }
                }}
              >
                View Collection Results
              </Button>
              <Button
                variant="submit"
                className="w-full min-w-full"
                onClick={() => {
                  if (categoryItem.link === null) {
                    showToast('warning', 'noListLink');
                  } else {
                    copyToClipboard(categoryItem.link);
                    showToast('success', 'copyLink');
                  }
                }}
              >
                Copy Link
              </Button>
            </div>
            {/* Buttons Row 3 */}
            <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
              <Button
                variant="danger"
                className="w-full max-w-[320px] bg-[#A3A3A3] tablet:w-full laptop:w-full"
                onClick={() => {
                  setEnableDisableType('delete-shared-data');
                  setCategoryId(categoryItem._id);
                  setEnableDisableModal(true);
                }}
              >
                Delete
              </Button>
              <Button
                variant={categoryItem.isEnable && categoryItem.link !== null ? 'danger' : 'submit'}
                onClick={() => {
                  if (categoryItem.link !== null) {
                    setEnableDisableType(categoryItem.isEnable && categoryItem.link !== null ? 'disable' : 'enable');
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
        </div>
      </div>
      {/* Footer */}
      {/* <div className="relative flex items-center justify-between border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
        {notPublicProfile ? (
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
              {`Created collection ${calculateTimeAgo(categoryItem.createdAt)}`}
            </h4>
          </div>
        </div>
      </div> */}
    </>
  );
}
