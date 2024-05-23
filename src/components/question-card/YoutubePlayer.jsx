import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';
import { useSelector } from 'react-redux';
import * as questUtilsActions from '../../features/quest/utilsSlice';

let loadYT;

const YouTubePlayer = ({ YTid, width = 640, height = 390, playing, questId }) => {
  const dispatch = useDispatch();
  const youtubePlayerAnchor = useRef(null);
  const playerRef = useRef(null);
  const playingRef = useRef(playing);
  const questIdRef = useRef(questId);
  const questUtilsState = useSelector(getQuestUtils);
  // Update the ref value whenever questId changes
  useEffect(() => {
    questIdRef.current = questId;
  }, [questId]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (!loadYT) {
      loadYT = new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      });
    }

    loadYT.then((YT) => {
      playerRef.current = new YT.Player(youtubePlayerAnchor.current, {
        height,
        width,
        videoId: YTid,
        playerVars: {
          autoplay: playingRef.current ? 1 : 0,
          mute: playingRef.current ? 1 : 0,
        },
        events: {
          onStateChange: (event) => {
            if (event.data == YT.PlayerState.PLAYING) {
              dispatch(setPlayingPlayerId(questIdRef.current));
              dispatch(toggleMedia(true));
              dispatch(setIsShowPlayer(true));
            }
            if (event.data == YT.PlayerState.PAUSED) {
              dispatch(toggleMedia(false));
            }
            if (event.data == YT.PlayerState.ENDED) {
              handleVideoEnded();
            }
          },
          onError: (e) => {
            if (onError) onError(e);
          },
        },
      });
    });
  }, [YTid, width, height, dispatch]);

  // Effect to start/stop video based on 'playing' prop
  useEffect(() => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [playing]);

  const handleVideoEnded = () => {
    console.log('first', questUtilsState.loop);
    if (questUtilsState.loop === true) {
      if (playerRef.current) {
        console.log('player', playerRef.current);
        playerRef.current.seekTo(0);
        playerRef.current.playVideo(); // Resume playback
      }
    } else {
      console.log('player', playerRef.current);
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

  return <div className="youtube-iframe" ref={youtubePlayerAnchor}></div>;
};

export default YouTubePlayer;
