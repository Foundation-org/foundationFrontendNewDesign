import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';
import { useSelector } from 'react-redux';
import * as questUtilsActions from '../../features/quest/utilsSlice';

function SoundcloudWidget({ SCurl, playing, questId }) {
  const dispatch = useDispatch();
  const iframeRef = useRef(null);
  const questUtilsState = useSelector(getQuestUtils);
  const playerRef = useRef(null);
  const questUtilsStatRef = useRef(null);
  const playingRef = useRef(null);
  const questIdRef = useRef(null);

  useEffect(() => {
    questUtilsStatRef.current = questUtilsState;
  }, [questUtilsState]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    questIdRef.current = questId;
  }, [questId]);

  useEffect(() => {
    const widget = SC.Widget(iframeRef.current);
    playerRef.current = widget;

    widget.bind(SC.Widget.Events.PLAY, () => {
      widget.isPaused((playerIsPaused) => {
        if (!playerIsPaused) {
          dispatch(setPlayingPlayerId(questId));
          dispatch(toggleMedia(true));
          dispatch(setIsShowPlayer(true));
        }
      });
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
      widget.isPaused((playerIsPaused) => {
        if (playerIsPaused) dispatch(toggleMedia(false));
      });
    });

    widget.bind(SC.Widget.Events.FINISH, () => {
      handleVideoEnded();
    });

    widget.bind(SC.Widget.Events.ERROR, (error) => {
      console.error('SoundCloud Widget Error', error);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!playerRef.current) return; // player loaded async - make sure available

    if (playing) {
      playerRef.current.play();
    } else if (!playing) {
      playerRef.current.pause();
    }
  }, [playing]);

  const handleVideoEnded = () => {
    if (questUtilsStatRef.current.loop === true) {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.play(); // Resume playback
      }
    } else {
      const index = questUtilsStatRef.current.playingIds.findIndex(
        (mediaId) => mediaId === questUtilsStatRef.current.playerPlayingId,
      );
      if (index !== -1 && index + 1 < questUtilsStatRef.current.playingIds.length) {
        dispatch(questUtilsActions.setPlayingPlayerId(questUtilsStatRef.current.playingIds[index + 1]));
      } else if (
        index !== -1 &&
        index + 1 >= questUtilsStatRef.current.playingIds.length &&
        questUtilsStatRef.current.hasNextPage === false
      ) {
        dispatch(questUtilsActions.setPlayingPlayerId(questUtilsStatRef.current.playingIds[0]));
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
