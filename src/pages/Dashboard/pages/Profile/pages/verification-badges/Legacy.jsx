import React, { useState } from 'react';
import { legacy } from '../../../../../../constants/varification-badges';
import Button from '../../components/Button';
import LegacyBadgePopup from '../../../../../../components/dialogue-boxes/LegacyBadgePopup';

const Legacy = ({ fetchUser, handleRemoveBadgePopup, checkLegacyBadge }) => {
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [edit, setEdit] = useState(false);
  checkLegacyBadge();

  return (
    <>
      <LegacyBadgePopup
        isPopup={isPersonalPopup}
        setIsPopup={setIsPersonalPopup}
        title="Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        placeholder="Answer Here"
        edit={edit}
        setEdit={setEdit}
        fetchUser={fetchUser}
        setIsPersonalPopup={setIsPersonalPopup}
        handleRemoveBadgePopup={handleRemoveBadgePopup}
      />
      <h1 className="font-Inter text-[9.74px] font-medium text-black tablet:text-[22px] tablet:leading-[18px] dark:text-white">
        Legacy
      </h1>
      <div className="flex flex-col items-center gap-[5px] rounded-[16.068px] border-[#DEE6F7] bg-[#FDFDFD] tablet:gap-4 tablet:border-[3px] tablet:py-[22px]">
        {legacy.map((item, index) => (
          <div
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5  ${item.disabled ? 'opacity-[60%]' : ''}`}
            key={index}
          >
            <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
            <div
              className={` flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                {item.title}
              </h1>
            </div>
            <Button
              color={checkLegacyBadge() ? 'red' : 'blue'}
              disabled={item.disabled}
              onClick={() => {
                checkLegacyBadge()
                  ? handleRemoveBadgePopup({
                      title: 'Password',
                      type: 'password',
                      image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
                    })
                  : setIsPersonalPopup(true);
              }}
            >
              {checkLegacyBadge() ? 'Remove' : 'Add Badge'}
              <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                {checkLegacyBadge() ? '' : '(+0.96 FDX)'}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Legacy;
