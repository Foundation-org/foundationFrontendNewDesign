import { useState } from 'react';
import FullScreenPicturePopup from '../dialogue-boxes/FullScreenPicturePopup';

export const EmbededImage = ({ description, url }) => {
  const [imageDialogue, setImageDialogue] = useState(false);

  const openDialogue = () => setImageDialogue(true);
  const closeDialogue = () => setImageDialogue(false);

  return (
    <div className="mx-[22px] mb-2 mt-[12px] rounded-[9.183px] border border-[#DEE6F7] px-[5px] py-2 tablet:mx-[60px] tablet:mb-[14px] tablet:mt-[23px] tablet:border-[2.755px] tablet:px-2">
      <FullScreenPicturePopup handleClose={closeDialogue} modalVisible={imageDialogue} content={url} />
      {/* <h2 className="mb-1 text-[8px] font-medium text-[#7C7C7C] tablet:text-[14.692px]">{description}</h2> */}
      <img
        src={url}
        className="h-[138px] w-full rounded-[4.098px] object-contain tablet:h-[372px] tablet:rounded-[15px]"
        onClick={openDialogue}
      />
    </div>
  );
};
