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
  const [value, setValue] = useState([0, 20]);

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
          Select the range of ratings you wish to see in all your feeds.
        </h1>
        <div className="mt-6 tablet:mt-16">
          <Slider
            getAriaLabel={() => 'Ratings range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />
          <div className="mt-1 flex justify-between tablet:mt-[18px]">
            {rangeVal.map((item, index) => (
              <div key={index + 1}>
                <p className="text-[8px] font-semibold leading-normal text-[#9E9E9E] tablet:text-[18px]">{item}</p>
                {item === 0 && (
                  <p className="-ml-1 mt-[6px] flex h-[13px] w-[14px] items-center justify-center rounded-[1.56px] border-[0.52px] border-[#0F5634] bg-[#0FB063] text-[10.4px] font-normal leading-[1px] text-white tablet:-ml-[10px] tablet:mt-3 tablet:h-[35px] tablet:w-[35px] tablet:rounded-[4.2px] tablet:border-[1.4px] tablet:text-[28px]">
                    G
                  </p>
                )}
                {item === 20 && (
                  <p className="-ml-1 mt-[6px] flex h-[13px] w-[17px] items-center justify-center rounded-[1.56px] border-[0.52px] border-[#9F9F4E] bg-[#F7F71E] text-[10.4px] font-normal leading-[1px] text-[#4A472B] tablet:-ml-[10px] tablet:mt-3 tablet:h-[35px] tablet:w-[46.2px] tablet:rounded-[4.2px] tablet:border-[1.4px] tablet:text-[28px]">
                    PG
                  </p>
                )}
                {item === 40 && (
                  <p className="-ml-[2px] mt-[6px] flex h-[13px] w-[14px] items-center justify-center rounded-[1.56px] border-[0.52px] border-[#1E1111] bg-[#DB0000] text-[10.4px] font-normal leading-[1px] text-white tablet:-ml-[4px] tablet:mt-3 tablet:h-[35px] tablet:w-[35px] tablet:rounded-[4.2px] tablet:border-[1.4px] tablet:text-[28px]">
                    R
                  </p>
                )}
                {item === 60 && (
                  <p className="-ml-1 mt-[6px] flex h-[13px] w-[19.5px] items-center justify-center rounded-[1.56px] border-[0.52px] border-[#0670AB] bg-[#26B8F6] text-[10.4px] font-normal leading-[1px] text-white  tablet:-ml-[10px] tablet:mt-3 tablet:h-[35px] tablet:w-[52.5px] tablet:rounded-[4.2px] tablet:border-[1.4px] tablet:text-[28px]">
                    NC
                  </p>
                )}
                {item === 80 && (
                  <p className="-ml-[2px] mt-[6px] flex h-[13px] w-[14px] items-center justify-center rounded-[1.56px] border-[0.52px] border-[#696969] bg-[#0F0F0F] text-[10.4px] font-normal leading-[1px] text-white tablet:mt-3 tablet:h-[35px] tablet:w-[35px] tablet:rounded-[4.2px] tablet:border-[1.4px] tablet:text-[28px]">
                    X
                  </p>
                )}
              </div>
            ))}
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
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Save'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
