// THIS FILE IS A TEMPORARY PLACEHOLDER FOR TESTING PURPOSES ONLY

import styled from 'styled-components';

import './index.css';

import { useEffect, useState } from 'react';

import { ControllerMessageType } from '~types/ControllerMessageType';
import { getMusicServiceTab } from '~util/tabs';

const Container = styled.div`
  width: 300px;
  height: 400px;
  overflow-y: scroll;
`;

const Button = styled.button`
  background-color: #e69422;
  border: none;
  border-radius: 5px;
  padding: 5px 20px;
  font-size: 16px;
  cursor: pointer;
  display: block;
  margin: 10px auto;
`;

const Popup = () => {
  const [trackId, setTrackId] = useState('');
  const [albumId, setAlbumId] = useState('');

  const sendToTab = async (message: any) => {
    const musicTab = await getMusicServiceTab();
    return chrome.tabs.sendMessage(musicTab.id, message);
  };

  const handlePlay = async () => {
    await sendToTab({
      type: ControllerMessageType.PLAY
    });
  };

  const handlePlayPause = async () => {
    await sendToTab({
      type: ControllerMessageType.PLAY_PAUSE
    });
  };

  const handlePause = async () => {
    await sendToTab({
      type: ControllerMessageType.PAUSE
    });
  };

  const handleSkip = async () => {
    await sendToTab({
      type: ControllerMessageType.NEXT
    });
  };

  const handlePrevious = async () => {
    await sendToTab({
      type: ControllerMessageType.PREVIOUS
    });
  };

  const handleToggleLike = async () => {
    await sendToTab({
      type: ControllerMessageType.TOGGLE_LIKE
    });
  };

  const handleToggleDislike = async () => {
    await sendToTab({
      type: ControllerMessageType.TOGGLE_DISLIKE
    });
  };

  const handleSeekTo10s = async () => {
    await sendToTab({
      type: ControllerMessageType.SEEK_TO,
      body: {
        time: 10
      }
    });
  };

  const handleSetVolumeTo50 = async () => {
    await sendToTab({
      type: ControllerMessageType.SET_VOLUME,
      body: {
        volume: 50
      }
    });
  };

  const handleStartTrack = async () => {
    const body = {
      trackId
    } as any;

    if (albumId) {
      body.albumId = albumId;
    }

    await sendToTab({
      type: ControllerMessageType.START_TRACK,
      body
    });
  };

  const handlePrepareForSession = async () => {
    await sendToTab({
      type: ControllerMessageType.PREPARE_FOR_SESSION
    });
  };

  const handleToggleRepeat = async () => {
    await sendToTab({
      type: ControllerMessageType.TOGGLE_REPEAT_MODE
    });
  };

  const handleGetPlayerState = async () => {
    sendToTab({
      type: ControllerMessageType.GET_PLAYER_STATE,
      body: {
        awaitResponse: true
      }
    }).then(console.info);
  };

  const handleGetCurrentSongInfo = async () => {
    sendToTab({
      type: ControllerMessageType.GET_CURRENT_SONG_INFO,
      body: {
        awaitResponse: true
      }
    }).then(console.info);
  };

  const handleGetQueue = async () => {
    sendToTab({
      type: ControllerMessageType.GET_QUEUE,
      body: {
        awaitResponse: true
      }
    }).then(console.info);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
      console.info('Received message from background', message);
      sendResponse(undefined);
    });
  });

  return (
    <Container>
      <Button onClick={handlePlay}>Play</Button>
      <Button onClick={handlePlayPause}>Play/Pause</Button>
      <Button onClick={handlePause}>Pause</Button>
      <Button onClick={handleSkip}>Skip</Button>
      <Button onClick={handlePrevious}>Previous</Button>
      <Button onClick={handleToggleLike}>Toggle Like</Button>
      <Button onClick={handleToggleDislike}>Toggle Dislike</Button>
      <Button onClick={handleSeekTo10s}>Seek To 10s</Button>
      <Button onClick={handleSetVolumeTo50}>Set Volume to 50%</Button>
      <Button onClick={handlePrepareForSession}>Prepare For Session</Button>
      <Button onClick={handleToggleRepeat}>
        Toggle Repeat (None, One, All)
      </Button>
      <label htmlFor="track-id">Track ID: </label>
      <input
        id="track-id"
        type="text"
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
      />
      <label htmlFor="track-id">Album ID: </label>
      <input
        id="album-id"
        type="text"
        value={albumId}
        onChange={(e) => setAlbumId(e.target.value)}
      />
      <Button onClick={handleStartTrack}>Start Track</Button>
      <Button onClick={handleGetPlayerState}>Get Player State</Button>
      <Button onClick={handleGetCurrentSongInfo}>Get Current Song Info</Button>
      <Button onClick={handleGetQueue}>Get Queue</Button>
    </Container>
  );
};

export default Popup;
