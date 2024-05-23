import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';
import { useSelector } from 'react-redux';

function SoundcloudWidget({ SCurl, playing, questId }) {
  const iframeRef = useRef(null);
  const dispatch = useDispatch();
  const questUtilsState = useSelector(getQuestUtils);

  useEffect(() => {
    const widget = SC.Widget(iframeRef.current);

    widget.bind(SC.Widget.Events.READY, () => {
      console.log('SoundCloud Widget Ready');
    });

    widget.bind(SC.Widget.Events.PLAY, () => {
      dispatch(setPlayingPlayerId(questId));

      if (!playing) {
        dispatch(toggleMedia(true));
      }
      dispatch(setIsShowPlayer(true));
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
      console.log('SoundCloud Widget Pause');
      if (playing) {
        dispatch(toggleMedia(false));
      }
    });

    widget.bind(SC.Widget.Events.FINISH, () => {
      console.log('SoundCloud Widget Finish');
    });

    widget.bind(SC.Widget.Events.ERROR, (error) => {
      console.error('SoundCloud Widget Error', error);
      handleVideoEnded();
    });
  }, []);

  const handleVideoEnded = () => {
    if (questUtilsState.loop === true) {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.getInternalPlayer().play(); // Resume playback
      }
    } else {
      const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
      if (index !== -1 && index + 1 < questUtilsState.playingIds.length) {
        dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index + 1]));
      } else if (
        index !== -1 &&
        index + 1 >= questUtilsState.playingIds.length &&
        questUtilsState.hasNextPage === false
      ) {
        dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[0]));
      }
    }
  };

  return (
    <iframe
      ref={iframeRef}
      className="soundcloud-iframe"
      width="100%"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={`https://w.soundcloud.com/player/?url=${SCurl}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_playcount=false&sharing=false&buying=false&download=false&single_active=true`}
    ></iframe>
  );
}

export default SoundcloudWidget;
