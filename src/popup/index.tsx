import styled from 'styled-components';

import './index.css';

import { useState } from 'react';

import { ControllerMessageType } from '~types/ControllerMessageType';
import tabs from '~util/tabs';

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

  const handlePlay = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.PLAY
    });
  };

  const handlePlayPause = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    console.log({ musicTab });
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.PLAY_PAUSE
    });
  };

  const handlePause = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.PAUSE
    });
  };

  const handleSkip = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.NEXT
    });
  };

  const handlePrevious = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.PREVIOUS
    });
  };

  const handleToggleLike = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.TOGGLE_LIKE
    });
  };

  const handleToggleDislike = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.TOGGLE_DISLIKE
    });
  };

  const handleSeekTo10s = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.SEEK_TO,
      body: {
        time: 10
      }
    });
  };

  const handleSetVolumeTo50 = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.SET_VOLUME,
      body: {
        volume: 50
      }
    });
  };

  const handleSetTrack = async () => {
    const musicTab = await tabs.getMusicServiceTab();
    chrome.tabs.sendMessage(musicTab.id, {
      type: ControllerMessageType.START_TRACK,
      body: {
        trackId
      }
    });
  };

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
      <label htmlFor="track-id">Track ID: </label>
      <input
        id="track-id"
        type="text"
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
      />
      <Button onClick={handleSetTrack}>Set Track</Button>
    </Container>
  );
};

export default Popup;
