import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useState } from 'react';
import api from '../../services/api/Axios';
import { FaSpinner } from 'react-icons/fa';

export default function DeletePostPopup({ handleClose, modalVisible, title, image, id }) {
  const [loading, setIsLoading] = useState(false);

  const handleDeletePost = async () => {
    setIsLoading(true);
    try {
      const deletePost = await api.delete(`/infoquestions/deleteInfoQuest/${id}/${localStorage.getItem('uuid')}`);
      if (deletePost.status === 200) {
        console.log('Post deleted Successfully');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete Post?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleDeletePost}>
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
