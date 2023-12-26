import 'https://sdk.scdn.co/spotify-player.js';

import { createContext, useContext, useEffect, useState } from 'react';

import { createMusicControllerHandler } from '~contents/lib/message-handlers/createMusicControllerHandler';
import { createObserverEmitterHandler } from '~contents/lib/message-handlers/createObserverEmitterHandler';
import { createTabsHandler } from '~contents/lib/message-handlers/createTabsHandler';
import { SpotifyDesktopController } from '~contents/spotify-desktop/SpotifyDesktopController';
import { SpotifyDesktopObserver } from '~contents/spotify-desktop/SpotifyDesktopObserver';
import { getSpotifyApi } from '~services/spotify';
import { useAppDispatch } from '~store';
import { connectToReduxHub } from '~util/connectToReduxHub';

const SYNQ_PLAYER_NAME = 'SynQ Player';
const MAX_RETRIES = 20;

interface SpotifyPlayerContextValue {
  deviceId?: string;
  player?: Spotify.Player;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextValue>({});

interface SpotifyPlayerProviderProps {
  children: React.ReactNode;
  extensionId: string;
}

let spotfiyPlayerReady = false;

window.onSpotifyWebPlaybackSDKReady = () => {
  spotfiyPlayerReady = true;
};

let setupRan = false;

export const SpotifyPlayerProvider = ({
  children,
  extensionId
}: SpotifyPlayerProviderProps) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [deviceId, setDeviceId] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setup = async () => {
      const spotifyApi = getSpotifyApi();

      const authResponse = await spotifyApi.authenticate();

      if (!authResponse.authenticated) {
        console.error('Failed to authenticate with Spotify');
      }

      let count = 0;

      const interval = setInterval(async () => {
        if (!spotfiyPlayerReady) {
          count++;
          if (count > MAX_RETRIES) {
            console.error('Failed to load Spotify Player');
            return;
          }
          return;
        }

        clearInterval(interval);

        const newPlayer = new window.Spotify.Player({
          name: SYNQ_PLAYER_NAME,
          getOAuthToken: (cb: any) => {
            cb(authResponse.accessToken.access_token);
          },
          volume: 0.5
        });

        newPlayer.on('ready', async ({ device_id }: any) => {
          await spotifyApi.player.transferPlayback([device_id]);
          setDeviceId(device_id);
          console.info('Ready with Device ID', device_id);
        });

        const hub = connectToReduxHub(extensionId);

        const controller = new SpotifyDesktopController(newPlayer, spotifyApi);
        const observer = new SpotifyDesktopObserver(
          newPlayer,
          controller,
          hub,
          dispatch
        );

        createMusicControllerHandler(controller, hub);
        createObserverEmitterHandler(observer, hub);
        createTabsHandler(controller, observer, hub);

        observer.observe();

        await newPlayer.connect();

        setPlayer(newPlayer);
      }, 500);
    };

    setup();

    setupRan = true;
  }, [setPlayer]);

  const value: SpotifyPlayerContextValue = {
    deviceId,
    player
  };

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);
