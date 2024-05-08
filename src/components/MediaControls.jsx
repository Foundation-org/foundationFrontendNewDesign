import { useDispatch } from 'react-redux';
import { getQuestUtils, toggleMedia } from '../features/quest/utilsSlice';
import * as questUtilsActions from '../features/quest/utilsSlice';
import { useSelector } from 'react-redux';

export default function MediaControls() {
  const dispatch = useDispatch();
  const questUtilsState = useSelector(getQuestUtils);

  const scrollToPlayingCard = () => {
    const playingCard = document.getElementById('playing-card');
    console.log(playingCard);
    if (playingCard) {
      playingCard.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const runLoop = () => {
    dispatch(questUtilsActions.toggleLoop(!questUtilsState.loop));
  };
  const playPrevious = () => {
    const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
    if (index !== -1 && index - 1 >= 0) {
      dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index - 1]));
      dispatch(questUtilsActions.toggleMedia(true));
    }
  };
  const playNext = () => {
    const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
    if (index !== -1 && index + 1 < questUtilsState.playingIds.length) {
      dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index + 1]));
      dispatch(questUtilsActions.toggleMedia(true));
    } else if (index !== -1 && index + 1 >= questUtilsState.playingIds.length) {
      dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[0]));
      dispatch(questUtilsActions.toggleMedia(true));
    }
  };

  return (
    <div className="mt-5 flex w-max items-center justify-center gap-2 rounded-[9.211px] border-[2.86px] border-[#CECFD1] bg-white px-4 py-2 tablet:w-fit tablet:max-w-[300px] tablet:gap-3 tablet:rounded-[14px] tablet:py-3">
      {/* {questUtilsState.loop ? 'Loop' : 'Series'} */}
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/player/${questUtilsState.loop ? 'loop.svg' : 'series.svg'}`}
        onClick={runLoop}
        className="size-6 tablet:size-[33px]"
      />
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/player/back.svg`}
        className={`${
          questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId) === 0
            ? 'opacity-[60%]'
            : 'opacity-[100%]'
        } size-6 tablet:size-[33px]`}
        onClick={playPrevious}
      />

      <button
        onClick={() => dispatch(toggleMedia(questUtilsState.isMediaPlaying === true ? false : true))}
        className="flex w-[22px] min-w-[22px] items-center justify-center"
      >
        {!questUtilsState.isMediaPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="21"
            // height="25"
            viewBox="0 0 21 25"
            fill="none"
            className="size-6 tablet:h-[28px] tablet:w-6"
          >
            <path
              d="M19.5253 13.3939C20.3609 12.8717 20.3609 11.6547 19.5253 11.1325L2.04003 0.204789C1.15194 -0.350236 0 0.288241 0 1.3355V23.1909C0 24.2381 1.15194 24.8766 2.04003 24.3216L19.5253 13.3939Z"
              fill="#707175"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="19"
            // height="28"
            viewBox="0 0 19 28"
            fill="none"
            className="size-6 tablet:h-[28px] tablet:w-6"
            // className="h-[28px] w-[19px]"
          >
            <rect x="0.152344" width="5.50743" height="27.1422" rx="0.941346" fill="#707175" />
            <rect x="12.7383" width="5.50743" height="27.1422" rx="0.941346" fill="#707175" />
          </svg>
        )}
      </button>
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/player/next.svg`}
        onClick={playNext}
        className="size-6 tablet:size-[33px]"
      />
      <button
        className="rounded-[3.892px] bg-[#A3A3A3] px-4 py-2 text-[10px] font-medium leading-normal text-white tablet:rounded-[7.78px] tablet:py-2 tablet:text-[18px]"
        onClick={() => {
          scrollToPlayingCard();
        }}
      >
        Playing
      </button>
    </div>
  );
}
