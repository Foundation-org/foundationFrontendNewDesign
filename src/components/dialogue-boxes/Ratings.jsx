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
              <div key={index + 1} className="relative">
                <p className="text-[8px] font-semibold leading-normal text-[#9E9E9E] tablet:text-[18px]">{item}</p>
                {item === 0 && (
                  <div className="absolute left-1/2 top-[15px] w-[13px] -translate-x-1/2 transform tablet:top-[36px] tablet:w-[35px]">
                    <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/desk-g.svg`} alt="desk-g" />
                  </div>
                )}{' '}
                <div className="absolute left-1/2 top-[15px] w-[20px] -translate-x-1/2 transform tablet:top-[36px] tablet:w-[50px]">
                  {item === 20 && (
                    <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/desk-pg.svg`} alt="desk-pg" />
                  )}
                </div>
                {item === 40 && (
                  <div className="absolute left-1/2 top-[15px] w-[13px] -translate-x-1/2 transform tablet:top-[36px] tablet:w-[35px]">
                    <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/desk-r.svg`} alt="desk-r" />
                  </div>
                )}
                {item === 60 && (
                  <div className="absolute left-1/2 top-[15px] w-[20px] -translate-x-1/2 transform tablet:top-[36px] tablet:w-[50px]">
                    <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/desk-nc.svg`} alt="desk-nc" />
                  </div>
                )}
                {item === 80 && (
                  <div className="absolute left-1/2 top-[15px] w-[13px]  -translate-x-1/2 transform tablet:top-[36px] tablet:w-[35px]">
                    <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/ratings/desk-x.svg`} alt="desk-x" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-7 flex justify-end gap-[15px] tablet:mt-[75px] tablet:gap-[34px]">
          <Button variant={'danger'} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={'submit'}
            onClick={() => {
              toast.info('This feature will soon be available');
              // setIsLoading(true);
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
