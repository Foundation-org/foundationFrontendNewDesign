import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { userInfo } from '../../services/api/userAuth';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addUser } from '../../features/auth/authSlice';
import { toast } from 'sonner';
import api from '../../services/api/Axios';
import { FaSpinner } from 'react-icons/fa';

export default function BadgeRemovePopup({
  handleClose,
  modalVisible,
  title,
  image,
  accountName,
  fetchUser,
  setFetchUser,
  type,
  badgeType,
}) {
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);

  const handleUserInfo = async () => {
    try {
      const resp = await userInfo();
      if (resp.status === 200) {
        dispatch(addUser(resp.data));
      }

      setFetchUser(resp.data);
    } catch (e) {
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const handleRemoveBadge = async () => {
    setIsLoading(true);

    try {
      let removeBadge;

      if (badgeType === 'contact') {
        removeBadge = await api.post(`/removeContactBadge`, {
          type: type,
          uuid: fetchUser.uuid,
        });
      } else if (badgeType === 'personal') {
        removeBadge = await api.post(`/removePersonalBadge`, {
          type: type,
          uuid: fetchUser.uuid,
        });
      }else if (badgeType === 'web3') {
        removeBadge = await api.post(`/removeWeb3Badge`, {
          type: type,
          uuid: fetchUser.uuid,
        });}
       else {
        const findBadge = fetchUser.badges.filter((item) => {
          if (item.accountName === accountName) {
            return item;
          }
        });
        removeBadge = await api.post(`/removeBadge`, {
          badgeAccountId: findBadge[0].accountId,
          uuid: fetchUser.uuid,
        });
      }

      if (removeBadge.status === 200) {
        toast.success('Badge Removed Successfully!');
        handleUserInfo();
        handleClose();
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to remove this badge? 'If you remove this badge, you will not be able to add it again
          for 30 days.'
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
