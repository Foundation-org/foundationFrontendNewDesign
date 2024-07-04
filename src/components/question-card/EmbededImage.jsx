import { useState } from 'react';
import FullScreenPictureViewer from '../dialogue-boxes/FullScreenPictureViewer';
import Carousel from '../ui/Carousel';
import SwiperMainCarousel from '../swiper/SwiperMainCarousel';

export const EmbededImage = ({ description, url, id }) => {
  const [imageDialogue, setImageDialogue] = useState(false);

  const openDialogue = () => setImageDialogue(true);
  const closeDialogue = () => setImageDialogue(false);

  return (
    <div className="mx-[22px] mt-[12px] rounded-[9.183px] border border-[#DEE6F7] py-2 tablet:mx-[60px] tablet:mt-[23px] tablet:border-[2.755px]">
      <FullScreenPictureViewer handleClose={closeDialogue} modalVisible={imageDialogue} content={url} />
      {/* <h2 className="mb-1 text-[8px] font-medium text-[#7C7C7C] tablet:text-[14.692px]">{description}</h2> */}
      {url?.length === 1 ? (
        <img
          src={url[0]}
          className="h-[138px] w-full rounded-[4.098px] object-contain tablet:h-[372px] tablet:rounded-[15px]"
          onClick={openDialogue}
        />
      ) : (
        <>
          {/* <Carousel data={url} /> */}
          <SwiperMainCarousel images={url} id={id} />
        </>
      )}
    </div>
  );
};
