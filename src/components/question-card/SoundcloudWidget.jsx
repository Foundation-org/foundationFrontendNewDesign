import React, { useState, useEffect, useRef } from 'react';
import loadscript from 'load-script';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';

// SoundCloud widget API
//  https://developers.soundcloud.com/docs/api/html5-widget

function SoundcloudWidget({ SCurl, playing, questId }) {
  // state
  const dispatch = useDispatch();
  const questUtilsState = useSelector(getQuestUtils);

  // populated once SoundCloud Widget API is loaded and initialized
  const [player, setPlayer] = useState(null);

  // ref for iframe element - https://reactjs.org/docs/refs-and-the-dom.html
  const iframeRef = useRef(null);

  // initialization - load soundcloud widget API and set SC event listeners
  const handleVideoEnded = () => {
    console.log('running');
    if (questUtilsState.loop) {
      if (player) {
        player.seekTo(0);
        player.play();
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
  useEffect(() => {
    // use load-script module to load SC Widget API
    loadscript('https://w.soundcloud.com/player/api.js', () => {
      // initialize player and store reference in state
      const player = window.SC.Widget(iframeRef.current);
      setPlayer(player);

      const { PLAY, PAUSE, FINISH, ERROR } = window.SC.Widget.Events;

      // NOTE: closures created - cannot access react state or props from within and SC callback functions!!
      player.bind(PLAY, () => {
        // update state to playing
        dispatch(setPlayingPlayerId(questId));
        dispatch(toggleMedia(true));
        dispatch(setIsShowPlayer(true));
      });

      player.bind(PAUSE, () => {
        // update state if player has paused - must double check isPaused since false positives
        player.isPaused((playerIsPaused) => {
          if (playerIsPaused) dispatch(toggleMedia(false));
        });
      });

      player.bind(FINISH, () => {
        handleVideoEnded();
      });

      player.bind(ERROR, (e) => {
        console.error('SoundCloud Player Error:', e);
      });
    });
  }, [dispatch, questId, handleVideoEnded]);

  // integration - update SC player based on new state (e.g. play button in React section was clicked)
  // adjust playback in SC player to match isPlaying state
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available

    player.isPaused((playerIsPaused) => {
      if (!playing && playerIsPaused) {
        player.play();
      } else if (playing && !playerIsPaused) {
        player.pause();
      }
    });
  }, [playing, player]);

  return (
    <iframe
      className="soundcloud-iframe"
      ref={iframeRef}
      id="sound-cloud-player"
      style={{ border: 'none', width: '100%' }}
      scrolling="no"
      allow="autoplay"
      src={`https://w.soundcloud.com/player/?url=${SCurl}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_playcount=false&sharing=false&buying=false&download=false&single_active=true`}
    ></iframe>
  );
}

export default SoundcloudWidget;
