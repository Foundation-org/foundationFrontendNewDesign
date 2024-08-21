import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAnalyzeBadgeMutation, useAnalyzePostMutation } from '../../services/mutations/advance-analytics';

export default function DeleteAnalyzeHiddenOption({ handleClose, modalVisible, title, image, questStartData, type }) {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzePostMutation({ handleClose });
  const { mutateAsync: handleAnalyzeBadgeCount, isPending: badgeCountPending } = useAnalyzeBadgeMutation({
    handleClose,
  });

  const handleDeleteAnalyze = () => {
    if (type === 'hideOption') {
      handleAnalyzePost({
        userUuid: persistedUserInfo.uuid,
        questForeignKey: questStartData._id,
        hiddenOptionsArray: [],
        actionType: 'delete',
      });
    }
    if (type === 'badgeCount') {
      handleAnalyzeBadgeCount({
        userUuid: persistedUserInfo.uuid,
        questForeignKey: questStartData._id,
        operand: 0,
        range: 0,
        actionType: 'delete',
      });
    }
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete this Option?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant="submit"
            onClick={() => {
              handleDeleteAnalyze();
            }}
          >
            {isPending === true || badgeCountPending === true ? (
              <FaSpinner className="animate-spin text-[#EAEAEA]" />
            ) : (
              'Yes'
            )}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
