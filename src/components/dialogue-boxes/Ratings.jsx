import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateHiddenQuest } from '../../services/api/questsApi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { removeHiddenPosts } from '../../features/quest/utilsSlice';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Slider from '@mui/material/Slider';

import * as questUtilsActions from '../../features/quest/utilsSlice';

function valuetext(value) {
  return <p style={{ background: '#4A8DBD', color: 'white' }}>`${value}°C`</p>;
}

const rangeVal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function Ratings({ handleClose, modalVisible, questStartData }) {
  //   const dispatch = useDispatch();
  //   const persistedUserInfo = useSelector((state) => state.auth.user);
  //   const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //   const { mutateAsync: hidePost } = useMutation({
  //     mutationFn: updateHiddenQuest,
  //     onSuccess: (resp) => {
  //       toast.success('Post unhidden successfully');
  //       queryClient.invalidateQueries('FeedData');
  //       dispatch(questUtilsActions.addHiddenPostId(resp.data.data.questForeignKey));
  //       setIsLoading(false);
  //       handleClose();
  //     },
  //     onError: (err) => {
  //       setIsLoading(false);
  //       console.log(err);
  //     },
  //   });

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/ratings-icon.svg`}
      title={'Rating'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[75px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Rating according to your age group
        </h1>
        <div className="mt-16">
          <Slider
            getAriaLabel={() => 'Ratings range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />
          <div className="flex justify-between">
            {rangeVal.map((item, index) => (
              <p key={index + 1} className="text-[#9E9E9E]text-[18px] font-semibold leading-normal">
                {item}
              </p>
            ))}
          </div>
          <div className="mt-3 flex max-w-[80%] justify-between">
            <p className="flex h-[35px] w-[35px] items-center justify-center rounded-[4.2px] border-[1.4px] border-[#0F5634] bg-[#0FB063] text-[28px] font-normal leading-[1px] text-white">
              G
            </p>
            <p className="flex h-[35px] w-[46.2px] items-center justify-center rounded-[4.2px] border-[1.4px] border-[#9F9F4E] bg-[#F7F71E] text-[28px] font-normal leading-[1px] text-[#4A472B]">
              PG
            </p>
            <p className="flex h-[35px] w-[35px] items-center justify-center rounded-[4.2px] border-[1.4px] border-[#1E1111] bg-[#DB0000] text-[28px] font-normal leading-[1px] text-white">
              R
            </p>
            <p className="flex h-[35px] w-[52.5px] items-center justify-center rounded-[4.2px] border-[1.4px] border-[#0670AB] bg-[#26B8F6] text-[28px] font-normal leading-[1px] text-white">
              NC
            </p>
            <p className="flex h-[35px] w-[35px] items-center justify-center rounded-[4.2px] border-[1.4px] border-[#696969] bg-[#0F0F0F] text-[28px] font-normal leading-[1px] text-white">
              X
            </p>
          </div>
        </div>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'danger'} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={'submit'}
            onClick={() => {
              setIsLoading(true);
              //   hidePost({
              //     uuid: persistedUserInfo?.uuid,
              //     questForeignKey: questStartData._id,
              //     hidden: false,
              //     hiddenMessage: '',
              //   });
              //   dispatch(removeHiddenPosts(questStartData._id));
            }}
            disabled={isLoading}
          >
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : ' Submit'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
