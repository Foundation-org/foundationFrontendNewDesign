import React, { useState, useEffect, useRef } from 'react';
import loadscript from 'load-script';
import { useDispatch } from 'react-redux';
import { setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';

// SoundCloud widget API
//  https://developers.soundcloud.com/docs/api/html5-widget

function SoundcloudWidget({ SCurl, playing, questId, handleVideoEnded }) {
  // state
  const dispatch = useDispatch();

  // populated once SoundCloud Widget API is loaded and initialized
  const [player, setPlayer] = useState(null);

  // ref for iframe element - https://reactjs.org/docs/refs-and-the-dom.html
  const iframeRef = useRef(null);

  // initialization - load soundcloud widget API and set SC event listeners
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
      if (playing && playerIsPaused) {
        player.play();
      } else if (!playing && !playerIsPaused) {
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
      src={`https://w.soundcloud.com/player/?url=${SCurl}`}
    ></iframe>
  );
}

export default SoundcloudWidget;
