import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Button } from '../../../../../components/ui/Button';
import Carousel from '../../../../../components/ui/Carousel';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';

export default function AddPictureUrls({ handleTab }) {
  const dispatch = useDispatch();
  const getPicMediaStates = useSelector(pictureMediaAction.getPicsMedia);
  const getUrlsOptions = useSelector(pictureMediaAction.pictureUrlValues);
  const getPictureUrls = useSelector(pictureMediaAction.validatedPicUrls);

  const urlVerification = async (id, value, index) => {
    if (getUrlsOptions[index].validatedPicUrl === value) return;

    dispatch(pictureMediaAction.checkPictureUrl({ id, value, index }));
  };

  const addNewOption = () => {
    dispatch(pictureMediaAction.addNewOption());
  };

  return (
    <div>
      {getPicMediaStates?.isPicMedia && (
        <div className="w-[calc(100%-51.75px] relative mx-[15px] mt-3 flex flex-col gap-[6px] rounded-[7.175px] border border-[#DEE6F7] p-[15px] px-[5px] py-[10px] tablet:mx-11 tablet:mt-[25px] tablet:gap-[15px] tablet:border-[2.153px] tablet:px-[15px] tablet:py-[25px]">
          <h1 className="absolute -top-[5.5px] left-5 bg-white text-[10px] font-semibold leading-[10px] text-[#707175] tablet:-top-[11px] tablet:left-9 tablet:text-[20px] tablet:leading-[20px]">
            Image
          </h1>
          <div
            className="absolute -right-[7px] -top-[5px] z-0 cursor-pointer tablet:-right-5 tablet:-top-[26px]"
            onClick={() => {
              dispatch(pictureMediaAction.clearPicsMedia());
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
              alt="mediaCloseIcon"
              className="size-[15px] tablet:size-[41px]"
            />
          </div>
          {getPictureUrls[0] !== '' && <Carousel data={getPictureUrls} />}
          {getUrlsOptions.map(
            (item, index) =>
              item.picUrlStatus.tooltipName !== 'Answer is Verified' && (
                <div key={item.id} className="flex w-full items-center justify-between">
                  <div className="flex w-full">
                    <TextareaAutosize
                      id={item.id}
                      value={item.picUrl}
                      onChange={(e) => {
                        dispatch(pictureMediaAction.addOptionById({ id: `index-${index}`, option: e.target.value }));
                      }}
                      tabIndex={index + 2}
                      onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                      onBlur={(e) =>
                        e.target.value.trim() !== '' && urlVerification(item.id, e.target.value.trim(), index)
                      }
                      placeholder="Paste Flickr share link or url here..."
                      className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
                    />
                    <button
                      className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${item.picUrlStatus.color}`}
                    >
                      <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                        {item.picUrlStatus.name}
                      </div>
                      <Tooltip optionStatus={item.picUrlStatus} type="mediaURL" />
                    </button>
                  </div>
                  <div
                    className="flex w-5 items-center justify-center tablet:w-[52.78px]"
                    onClick={() => {
                      dispatch(pictureMediaAction.delOption({ id: item.id }));
                    }}
                  >
                    {getUrlsOptions?.length > 1 && (
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                        alt="trash"
                        className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
                      />
                    )}
                  </div>
                </div>
              ),
          )}
          {getUrlsOptions[getUrlsOptions.length - 1].picUrlStatus.tooltipName === 'Answer is Verified' && (
            <Button variant="addEmbeded" className="px-2 tablet:px-[25px]" onClick={addNewOption}>
              + Add Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
