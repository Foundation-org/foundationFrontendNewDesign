import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { userInfo } from '../../services/api/userAuth';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addUser } from '../../features/auth/authSlice';
import { toast } from 'sonner';
import api from '../../services/api/Axios';

export default function BadgeRemovePopup({
  handleClose,
  modalVisible,
  title,
  image,
  accountName,
  fetchUser,
  setFetchUser,
}) {
  const dispatch = useDispatch();

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
    const findBadge = fetchUser.badges.filter((item) => {
      if (item.accountName === accountName) {
        return item;
      }
    });
    console.log(findBadge);
    console.log(fetchUser);
    try {
      const removeBadge = await api.post(`/removeBadge`, {
        badgeAccountId: findBadge[0].accountId,
        uuid: fetchUser.uuid,
      });

      if (removeBadge.status === 200) {
        toast.success('Badge Removed Successfully!');
        handleUserInfo();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:py-[25px] tablet:px-[55px]">
        <h1 className="text-[10px] tablet:text-[20px] font-medium leading-[12px] tablet:leading-[24.2px] text-[#707175]">
          Are you sure you want to remove this badge? 'If you remove this badge, you will not be able to add it again
          for 30 days.
        </h1>
        <div className="flex gap-[15px] tablet:gap-[34px] justify-end mt-[10px] tablet:mt-[25px]">
          <Button variant={'submit'} onClick={handleRemoveBadge}>
            Yes
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
