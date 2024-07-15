import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import api from '../../services/api/Axios';
import { FaSpinner } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import showToast from '../ui/Toast';

export default function BadgeRemovePopup({
  handleClose,
  modalVisible,
  title,
  image,
  accountName,
  fetchUser,
  type,
  badgeType,
  setIsPersonalPopup,
  setIsLoading,
  loading,
}) {
  const queryClient = useQueryClient();
  console.log(accountName);
  const handleRemoveBadge = async () => {
    setIsLoading(true);
    try {
      let removeBadge;
      if (badgeType === 'contact') {
        removeBadge = await api.post(`/removeContactBadge`, {
          type: type,
          uuid: fetchUser.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'personal') {
        removeBadge = await api.post(`/removePersonalBadge`, {
          type: type,
          uuid: fetchUser.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'web3') {
        removeBadge = await api.post(`/removeWeb3Badge`, {
          type: type,
          uuid: fetchUser.uuid,
          badgeName: type,
        });
      } else if (type === 'password') {
        removeBadge = await api.post('/addPasswordBadgesUpdate', {
          uuid: fetchUser.uuid,
          eyk: localStorage.getItem('legacyHash'),
          badgeName: type,
        });
      } else if (badgeType === 'passkey') {
        removeBadge = await api.post(`/removePasskey`, {
          type: type,
          accountName: accountName,
          uuid: fetchUser.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'farcaster') {
        removeBadge = await api.post(`/removeFarCasterBadge`, {
          type: type,
          accountName: accountName,
          uuid: fetchUser.uuid,
          badgeName: type,
        });
      } else {
        const findBadge = fetchUser.badges.filter((item) => {
          if (item.accountName === accountName) {
            return item;
          }
        });
        console.log(findBadge[0]);
        removeBadge = await api.post(`/removeBadge`, {
          badgeAccountId: findBadge[0].accountId,
          uuid: fetchUser.uuid,
          badgeName: type,
        });
      }

      if (removeBadge.status === 200) {
        if (type === 'password') {
          localStorage.removeItem('legacyHash');
        }
        showToast('success', 'badgeRemoval');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
        setIsLoading(false);
        {
          badgeType === 'personal' && setIsPersonalPopup(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose} remove={true}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to remove this badge? If you remove this badge, you will not be able to add it again for
          30 days.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleRemoveBadge}>
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
